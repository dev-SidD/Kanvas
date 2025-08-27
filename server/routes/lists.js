const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createList,
  getListsByBoard,
  updateListTitle
} = require('../controllers/listController');

// Get all lists for a board
router.get('/:boardId', auth, getListsByBoard);

// Create a new list on a board
router.post('/:boardId', auth, createList);

// Update a list's title
router.put('/:listId', auth, updateListTitle);


module.exports = router;