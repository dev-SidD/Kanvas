const mongoose = require('mongoose');

const ChecklistItemSchema = new mongoose.Schema({
  text: String,
  isComplete: { type: Boolean, default: false },
}, { _id: false });

const CardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: ''
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  labels: [String],
  checklists: [{
    title: String,
    items: [ChecklistItemSchema]
  }],
  dueDate: Date,
  
  // --- NEW FIELDS ADDED ---
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attachment'
  }],

}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);
