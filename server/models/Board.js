const mongoose = require('mongoose');

// A sub-schema for the color-coded labels
const LabelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
}, { _id: false }); // _id is not needed for sub-documents

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
  // Ordered array of List IDs belonging to this board
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  }],
  // Array of available labels for this board
  labels: [LabelSchema]
}, { timestamps: true });

module.exports = mongoose.model('Board', BoardSchema);