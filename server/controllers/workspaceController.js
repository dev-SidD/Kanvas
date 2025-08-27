const Workspace = require('../models/Workspace');
const User = require('../models/User');

// ## GET ALL WORKSPACES FOR A USER
// ... other functions ...

// ## GET ALL WORKSPACES FOR A USER (UPDATED)
exports.getWorkspaces = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Populate the user details, including avatarUrl
    const workspaces = await Workspace.find({ '_id': { $in: user.workspaces } })
      .populate('members.user', 'name email avatarUrl'); // Add avatarUrl here
    res.json(workspaces);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// ## GET A SINGLE WORKSPACE BY ID
exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('members.user', 'name email avatarUrl');
    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }
    const isMember = workspace.members.some(member => member.user._id.toString() === req.user.id);
    if (!isMember) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(workspace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## CREATE A NEW WORKSPACE
exports.createWorkspace = async (req, res) => {
  const { name } = req.body;
  try {
    const newWorkspace = new Workspace({
      name,
      members: [{ user: req.user.id, role: 'admin' }]
    });
    const workspace = await newWorkspace.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { workspaces: workspace.id } });
    res.json(workspace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## UPDATE A WORKSPACE'S NAME
exports.updateWorkspace = async (req, res) => {
  const { name } = req.body;
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }
    const admin = workspace.members.find(member => member.user.toString() === req.user.id && member.role === 'admin');
    if (!admin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    workspace.name = name;
    await workspace.save();
    res.json(workspace);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## DELETE A WORKSPACE
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }
    const admin = workspace.members.find(member => member.user.toString() === req.user.id && member.role === 'admin');
    if (!admin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const memberIds = workspace.members.map(m => m.user);
    await User.updateMany({ _id: { $in: memberIds } }, { $pull: { workspaces: workspace.id } });
    await workspace.deleteOne();
    res.json({ msg: 'Workspace deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## ADD A MEMBER TO A WORKSPACE
exports.addMember = async (req, res) => {
  const { email } = req.body;
  try {
    const workspace = await Workspace.findById(req.params.id);
    const newMember = await User.findOne({ email });
    if (!workspace || !newMember) {
      return res.status(404).json({ msg: 'Workspace or User not found' });
    }
    const admin = workspace.members.find(m => m.user.toString() === req.user.id && m.role === 'admin');
    if (!admin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    if (workspace.members.some(m => m.user.toString() === newMember.id)) {
      return res.status(400).json({ msg: 'User is already a member' });
    }
    workspace.members.push({ user: newMember.id, role: 'member' });
    newMember.workspaces.push(workspace.id);
    await workspace.save();
    await newMember.save();
    res.json(workspace.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ## REMOVE A MEMBER FROM A WORKSPACE
exports.removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ msg: 'Workspace not found' });
    }
    const admin = workspace.members.find(m => m.user.toString() === req.user.id && m.role === 'admin');
    if (!admin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    workspace.members = workspace.members.filter(m => m.user.toString() !== req.params.memberId);
    await User.findByIdAndUpdate(req.params.memberId, { $pull: { workspaces: workspace.id } });
    await workspace.save();
    res.json({ msg: 'Member removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};