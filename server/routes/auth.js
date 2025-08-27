const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getLoggedInUser, verifyEmail } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/auth/verify/:token
// @desc    Verify user's email
// @access  Public
router.get('/verify/:token', verifyEmail);

// @route   GET api/auth
// @desc    Get logged in user data
// @access  Private
router.get('/', auth, getLoggedInUser);

module.exports = router;
