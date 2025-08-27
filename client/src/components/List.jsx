import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from './Card';
import { createCard } from '../services/cardApi';
import { Plus, X } from 'lucide-react';

const List = ({ list, setBoard, board, onCardClick }) => {
  const { attributes, setNodeRef, transform, transition } = useSortable({ id: list._id, data: { type: 'list' } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardData, setNewCardData] = useState({ title: '', members: [], dueDate: null });

  const availableMembers = useMemo(() => board.workspaceId.members, [board.workspaceId.members]);

  const handleInputChange = (e) => {
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
    if (!newCardData.title.trim()) return;
    try {
      // The backend will emit a 'card_created' event, which the BoardView will handle.
      await createCard(list.boardId, list._id, newCardData);
      setNewCardData({ title: '', members: [], dueDate: null });
      setIsAddingCard(false);
    } catch (error) {
      console.error("Failed to create card", error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex h-fit max-h-full w-80 flex-shrink-0 flex-col rounded-2xl bg-gray-200/70 backdrop-blur-sm shadow-lg"
    >
      <h2 className="p-4 text-lg font-bold text-gray-800 tracking-wide">{list.title}</h2>
      
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
          <div className="space-y-3 rounded-xl bg-white/80 p-3 border border-gray-200/80">
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
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Assign Members</label>
                <div className="mt-1 max-h-24 overflow-y-auto rounded-lg border border-gray-300 p-2 space-y-1">
                  {availableMembers.map(member => (
                    <div key={member.user._id} className="flex items-center text-sm text-gray-800">
                      <input type="checkbox" id={`add-${member.user._id}`} checked={newCardData.members.includes(member.user._id)} onChange={() => handleMemberSelect(member.user._id)} className="mr-2 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"/>
                      <label htmlFor={`add-${member.user._id}`}>{member.user.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">Add Card</button>
                <button type="button" onClick={() => setIsAddingCard(false)} className="ml-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full">
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
  );
};

export default List;
