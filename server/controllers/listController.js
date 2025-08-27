const List = require('../models/List');
const Board = require('../models/Board');

// ## CREATE A LIST
exports.createList = async (req, res) => {
  const { title } = req.body;
  const { boardId } = req.params;

  try {
    // Authorization check could be added here to ensure user is member of the board's workspace

    const newList = new List({ title, boardId });
    const list = await newList.save();

    // Add list to the board's lists array
    await Board.findByIdAndUpdate(boardId, { $push: { lists: list.id } });

    res.status(201).json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## GET ALL LISTS FOR A BOARD
exports.getListsByBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    const lists = await List.find({ boardId: boardId });
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## UPDATE A LIST'S TITLE
exports.updateListTitle = async (req, res) => {
    const { title } = req.body;
    const { listId } = req.params;
    try {
        const list = await List.findByIdAndUpdate(listId, { title }, { new: true });
        if (!list) return res.status(404).json({ msg: 'List not found' });
        res.json(list);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};