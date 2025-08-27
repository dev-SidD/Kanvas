import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/comments`;

const getTokenConfig = () => ({
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});

// Adds a new comment to a card
export const addComment = (cardId, text) => 
  axios.post(`${API_URL}/${cardId}`, { text }, getTokenConfig());

// Gets all comments for a specific card
export const getCommentsByCard = (cardId) =>
  axios.get(`${API_URL}/${cardId}`, getTokenConfig());