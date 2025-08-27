import axios from 'axios';

const API_URL = 'http://localhost:5001/api/comments';

const getTokenConfig = () => ({
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});

// Adds a new comment to a card
export const addComment = (cardId, text) => 
  axios.post(`${API_URL}/${cardId}`, { text }, getTokenConfig());

// Gets all comments for a specific card
export const getCommentsByCard = (cardId) =>
  axios.get(`${API_URL}/${cardId}`, getTokenConfig());