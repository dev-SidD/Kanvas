const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendVerificationEmail = require('../utils/sendEmail');

// ## REGISTER A NEW USER
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });
    
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Generate and save a verification token
    console.log("hello")
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    console.log("hello2")
    await user.save();

    // Send the verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ msg: 'Registration successful. Please check your email to verify your account.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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
