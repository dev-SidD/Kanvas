import axios from 'axios';

const API_URL = 'http://localhost:5001/api/cards';

const getTokenConfig = () => ({
  headers: { 'x-auth-token': localStorage.getItem('token') }
});

export const createCard = (boardId, listId, cardData) => 
  axios.post(API_URL, { boardId, listId, ...cardData }, getTokenConfig());

// Move a card between different lists
export const moveCard = (cardId, { sourceListId, destListId, sourceCardIds, destCardIds, boardId }) =>
  axios.put(`${API_URL}/move/${cardId}`, { sourceListId, destListId, sourceCardIds, destCardIds, boardId }, getTokenConfig());

export const updateCard = (cardId, updatedData) => 
  axios.put(`${API_URL}/${cardId}`, updatedData, getTokenConfig());