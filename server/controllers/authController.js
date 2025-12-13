const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendVerificationEmail = require('../utils/sendEmail');

// ## REGISTER A NEW USER
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields (name, email, password)' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Please provide a valid email address' });
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password before creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create user with hashed password
    user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      verificationToken 
    });
    
    // Save user first
    await user.save();
    
    // Send verification email (if this fails, user is still created and can request resend)
    try {
      console.log("Sending Email to:", user.email);
      await sendVerificationEmail(user.email, verificationToken);
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError.message);
      console.error('Full email error:', emailError);
      // User is still created, but email wasn't sent
      // Return a more informative error to the client
      return res.status(500).json({ 
        msg: 'User registered but failed to send verification email. Please contact support.',
        error: emailError.message 
      });
    }
    
    res.status(201).json({ msg: 'Registration successful. Please check your email to verify your account.' });

  } catch (err) {
    console.error(err.message);
    // Handle duplicate email error from MongoDB
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// ## LOGIN A USER
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
        return res.status(401).json({ msg: 'Please verify your email address before logging in.' });
    }

    // Create and return a JSON Web Token (JWT)
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ## VERIFY USER'S EMAIL
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        // Explicitly select the verificationToken because it has `select: false` in the schema
        const user = await User.findOne({ verificationToken: token }).select('+verificationToken');
        if (!user) {
            // Send a 400 error if the token is invalid or already used
            return res.status(400).json({ msg: 'Invalid or expired verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        // Send a success response back to the frontend
        res.json({ msg: 'Email verified successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// ## GET LOGGED IN USER'S DATA
exports.getLoggedInUser = async (req, res) => {
  try {
    // req.user.id is available from the 'auth' middleware
    const user = await User.findById(req.user.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
