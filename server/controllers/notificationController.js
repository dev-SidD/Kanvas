const Notification = require('../models/Notification');

// @desc    Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.user.id })
      .sort({ createdAt: -1 }) // Show newest first
      .populate('sender', 'name avatarUrl'); // Show sender's info

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Mark a single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    // Ensure the user owns the notification
    if (notification.recipient.toString() !== req.user.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ✅ NEW FUNCTION
// @desc    Mark all notifications as read for the logged-in user
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
