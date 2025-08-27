// models/Notification.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  recipient: { // The user who should receive the notification
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: { // The user who triggered the notification
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['mention', 'assignment', 'status_update'], // Example types
  },
  message: {
    type: String,
    required: true,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
  },
  cardId: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);