const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getLoggedInUser } = require('../controllers/authController');
const auth = require('../middleware/auth');
// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);
router.get('/', auth, getLoggedInUser);
module.exports = router;