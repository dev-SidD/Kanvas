import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWorkspaces, createWorkspace } from '../services/workspaceApi';
import { 
  Users, 
  Plus, 
  Calendar, 
  ChevronRight, 
  Briefcase,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        setIsLoading(true);
        const res = await fetchWorkspaces();
        setWorkspaces(res.data);
      } catch (err) {
        console.error('Error fetching workspaces:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadWorkspaces();
  }, []);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    
    try {
      setIsCreating(true);
      await createWorkspace(newWorkspaceName);
      const updatedWorkspaces = await fetchWorkspaces(); // Refetch workspaces
      setWorkspaces(updatedWorkspaces.data);
      setNewWorkspaceName('');
      setIsFormVisible(false);
    } catch (err) {
      console.error('Error creating workspace:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const getWorkspaceAdmin = (workspace) => {
    const admin = workspace.members.find(member => member.role === 'admin');
    return admin ? admin.user : { name: 'N/A', avatarUrl: 'https://placehold.co/64x64/E0E7FF/4F46E5?text=A' };
  };

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
              <p className="text-lg text-gray-600 font-medium">Loading your workspaces...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
                Your Workspaces
              </h1>
              <p className="text-gray-600 text-lg">Manage and organize your team's projects</p>
            </div>
            
            {!isFormVisible && (
              <button
                onClick={() => setIsFormVisible(true)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>New Workspace</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Create Workspace Form */}
        {isFormVisible && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Create New Workspace</h3>
                  <p className="text-gray-600">Set up a new collaborative space for your team</p>
                </div>
              </div>
              
              <form onSubmit={handleCreateWorkspace}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="e.g. Q4 Marketing Plan, Product Development"
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
                    disabled={!newWorkspaceName.trim() || isCreating}
                    className="relative overflow-hidden px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isCreating ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Create Workspace'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Workspaces List */}
        {workspaces.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No workspaces yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first workspace to start collaborating with your team.
            </p>
            <button
              onClick={() => setIsFormVisible(true)}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Workspace</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden lg:block mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4"><h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Workspace</h4></div>
                    <div className="col-span-3"><h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Admin</h4></div>
                    <div className="col-span-2"><h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Members</h4></div>
                    <div className="col-span-2"><h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Last Updated</h4></div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {workspaces.map((ws, index) => {
                    const admin = getWorkspaceAdmin(ws);
                    return (
                      <div 
                        key={ws._id}
                        onClick={() => handleWorkspaceClick(ws._id)}
                        className="group px-8 py-6 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-4">
                            <div className="flex items-center space-x-4">
                              <div className={`h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg`}>
                                <Briefcase className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{ws.name}</h3>
                                <p className="text-sm text-gray-500">Active workspace</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-span-3">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={admin.avatarUrl || `https://placehold.co/40x40/E0E7FF/4F46E5?text=${admin.name[0]}`} 
                                alt={admin.name}
                                className="h-10 w-10 rounded-full border-2 border-white shadow-md object-cover"
                              />
                              <div>
                                <p className="font-semibold text-gray-800">{admin.name}</p>
                                <p className="text-sm text-gray-500">Administrator</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <Users className="h-5 w-5 text-gray-400" />
                              <span className="text-lg font-bold text-gray-800">{ws.members.length}</span>
                              <span className="text-sm text-gray-500">members</span>
                            </div>
                          </div>
                          
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{formatDate(ws.updatedAt)}</span>
                            </div>
                          </div>
                          
                          <div className="col-span-1 flex justify-end">
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all duration-200" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
              {workspaces.map((ws, index) => {
                const admin = getWorkspaceAdmin(ws);
                return (
                  <div 
                    key={ws._id}
                    onClick={() => handleWorkspaceClick(ws._id)}
                    className="group bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`h-14 w-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Briefcase className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-1">{ws.name}</h3>
                          <p className="text-sm text-gray-500">Active workspace</p>
                        </div>
                      </div>
                    </div>

                    {/* Members Preview */}
                    <div className="mb-6">
                      <div className="flex -space-x-2 mb-2">
                        {ws.members.slice(0, 4).map((member, idx) => (
                          <img
                            key={idx}
                            src={member.user.avatarUrl || `https://placehold.co/40x40/E0E7FF/4F46E5?text=${member.user.name[0]}` }
                            alt={member.user.name}
                            className="h-8 w-8 rounded-full border-2 border-white shadow-sm object-cover"
                          />
                        ))}
                        {ws.members.length > 4 && (
                          <div className="h-8 w-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">+{ws.members.length - 4}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{ws.members.length} team members</p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={admin.avatarUrl || `https://placehold.co/40x40/E0E7FF/4F46E5?text=${admin.name[0]}`} 
                          alt={admin.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{admin.name}</p>
                          <p className="text-xs text-gray-500">Admin</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">{formatDate(ws.updatedAt)}</p>
                        <div className="flex items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                          <span className="text-xs font-medium">View workspace</span>
                          <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
