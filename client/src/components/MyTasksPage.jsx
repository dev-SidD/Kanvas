import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckSquare, Calendar, Briefcase, ChevronRight, AlertOctagon, Clock, Star } from 'lucide-react';

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          } 
        };
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, config);
        setTasks(res.data.tasks || []);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTasks();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return { text: 'No due date', isOverdue: false };
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates only
    const isOverdue = date < now;
    return {
        text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isOverdue
    };
  };

  const getStatusColor = (status) => {
    status = status.toLowerCase();
    if (status.includes('progress')) return 'bg-blue-100 text-blue-800';
    if (status.includes('done') || status.includes('complete')) return 'bg-green-100 text-green-800';
    if (status.includes('review')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const groupedTasks = useMemo(() => {
    const groups = {
      overdue: [],
      today: [],
      thisWeek: [],
      later: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    tasks.forEach(task => {
      if (!task.dueDate) {
        groups.later.push(task);
        return;
      }
      const dueDate = new Date(task.dueDate);
      if (dueDate < today) {
        groups.overdue.push(task);
      } else if (dueDate.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (dueDate <= endOfWeek) {
        groups.thisWeek.push(task);
      } else {
        groups.later.push(task);
      }
    });
    return groups;
  }, [tasks]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  const TaskGroup = ({ title, tasks, icon: Icon, color }) => (
    <div className="mb-8">
        <div className="flex items-center mb-4">
            <Icon className={`h-6 w-6 ${color}`} />
            <h3 className={`ml-3 text-2xl font-bold ${color}`}>{title}</h3>
            <span className="ml-3 text-sm font-medium bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">{tasks.length}</span>
        </div>
        <div className="space-y-4">
            {tasks.map((task, index) => {
                const dueDateInfo = formatDate(task.dueDate);
                return (
                    <div
                        key={task._id}
                        onClick={() => navigate(`/board/${task.boardId._id}`)}
                        className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl p-5 transition-all duration-300 hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1 mb-4 sm:mb-0">
                                <p className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    <span>{task.boardId.title}</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 w-full sm:w-auto sm:mx-6 mb-4 sm:mb-0">
                                <span className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold ${getStatusColor(task.listId.title)}`}>
                                    {task.listId.title}
                                </span>
                            </div>
                            <div className="flex-shrink-0 flex items-center justify-between sm:justify-start w-full sm:w-auto">
                                <div className={`flex items-center text-sm font-medium ${dueDateInfo.isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{dueDateInfo.text}</span>
                                </div>
                                <div className="sm:ml-6 text-gray-400 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-transform">
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
              My Tasks
            </h1>
            <p className="text-gray-600 text-lg">All your assigned tasks across all workspaces</p>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-24 w-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckSquare className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">You're all caught up!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You have no assigned tasks. Great job staying on top of your work!
          </p>
        </div>
      ) : (
        <div>
            {groupedTasks.overdue.length > 0 && <TaskGroup title="Overdue" tasks={groupedTasks.overdue} icon={AlertOctagon} color="text-red-600" />}
            {groupedTasks.today.length > 0 && <TaskGroup title="Today" tasks={groupedTasks.today} icon={Star} color="text-yellow-600" />}
            {groupedTasks.thisWeek.length > 0 && <TaskGroup title="This Week" tasks={groupedTasks.thisWeek} icon={Calendar} color="text-blue-600" />}
            {groupedTasks.later.length > 0 && <TaskGroup title="Later" tasks={groupedTasks.later} icon={Clock} color="text-gray-600" />}
        </div>
      )}
    </div>
  );
};

export default MyTasksPage;
