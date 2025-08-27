const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    default: '', // Optional: provide a default avatar
  },
  workspaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace', // This creates the reference to the Workspace model
  }],
  // New field to store references to tasks assigned to this user
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card', // This creates the reference to the Card model
  }],
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);