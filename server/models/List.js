const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  // Ordered array of Card IDs belonging to this list
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  }]
}, { timestamps: true });

module.exports = mongoose.model('List', ListSchema);