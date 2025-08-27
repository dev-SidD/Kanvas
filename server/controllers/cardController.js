const Card = require('../models/Card');
const List = require('../models/List');
const User = require('../models/User');
const Notification = require('../models/Notification');

// ## CREATE A CARD
exports.createCard = async (req, res) => {
  const { title, listId, boardId, members, dueDate } = req.body;
  const senderId = req.user.user.id; 

  try {
    const newCard = new Card({ title, listId, boardId, members, dueDate });
    const card = await newCard.save();

    await List.findByIdAndUpdate(listId, { $push: { cards: card._id } });

    if (members && members.length > 0) {
      await User.updateMany(
        { _id: { $in: members } },
        { $push: { tasks: card._id } }
      );

      let message = `You were assigned to the new card "${card.title}"`;
      if (card.dueDate) {
        message += ` which is due on ${new Date(card.dueDate).toLocaleDateString()}`;
      }

      const notifications = members.map(memberId => ({
        recipient: memberId,
        sender: senderId,
        type: 'assignment',
        message: message,
        boardId: card.boardId,
        cardId: card._id
      }));
      const createdNotifications = await Notification.insertMany(notifications);

      for (const notification of createdNotifications) {
        req.io.to(boardId).emit('new_notification', notification);
      }
    }
    
    req.io.to(boardId).emit('card_created', card);
    
    res.status(201).json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## GET ALL CARDS FOR A BOARD
exports.getCardsByBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    const cards = await Card.find({ boardId });
    res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## GET A SINGLE CARD BY ID
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId).populate('members', 'name email avatarUrl');
    if (!card) return res.status(404).json({ msg: 'Card not found' });
    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## UPDATE A CARD
exports.updateCard = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const updates = req.body;
    
    const senderId = req.user.id; // ✅ CORRECTED THIS LINE

    // Handle member changes before updating the card
    if (updates.members) {
      const card = await Card.findById(cardId);
      const oldMembers = card.members.map(m => m.toString());
      const newMembers = updates.members;

      // Find and handle removed members
      const removedMembers = oldMembers.filter(id => !newMembers.includes(id));
      if (removedMembers.length > 0) {
        await User.updateMany(
          { _id: { $in: removedMembers } },
          { $pull: { tasks: cardId } }
        );
      }

      // Find and handle added members
      const addedMembers = newMembers.filter(id => !oldMembers.includes(id));
      if (addedMembers.length > 0) {
        await User.updateMany(
          { _id: { $in: addedMembers } },
          { $addToSet: { tasks: cardId } }
        );

        // Create notifications for newly assigned members
        const notifications = addedMembers.map(memberId => ({
          recipient: memberId,
          sender: senderId,
          type: 'assignment',
          message: `You were assigned to the card "${card.title}"`,
          boardId: card.boardId,
          cardId: card._id
        }));
        await Notification.insertMany(notifications);
      }
    }


    // Perform the update on the card itself
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $set: updates },
      { new: true }
    );
    
    if (!updatedCard) return res.status(404).json({ msg: 'Card not found' });

    if (updates.dueDate && updatedCard.members.length > 0) {
        const dueDateMessage = `The due date for "${updatedCard.title}" was updated to ${new Date(updatedCard.dueDate).toLocaleDateString()}`;
        const notifications = updatedCard.members.
        filter(memberId => memberId.toString() !== senderId).
        map(member => ({
            recipient: member._id,
            sender: senderId,
            type: 'status_update',
            message: dueDateMessage,
            boardId: updatedCard.boardId,
            cardId: updatedCard._id
        }));
        const createdNotifications = await Notification.insertMany(notifications);

        for (const notification of createdNotifications) {
            req.io.to(updatedCard.boardId.toString()).emit('new_notification', notification);
        }
    }

    // Broadcast the card update to everyone on the board
    req.io.to(updatedCard.boardId.toString()).emit('card_updated', updatedCard);
    
    res.json(updatedCard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## MOVE A CARD
exports.moveCard = async (req, res) => {
  const { cardId } = req.params;
  const {
    sourceListId,
    destListId,
    sourceCardIds,
    destCardIds,
    boardId
  } = req.body;
  const senderId = req.user.id;

  try {
    if (!boardId) {
      return res.status(400).json({ msg: 'Board ID is required for real-time updates.' });
    }

    const card = await Card.findByIdAndUpdate(cardId, { listId: destListId });
    await List.findByIdAndUpdate(sourceListId, { cards: sourceCardIds });
    await List.findByIdAndUpdate(destListId, { cards: destCardIds });

    req.io.to(boardId).emit('card_moved', {
      cardId,
      sourceListId,
      destListId,
      sourceCardIds,
      destCardIds
    });

    if (card.members && card.members.length > 0) {
      const sourceList = await List.findById(sourceListId).select('title');
      const destList = await List.findById(destListId).select('title');

      const message = `The card "${card.title}" was moved from "${sourceList.title}" to "${destList.title}"`;

      const notifications = card.members
        .filter(memberId => memberId.toString() !== senderId)
        .map(memberId => ({
          recipient: memberId,
          sender: senderId,
          type: 'status_update',
          message: message,
          boardId: boardId,
          cardId: cardId
        }));

      if (notifications.length > 0) {
        const createdNotifications = await Notification.insertMany(notifications);
        for (const notification of createdNotifications) {
          req.io.to(boardId).emit('new_notification', notification);
        }
      }
    }

    res.json({ msg: 'Card moved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ## DELETE A CARD
exports.deleteCard = async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ msg: 'Card not found' });
    }

    const { listId, boardId, members } = card;

    // 1. Remove the card from the database
    await Card.findByIdAndDelete(cardId);

    // 2. Remove the card's ID from its parent list
    await List.findByIdAndUpdate(listId, { $pull: { cards: cardId } });

    // 3. Remove the card from the 'tasks' array of all its members
    if (members && members.length > 0) {
      await User.updateMany(
        { _id: { $in: members } },
        { $pull: { tasks: cardId } }
      );
    }

    // 4. Broadcast the deletion to all clients on the board
    req.io.to(boardId.toString()).emit('card_deleted', { cardId, listId });

    res.json({ msg: 'Card deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
