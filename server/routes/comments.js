const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addComment, getCommentsByCard } = require('../controllers/commentController');

// @route   POST api/comments/:cardId
// @desc    Add a comment to a card
// @access  Private
router.post('/:cardId', auth, addComment);
router.get('/:cardId', auth, getCommentsByCard);
module.exports = router;