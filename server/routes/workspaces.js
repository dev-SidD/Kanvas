const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember
} = require('../controllers/workspaceController');

// Workspace Routes
router.get('/', auth, getWorkspaces);
router.get('/:id', auth, getWorkspaceById);
router.post('/', auth, createWorkspace);
router.put('/:id', auth, updateWorkspace);
router.delete('/:id', auth, deleteWorkspace);

// Member Management Routes
router.post('/:id/members', auth, addMember);
router.delete('/:id/members/:memberId', auth, removeMember);

module.exports = router;