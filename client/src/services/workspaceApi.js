import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/workspaces`;

// Function to get the auth token
const getTokenConfig = () => {
  const token = localStorage.getItem('token');
  return { headers: { 'x-auth-token': token } };
};

// Fetch all workspaces for the current user
export const fetchWorkspaces = () => axios.get(API_URL, getTokenConfig());

// Create a new workspace
export const createWorkspace = (name) => axios.post(API_URL, { name }, getTokenConfig());

// Fetch a single workspace by its ID
export const fetchWorkspaceById = (id) => axios.get(`${API_URL}/${id}`, getTokenConfig());

// Update a workspace's name
export const updateWorkspace = (id, name) => axios.put(`${API_URL}/${id}`, { name }, getTokenConfig());

// Delete a workspace
export const deleteWorkspace = (id) => axios.delete(`${API_URL}/${id}`, getTokenConfig());

// Add a member to a workspace
export const addMember = (workspaceId, email) => axios.post(`${API_URL}/${workspaceId}/members`, { email }, getTokenConfig());

// Remove a member from a workspace
export const removeMember = (workspaceId, memberId) => axios.delete(`${API_URL}/${workspaceId}/members/${memberId}`, getTokenConfig());