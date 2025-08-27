import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWorkspaceById } from '../services/workspaceApi';
import { fetchBoardsByWorkspace, createBoard } from '../services/boardApi';
import { Plus, Settings, Trello, Loader2, ChevronRight } from 'lucide-react';

const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const wsRes = await fetchWorkspaceById(id);
        setWorkspace(wsRes.data);
        const boardsRes = await fetchBoardsByWorkspace(id);
        setBoards(boardsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      setIsCreating(true);
      const res = await createBoard(id, newBoardTitle);
      setBoards([...boards, res.data]);
      setNewBoardTitle('');
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error creating board:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
              {workspace?.name}
            </h1>
            <p className="text-gray-600 text-lg">All project boards for this workspace</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isFormVisible && (
              <button
                onClick={() => setIsFormVisible(true)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>New Board</span>
                </div>
              </button>
            )}
             <button
                onClick={() => navigate(`/settings/workspace/${id}`)}
                className="p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-600 hover:bg-white hover:text-indigo-600 transition-all duration-200"
                aria-label="Workspace Settings"
            >
                <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Board Form */}
      {isFormVisible && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Trello className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Create New Board</h3>
                <p className="text-gray-600">Give your new project board a title</p>
              </div>
            </div>
            
            <form onSubmit={handleCreateBoard}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Board Title
                </label>
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="e.g. Website Redesign, Q1 Roadmap"
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg placeholder:text-gray-400"
                  autoFocus
                  disabled={isCreating}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  type="button" 
                  onClick={() => setIsFormVisible(false)}
                  className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-200"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newBoardTitle.trim() || isCreating}
                  className="relative overflow-hidden px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isCreating ? (
                    <div className="flex items-center space-x-2 justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Board'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Boards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boards.length > 0 ? (
          boards.map((board, index) => (
            <div 
              key={board._id} 
              className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl p-6 transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/board/${board._id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <Trello className="h-7 w-7 text-indigo-600" />
                </div>
                <div className="flex items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <span className="text-xs font-medium">View Board</span>
                  <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-2">{board.title}</h3>
              <p className="text-gray-500 text-sm">
                {board.lists?.length || 0} lists 
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trello className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No boards yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first board in this workspace to start managing tasks.
            </p>
            <button
              onClick={() => setIsFormVisible(true)}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Board</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
