import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useSocket } from '../context/SocketContext';
import { updateCard } from '../services/cardApi';
import { addComment, getCommentsByCard } from '../services/commentApi';
import { FileText, MessageSquare, Users, Calendar, X, Edit, Save, Image as ImageIcon } from 'lucide-react';

// --- Helper Components for Cleaner JSX ---

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center mb-4">
    <Icon className="h-6 w-6 text-indigo-500" />
    <h3 className="ml-3 text-xl font-bold text-gray-800">{title}</h3>
  </div>
);

const CardModal = ({ card, onClose, board, setBoard, isReadOnly, currentUser }) => {
  const [currentCard, setCurrentCard] = useState(card);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const socket = useSocket();
  const commentsEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsPanelOpen(true), 50);
    const fetchComments = async () => {
      try {
        const res = await getCommentsByCard(card._id);
        setComments(res.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };
    fetchComments();
    return () => clearTimeout(timer);
  }, [card._id]);
  
  useEffect(() => {
    if (!socket) return;

    const handleCommentAdded = (newComment) => {
      if (newComment.card === card._id) {
        setComments(prev => [newComment, ...prev]);
      }
    };

    socket.on('comment_added', handleCommentAdded);

    return () => {
      socket.off('comment_added', handleCommentAdded);
    };
  }, [socket, card._id]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleClose = () => {
    setIsPanelOpen(false);
    setTimeout(onClose, 300);
  };

  const availableMembers = useMemo(() => board.workspaceId.members, [board.workspaceId.members]);

  const updateBoardState = (updatedCard) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => ({
        ...list,
        cards: list.cards.map(c => c._id === updatedCard._id ? updatedCard : c)
      }))
    }));
  };

  const handleUpdate = async (updatedFields) => {
    if (isReadOnly) return;
    try {
      const res = await updateCard(card._id, updatedFields);
      setCurrentCard(res.data);
      updateBoardState(res.data);
    } catch (error) {
      console.error("Failed to update card:", error);
    }
  };
  
  const handleSave = async (e) => {
      e.preventDefault();
      await handleUpdate({ 
          description: currentCard.description,
          members: currentCard.members,
          dueDate: currentCard.dueDate
      });
      setIsEditing(false);
  }

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment(card._id, commentText);
      setCommentText('');
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  return ReactDOM.createPortal(
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
        isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-full flex flex-col w-full max-w-3xl transform bg-gray-50 shadow-2xl transition-transform duration-300 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b p-6 bg-white/80 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-gray-900">{currentCard.title}</h2>
          <div className="flex items-center space-x-2">
            {!isReadOnly && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6">
                <SectionTitle icon={FileText} title="Description" />
                <textarea
                  value={currentCard.description}
                  onChange={(e) => setCurrentCard({ ...currentCard, description: e.target.value })}
                  placeholder={isReadOnly ? "No description provided." : "Add a detailed description..."}
                  readOnly={!isEditing}
                  className={`w-full h-32 p-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    !isEditing && 'bg-gray-100 cursor-default'
                  }`}
                />
              </div>

              {/* Activity */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6">
                <SectionTitle icon={MessageSquare} title="Activity" />
                <form onSubmit={handleAddComment} className="mb-4 flex items-start space-x-3">
                  <img
                    src={currentUser?.avatarUrl || `https://placehold.co/40x40/E0E7FF/4F46E5?text=${currentUser.name[0]}`}
                    alt="avatar"
                    className="h-10 w-10 rounded-full border shadow-sm"
                  />
                  <div className="flex-grow">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="mt-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition"
                    >
                      Comment
                    </button>
                  </div>
                </form>
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment._id} className="flex items-start space-x-3">
                      <img
                        src={comment.user?.avatarUrl || `https://placehold.co/40x40/E0E7FF/4F46E5?text=${comment.user?.name[0]}`}
                        alt="avatar"
                        className="h-10 w-10 rounded-full border"
                      />
                      <div className="bg-white p-3 rounded-xl shadow-sm w-full">
                        <p className="font-semibold text-gray-800">{comment.user?.name}</p>
                        <p className="text-gray-700 mt-1">{comment.text}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6">
                <SectionTitle icon={Users} title="Members" />
                <div className="space-y-2">
                  {availableMembers.map(member => (
                    <label key={member.user._id} className="flex items-center space-x-3 hover:bg-gray-50 rounded p-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentCard.members.includes(member.user._id)}
                        onChange={() => {
                            const newMembers = currentCard.members.includes(member.user._id)
                                ? currentCard.members.filter(id => id !== member.user._id)
                                : [...currentCard.members, member.user._id];
                            setCurrentCard({...currentCard, members: newMembers });
                        }}
                        disabled={!isEditing}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <img src={member.user.avatarUrl || `https://placehold.co/32x32/E0E7FF/4F46E5?text=${member.user.name[0]}`} alt={member.user.name} className="h-8 w-8 rounded-full" />
                      <span className="font-medium text-sm text-gray-800">{member.user.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6">
                <SectionTitle icon={Calendar} title="Due Date" />
                <DatePicker
                  selected={currentCard.dueDate ? new Date(currentCard.dueDate) : null}
                  onChange={(date) => setCurrentCard({ ...currentCard, dueDate: date })}
                  className="w-full p-3 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <button 
                        type="button" 
                        onClick={() => {
                            setIsEditing(false);
                            setCurrentCard(card); // Revert changes
                        }}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        onClick={handleSave}
                        className="w-full relative overflow-hidden px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        Save
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CardModal;
