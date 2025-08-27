const Card = require('../models/Card');
const mongoose = require('mongoose');

// ## ADD A CHECKLIST TO A CARD
exports.addChecklist = async (req, res) => {
  const { cardId } = req.params;
  const { title } = req.body;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ msg: 'Card not found' });

    const newChecklist = {
      _id: new mongoose.Types.ObjectId(), // Manually generate an ID
      title,
      items: []
    };
    
    card.checklists.push(newChecklist);
    await card.save();
    
    res.status(201).json(card.checklists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## ADD AN ITEM TO A CHECKLIST
exports.addChecklistItem = async (req, res) => {
  const { cardId, checklistId } = req.params;
  const { text } = req.body;

  try {
    const card = await Card.findById(cardId);
    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ msg: 'Checklist not found' });
    
    const newItem = {
      _id: new mongoose.Types.ObjectId(),
      text,
      isComplete: false
    };

    checklist.items.push(newItem);
    await card.save();
    
    res.status(201).json(card.checklists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## UPDATE A CHECKLIST ITEM
exports.updateChecklistItem = async (req, res) => {
  const { cardId, checklistId, itemId } = req.params;
  const { text, isComplete } = req.body;

  try {
    const card = await Card.findById(cardId);
    const checklist = card.checklists.id(checklistId);
    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ msg: 'Checklist item not found' });

    // Update fields if they are provided in the request body
    if (text) item.text = text;
    if (isComplete !== undefined) item.isComplete = isComplete;
    
    await card.save();
    
    res.json(card.checklists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};