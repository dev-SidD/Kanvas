const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cardController = require('../controllers/cardController');
const checklistController = require('../controllers/checklistController'); // 1. Import the new controller

// --- Card Routes ---
router.get('/board/:boardId', auth, cardController.getCardsByBoard);
router.get('/:cardId', auth, cardController.getCardById);
router.post('/', auth, cardController.createCard);
router.put('/:cardId', auth, cardController.updateCard);
router.put('/move/:cardId', auth, cardController.moveCard);

// --- Checklist Routes (Nested under a card) ---
// 2. Add the new routes for checklist management

router.post('/:cardId/checklists', auth, checklistController.addChecklist);
router.post('/:cardId/checklists/:checklistId/items', auth, checklistController.addChecklistItem);
router.put('/:cardId/checklists/:checklistId/items/:itemId', auth, checklistController.updateChecklistItem);

module.exports = router;