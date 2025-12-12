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
    default: '',
  },
  workspaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
  }],
  // --- NEW FIELDS FOR EMAIL VERIFICATION ---
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    select: false, // This will hide the token from default query results
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
