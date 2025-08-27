// routes/notifications.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', auth, notificationController.getNotifications);

// @route   PATCH api/notifications/:notificationId/read
// @desc    Mark a notification as read
// @access  Private
router.patch('/:notificationId/read', auth, notificationController.markAsRead);
router.patch('/read-all', auth, notificationController.markAllAsRead);
module.exports = router; // Make sure this line exists and is correct