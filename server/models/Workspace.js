const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    }
  }],
  boards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Workspace', WorkspaceSchema);