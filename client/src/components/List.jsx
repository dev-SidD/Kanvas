import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from './Card';
import { createCard } from '../services/cardApi';
import { Plus, X, AlertCircle, Loader2 } from 'lucide-react';

// Custom CSS for the DatePicker to match the theme
const DatePickerStyles = () => (
    <style>{`
        .react-datepicker {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            border-radius: 1rem !important; /* rounded-2xl */
            border: 1px solid #e5e7eb !important; /* gray-200 */
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .react-datepicker__header {
            background-color: #f9fafb !important; /* gray-50 */
            border-bottom: 1px solid #e5e7eb !important;
            border-top-left-radius: 1rem !important;
            border-top-right-radius: 1rem !important;
        }
        .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
            color: #1f2937 !important; /* gray-800 */
            font-weight: 600 !important;
        }
        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
            color: #4b5563 !important; /* gray-600 */
        }
        .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
            background-color: #4f46e5 !important; /* indigo-600 */
            color: white !important;
            border-radius: 0.5rem !important;
        }
        .react-datepicker__day:hover {
            border-radius: 0.5rem !important;
            background-color: #eef2ff !important; /* indigo-50 */
        }
    `}</style>
);


const List = ({ list, setBoard, board, onCardClick }) => {
  const { attributes, setNodeRef, transform, transition } = useSortable({ id: list._id, data: { type: 'list' } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardData, setNewCardData] = useState({ title: '', members: [], dueDate: null });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableMembers = useMemo(() => board.workspaceId.members, [board.workspaceId.members]);

  const handleInputChange = (e) => {
    setError('');
    setNewCardData({ ...newCardData, title: e.target.value });
  };
  
  const handleMemberSelect = (memberId) => {
    const newMembers = newCardData.members.includes(memberId)
      ? newCardData.members.filter(id => id !== memberId)
      : [...newCardData.members, memberId];
    setNewCardData({ ...newCardData, members: newMembers });
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardData.title.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const res = await createCard(list.boardId, list._id, newCardData);
      const newCard = res.data;

      // ✅ FIX: Manually populate member details for the new card before updating state.
      // This ensures the Card component receives the full user objects it needs.
      const populatedCard = {
        ...newCard,
        members: newCard.members.map(memberId => {
          const memberDetails = availableMembers.find(m => m.user._id === memberId);
          return memberDetails ? memberDetails.user : null;
        }).filter(Boolean) // Filter out any nulls if a member wasn't found
      };

      // Optimistically update the board state. The socket event will ensure other clients get updated.
      setBoard(prevBoard => {
        const newLists = prevBoard.lists.map(l => 
          l._id === list._id ? { ...l, cards: [...l.cards, populatedCard] } : l
        );
        return { ...prevBoard, lists: newLists };
      });
      
      setNewCardData({ title: '', members: [], dueDate: null });
      setIsAddingCard(false);
    } catch (err) {
      console.error("Failed to create card", err);
      setError(err.response?.data?.message || 'Failed to create card.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DatePickerStyles />
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="flex h-fit max-h-full w-80 flex-shrink-0 flex-col rounded-2xl bg-gray-100/80 backdrop-blur-sm border border-gray-200/80 shadow-lg"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
          <h2 className="text-lg font-bold text-gray-800 tracking-wide">{list.title}</h2>
          <span className="text-sm font-semibold bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
            {list.cards.length}
          </span>
        </div>
        
        <div className="flex-grow space-y-3 overflow-y-auto p-2 mx-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200/80">
          <SortableContext items={list.cards.map(card => card._id)} strategy={verticalListSortingStrategy}>
            {list.cards.map(card => (
              <Card 
                key={card._id} 
                card={card} 
                onCardClick={onCardClick}
              />
            ))}
          </SortableContext>
        </div>
        
        <div className="p-3 mt-2">
          {isAddingCard ? (
            <div className="space-y-3 rounded-xl bg-white/90 p-3 border border-gray-200/80 shadow-inner">
              <form onSubmit={handleAddCard} className="space-y-3">
                <textarea
                  value={newCardData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title for this card..."
                  className="w-full rounded-lg border-gray-300 bg-white p-3 text-gray-800 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <div>
                  <label className="text-xs font-medium text-gray-600">Due Date</label>
                  <DatePicker 
                    selected={newCardData.dueDate}
                    onChange={(date) => setNewCardData({...newCardData, dueDate: date})}
                    className="w-full rounded-lg border-gray-300 bg-white p-2 mt-1 text-gray-800"
                    popperPlacement="bottom-start"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Assign Members</label>
                  <div className="mt-1 max-h-24 overflow-y-auto rounded-lg border border-gray-300 p-2 space-y-1 bg-white">
                    {availableMembers.map(member => (
                      <div key={member.user._id} className="flex items-center text-sm text-gray-800">
                        <input type="checkbox" id={`add-${member.user._id}`} checked={newCardData.members.includes(member.user._id)} onChange={() => handleMemberSelect(member.user._id)} className="mr-2 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"/>
                        <label htmlFor={`add-${member.user._id}`}>{member.user.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-xs font-medium">{error}</p>
                    </div>
                )}
                <div className="flex items-center">
                  <button 
                    type="submit" 
                    className="flex justify-center items-center w-24 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Add Card'}
                  </button>
                  <button type="button" onClick={() => {setIsAddingCard(false); setError('');}} className="ml-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full">
                      <X className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={() => setIsAddingCard(true)} className="w-full flex items-center space-x-2 rounded-xl p-3 font-semibold text-gray-600 hover:bg-gray-300/60 hover:text-gray-800 transition-colors duration-200 group">
              <Plus className="h-5 w-5" />
              <span>Add a card</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default List;
