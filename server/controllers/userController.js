const User = require('../models/User');

// ✅ Get all users (admin use case)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get user by ID (with workspaces + tasks populated)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('workspaces')
      .populate({
        path: 'tasks',
        populate: [
          { path: 'boardId', select: 'title' },
          { path: 'listId', select: 'title' },
          { path: 'members', select: 'name email avatarUrl' }
        ]
      })
      .select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get only tasks of a user
exports.getUserTasks = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'tasks',
        select: 'title description dueDate listId boardId',
        populate: [
          { path: 'boardId', select: 'title' },
          { path: 'listId', select: 'title' },
          { path: 'members', select: 'name email avatarUrl' }
        ]
      })
      .select('tasks');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get logged-in user profile
exports.getMyProfile = async (req, res) => {
  try {
    console.log(req.user)
    const user = await User.findById(req.user.user.id)
      .populate('workspaces')
      .populate({
        path: 'tasks',
        select: 'title description dueDate listId boardId',
        populate: [
          { path: 'boardId', select: 'title' },
          { path: 'listId', select: 'title' },
          { path: 'members', select: 'name email avatarUrl' }
        ]
      })
      .select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Update logged-in user (name & avatar only for now)
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, avatarUrl } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.user.id,
      { name, avatarUrl },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Delete logged-in user
exports.deleteMyProfile = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.user.id);

    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
