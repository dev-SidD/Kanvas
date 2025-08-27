const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// ✅ Get own profile
router.get('/me', auth, userController.getMyProfile);

// ✅ Update own profile
router.put('/me', auth, userController.updateMyProfile);

// ✅ Delete own profile
router.delete('/me', auth, userController.deleteMyProfile);

// ✅ (Optional) Admin-only: Get all users
router.get('/', auth, userController.getAllUsers);

// ✅ (Optional) Admin-only: Get user by ID
router.get('/:id', auth, userController.getUserById);

// ✅ (Optional) Get tasks of a specific user
router.get('/:id/tasks', auth, userController.getUserTasks);

module.exports = router;
