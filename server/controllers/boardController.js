const Board = require('../models/Board');
const Workspace = require('../models/Workspace');

// ## CREATE A BOARD
exports.createBoard = async (req, res) => {
  const { title } = req.body;
  const { workspaceId } = req.params;

  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ msg: 'Workspace not found' });
    
    const isMember = workspace.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) return res.status(401).json({ msg: 'Not authorized' });

    const newBoard = new Board({ title, workspaceId });
    const board = await newBoard.save();

    workspace.boards.push(board.id);
    await workspace.save();

    res.status(201).json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## GET ALL BOARDS FOR A WORKSPACE
exports.getBoardsByWorkspace = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ msg: 'Workspace not found' });

    const isMember = workspace.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) return res.status(401).json({ msg: 'Not authorized' });

    const boards = await Board.find({ workspaceId: workspaceId });
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## GET A SINGLE BOARD BY ID (UPDATED)
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
      .populate({
        path: 'lists',
        populate: { 
          path: 'cards',
          populate: {
            path: 'comments', // Populate comments on each card
            populate: {
              path: 'user', // Populate the user for each comment
              select: 'name avatarUrl'
            }
          }
        }
      })
      .populate({
        path: 'workspaceId',
        select: 'members',
        populate: {
          path: 'members.user',
          select: 'name email'
        }
      });

    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    
    // Authorization check
    const workspace = await Workspace.findById(board.workspaceId._id);
    const isMember = workspace.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
