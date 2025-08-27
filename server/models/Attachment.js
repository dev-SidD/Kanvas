const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Attachment', AttachmentSchema);