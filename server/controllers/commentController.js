const Comment = require('../models/Comment');
const Card = require('../models/Card');
const User = require('../models/User');

// ✅ ADD A COMMENT TO A CARD
exports.addComment = async (req, res) => {
    const { cardId } = req.params;
    const { text } = req.body;
    const userId = req.user.user.id; // From auth middleware

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ msg: 'Card not found' });
        }

        const newComment = new Comment({
            card: cardId,
            user: userId,
            text,
        });

        const comment = await newComment.save();

        // Add comment reference to the card
        card.comments.push(comment._id);
        await card.save();

        // Populate user details for the response
        const populatedComment = await Comment.findById(comment._id).populate('user', 'name avatarUrl');

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// ✅ GET ALL COMMENTS FOR A CARD
exports.getCommentsByCard = async (req, res) => {
    const { cardId } = req.params;

    try {
        const comments = await Comment.find({ card: cardId })
            .populate('user', 'name avatarUrl')
            .sort({ createdAt: 'desc' }); // Sort by most recent first

        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};