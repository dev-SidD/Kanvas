import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWorkspaceById, updateWorkspace, deleteWorkspace, addMember, removeMember } from '../services/workspaceApi';
import { Settings, Users, Trash2, Plus, Loader2, Building2 } from 'lucide-react';

const WorkspaceSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [newName, setNewName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        setIsLoading(true);
        const res = await fetchWorkspaceById(id);
        setWorkspace(res.data);
        setNewName(res.data.name);
      } catch (error) {
        console.error("Failed to fetch workspace", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadWorkspace();
  }, [id]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName === workspace.name) return;
    try {
      setIsUpdating(true);
      await updateWorkspace(id, newName);
      setWorkspace(prev => ({...prev, name: newName}));
    } catch (error) {
      console.error("Failed to update workspace", error);
      alert('Failed to update workspace.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      try {
        await deleteWorkspace(id);
        alert('Workspace deleted successfully.');
        navigate('/');
      } catch (error) {
        console.error("Failed to delete workspace", error);
        alert('Failed to delete workspace.');
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    try {
      setIsAdding(true);
      await addMember(id, newMemberEmail);
      const res = await fetchWorkspaceById(id);
      setWorkspace(res.data);
      setNewMemberEmail('');
    } catch (error) {
      console.error("Failed to add member", error);
      alert('Failed to add member. Please check the email and try again.');
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember(id, memberId);
        const res = await fetchWorkspaceById(id);
        setWorkspace(res.data);
      } catch (error) {
        console.error("Failed to remove member", error);
        alert('Failed to remove member.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
              Workspace Settings
            </h1>
            <p className="text-gray-600 text-lg">Manage settings for "{workspace?.name}"</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Update Name Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Workspace Name</h3>
                    <p className="text-gray-600">Change the name of your workspace</p>
                </div>
            </div>
            <form onSubmit={handleUpdateName} className="flex flex-col sm:flex-row items-center gap-4">
                <input 
                    id="workspaceName"
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    className="flex-grow w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-lg" 
                />
                <button 
                    type="submit"
                    disabled={isUpdating || newName === workspace.name}
                    className="w-full sm:w-auto relative overflow-hidden px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save'}
                </button>
            </form>
        </div>

        {/* Manage Members Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Manage Members</h3>
                    <p className="text-gray-600">Invite or remove members from this workspace</p>
                </div>
            </div>
          <form onSubmit={handleAddMember} className="mb-6 flex">
            <input 
              type="email" 
              value={newMemberEmail} 
              onChange={(e) => setNewMemberEmail(e.target.value)} 
              placeholder="Enter member's email to invite" 
              className="flex-grow w-full px-6 py-4 bg-white border border-gray-200 rounded-l-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-lg" 
              required 
            />
            <button 
              type="submit" 
              disabled={isAdding}
              className="w-40 flex justify-center items-center rounded-r-2xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              {isAdding ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Add Member'}
            </button>
          </form>
          <ul className="space-y-3">
            {workspace.members.map(member => (
              <li key={member.user._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex items-center mb-2 sm:mb-0">
                  <img src={member.user.avatarUrl || `https://placehold.co/40x40/E0E7FF/4F46E5?text=${member.user.name[0]}`} alt="avatar" className="h-10 w-10 rounded-full"/>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-800">{member.user.name}</p>
                    <p className="text-sm text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 capitalize">{member.role}</span>
                  <button 
                    onClick={() => handleRemoveMember(member.user._id)} 
                    className="text-sm font-semibold text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Delete Workspace Section */}
        <div className="bg-red-50/50 backdrop-blur-sm rounded-3xl border border-red-200/50 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-red-800">Delete Workspace</h3>
                    <p className="text-red-700/80 mt-1">This action is permanent and cannot be undone.</p>
                </div>
                <button 
                    onClick={handleDeleteWorkspace} 
                    className="mt-4 sm:mt-0 flex items-center space-x-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:bg-red-700"
                >
                    <Trash2 className="h-5 w-5" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
