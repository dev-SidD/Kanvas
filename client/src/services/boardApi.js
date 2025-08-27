import axios from 'axios';

const API_URL = 'http://localhost:5001/api/boards';

// Helper function to get the auth token and create a config object
const getTokenConfig = () => {
  const token = localStorage.getItem('token');
  return { headers: { 'x-auth-token': token } };
};

// Fetch all boards for a specific workspace
export const fetchBoardsByWorkspace = (workspaceId) => 
  axios.get(`${API_URL}/workspace/${workspaceId}`, getTokenConfig());

// Create a new board in a workspace
export const createBoard = (workspaceId, title) => 
  axios.post(`${API_URL}/workspace/${workspaceId}`, { title }, getTokenConfig());

// Fetch a single board by its ID
export const fetchBoardById = (boardId) => 
  axios.get(`${API_URL}/${boardId}`, getTokenConfig());

// Note: You can add update and delete functions here later
// export const updateBoard = (boardId, title) => ...
// export const deleteBoard = (boardId) => ...