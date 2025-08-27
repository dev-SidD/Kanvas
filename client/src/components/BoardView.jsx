import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSocket } from '../context/SocketContext';
import { Plus, Users, Star, MoreHorizontal, Loader2 } from 'lucide-react';
import List from './List';
import Card from './Card';
import CardModal from './CardModal';
import { fetchBoardById } from '../services/boardApi';
import { reorderCardsInList, createList } from '../services/listApi';
import { moveCard } from '../services/cardApi';
import axios from 'axios';

const BoardView = () => {
  const { boardId } = useParams();
  const socket = useSocket();
  const [board, setBoard] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAddingList, setIsAddingList] = useState(false);

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const boardRes = await fetchBoardById(boardId);
        setBoard(boardRes.data);
        const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, config);
        setUser(userRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [boardId]);

  // useEffect for handling all real-time socket events
  useEffect(() => {
    if (!socket || !board) return;

    socket.emit('join_board', boardId);

    const handleCardCreated = (newCard) => {
      setBoard(prevBoard => {
        const newLists = prevBoard.lists.map(list => {
          if (list._id === newCard.listId) {
            return { ...list, cards: [...list.cards, newCard] };
          }
          return list;
        });
        return { ...prevBoard, lists: newLists };
      });
    };

    const handleCardUpdated = (updatedCard) => {
      setBoard(prevBoard => {
        const newLists = prevBoard.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => card._id === updatedCard._id ? updatedCard : card)
        }));
        return { ...prevBoard, lists: newLists };
      });
    };

    const handleCardMoved = (moveData) => {
        const { sourceListId, destListId, sourceCardIds, destCardIds } = moveData;
        setBoard(prevBoard => {
          const newLists = JSON.parse(JSON.stringify(prevBoard.lists));
          const allCards = newLists.flatMap(list => list.cards);
      
          const sourceList = newLists.find(l => l._id === sourceListId);
          const destList = newLists.find(l => l._id === destListId);
      
          if (sourceList) {
            sourceList.cards = sourceCardIds.map(id => allCards.find(c => c._id === id)).filter(Boolean);
          }
          if (destList && sourceListId !== destListId) {
            destList.cards = destCardIds.map(id => allCards.find(c => c._id === id)).filter(Boolean);
          }
      
          return { ...prevBoard, lists: newLists };
        });
      };

    const handleCardDeleted = (deleteData) => {
      setBoard(prevBoard => {
        const newLists = prevBoard.lists.map(list => {
          if (list._id === deleteData.listId) {
            return { ...list, cards: list.cards.filter(card => card._id !== deleteData.cardId) };
          }
          return list;
        });
        return { ...prevBoard, lists: newLists };
      });
    };

    socket.on('card_created', handleCardCreated);
    socket.on('card_updated', handleCardUpdated);
    socket.on('card_moved', handleCardMoved);
    socket.on('card_deleted', handleCardDeleted);

    return () => {
      socket.off('card_created', handleCardCreated);
      socket.off('card_updated', handleCardUpdated);
      socket.off('card_moved', handleCardMoved);
      socket.off('card_deleted', handleCardDeleted);
    };
  }, [socket, boardId, board]);

  const canModifyCard = useCallback((card) => {
    if (!user || !card || !board) return false;
    const isAdmin = board.workspaceId.members.some(member => member.user._id.toString() === user._id && member.role === 'admin');
    if (isAdmin) return true;
    const isAssigned = card.members.some(member => member === user._id);
    return isAssigned;
  }, [user, board]);

  const findListByCardId = (cardId) => {
    if (!board) return null;
    return board.lists.find(list => list.cards.some(card => card._id === cardId));
  };

  const handleDragStart = (event) => {
    const card = findListByCardId(event.active.id)?.cards.find(c => c._id === event.active.id);
    
    if (card && canModifyCard(card)) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = async (event) => {
    if (!activeCard) return;
    
    setActiveCard(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sourceList = findListByCardId(active.id);
    const destList = board.lists.find(list => list._id === over.id || list.cards.some(c => c._id === over.id));
    
    if (!sourceList || !destList) return;

    if (sourceList._id === destList._id) {
      const oldIndex = sourceList.cards.findIndex(c => c._id === active.id);
      const newIndex = over.data.current?.sortable?.index ?? destList.cards.findIndex(c => c._id === over.id);
      if (oldIndex === newIndex) return;
      
      const reorderedCards = arrayMove(sourceList.cards, oldIndex, newIndex);
      setBoard(prev => ({ ...prev, lists: prev.lists.map(l => l._id === sourceList._id ? {...l, cards: reorderedCards} : l) }));
      await reorderCardsInList(sourceList._id, reorderedCards.map(c => c._id));
    } else {
      const sourceCardIndex = sourceList.cards.findIndex(c => c._id === active.id);
      const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);

      const overIsList = over.data.current?.type === 'list';
      const destCardIndex = overIsList ? destList.cards.length : (over.data.current?.sortable?.index ?? destList.cards.findIndex(c => c._id === over.id));
      
      destList.cards.splice(destCardIndex, 0, movedCard);
      
      setBoard(prev => ({ ...prev, lists: [...prev.lists] }));

      await moveCard(active.id, {
        sourceListId: sourceList._id,
        destListId: destList._id,
        sourceCardIds: sourceList.cards.map(c => c._id),
        destCardIds: destList.cards.map(c => c._id),
        boardId: boardId
      });
    }
  };
  
  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      const res = await createList(boardId, newListName);
      setBoard(prevBoard => ({
        ...prevBoard,
        lists: [...prevBoard.lists, { ...res.data, cards: [] }]
      }));
      setNewListName('');
      setIsAddingList(false);
    } catch (error) {
      console.error("Failed to create list", error);
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading your board...</p>
        </div>
      </div>
    );
  }

  if (!board || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Board not found</h2>
          <p className="text-gray-600">The board you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between ">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
                        {board.title}
                    </h1>
                    <p className="text-gray-600 text-lg">Drag and drop cards to organize your workflow.</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                    
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="flex items-start space-x-6 overflow-x-auto pb-6">
            <SortableContext items={board.lists.map(list => list._id)} strategy={horizontalListSortingStrategy}>
              {board.lists.map((list, index) => (
                <div 
                  key={list._id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <List
                    list={list}
                    setBoard={setBoard}
                    board={board}
                    onCardClick={handleCardClick}
                  />
                </div>
              ))}
            </SortableContext>
            
            {/* Add New List */}
            <div className="w-80 flex-shrink-0">
              {isAddingList ? (
                <form onSubmit={handleAddList} className="bg-gray-200/70 rounded-xl p-3">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list title..."
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                    onBlur={() => {
                      if (!newListName.trim()) {
                        setIsAddingList(false);
                      }
                    }}
                  />
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      type="submit"
                      disabled={!newListName.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      Add List
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingList(false);
                        setNewListName('');
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-300/80 rounded-lg transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="w-full bg-white/50 hover:bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-xl p-4 text-gray-600 hover:text-indigo-600 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Add another list</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeCard ? (
            <div className="transform rotate-3 scale-105">
              <Card card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>

        {/* Card Modal */}
        {selectedCard && (
          <CardModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            board={board}
            setBoard={setBoard}
            isReadOnly={!canModifyCard(selectedCard)}
            currentUser={user}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </DndContext>
  );
};

export default BoardView;
