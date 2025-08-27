import axios from 'axios';

const API_URL = 'http://localhost:5001/api/cards';

const getTokenConfig = () => ({
  headers: { 'x-auth-token': localStorage.getItem('token') }
});

// Add a new checklist to a card
export const addChecklist = (cardId, title) => 
  axios.post(`${API_URL}/${cardId}/checklists`, { title }, getTokenConfig());

// Add a new item to a specific checklist
export const addChecklistItem = (cardId, checklistId, text) =>
  axios.post(`${API_URL}/${cardId}/checklists/${checklistId}/items`, { text }, getTokenConfig());

// Update a checklist item (e.g., toggle completion status)
export const updateChecklistItem = (cardId, checklistId, itemId, updates) =>
  axios.put(`${API_URL}/${cardId}/checklists/${checklistId}/items/${itemId}`, updates, getTokenConfig());