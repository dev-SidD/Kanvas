import axios from 'axios';

const API_URL = 'http://localhost:5001/api/lists';

const getTokenConfig = () => ({
  headers: { 'x-auth-token': localStorage.getItem('token') }
});

export const createList = (boardId, title) => 
  axios.post(`${API_URL}/${boardId}`, { title }, getTokenConfig());

// Reorder cards within the same list
export const reorderCardsInList = (listId, cardIds) =>
  axios.put(`${API_URL}/${listId}/reorder-cards`, { cardIds }, getTokenConfig());