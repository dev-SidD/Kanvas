const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createBoard,
  getBoardsByWorkspace,
  getBoardById
} = require('../controllers/boardController');

// Routes are now more specific
// Get all boards for a workspace
router.get('/workspace/:workspaceId', auth, getBoardsByWorkspace);

// Create a board in a workspace
router.post('/workspace/:workspaceId', auth, createBoard);

// Get a single board by its ID
router.get('/:boardId', auth, getBoardById);

module.exports = router;