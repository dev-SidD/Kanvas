import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical } from 'lucide-react';

const Card = ({ card, onCardClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const formatDate = (dateString) => {
    if (!dateString) return { text: '', isOverdue: false };
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(0,0,0,0); // Compare dates only
    const isOverdue = date < now;
    return {
        text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isOverdue
    };
  };

  const dueDateInfo = formatDate(card.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onCardClick ? () => onCardClick(card) : undefined}
      className="group relative flex cursor-pointer flex-col items-start rounded-xl bg-white p-4 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200"
    >
      {/* Drag Handle */}
      <button 
        {...listeners}
        className="absolute top-3 right-2 cursor-grab rounded-md p-1.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Drag card"
        onClick={(e) => e.stopPropagation()} // Prevent card click when dragging
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <p className="text-md font-semibold text-gray-800 pr-6">{card.title}</p>
      
      <div className="mt-4 flex w-full items-center justify-between">
        {card.dueDate ? (
          <div className={`flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
            dueDateInfo.isOverdue 
              ? 'bg-red-100 text-red-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <Calendar className="mr-1.5 h-4 w-4" />
            <span>{dueDateInfo.text}</span>
          </div>
        ) : <div />}
        
       
      </div>
    </div>
  );
};

export default Card;
