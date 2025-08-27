import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = ({ workspaceId, workspaceName }) => {
  // This function applies styles to the active navigation link
  const getActiveStyle = ({ isActive }) => {
    return {
      color: isActive ? '#111827' : '#4B5563', // gray-900 vs gray-600
      borderBottom: isActive ? '2px solid #4F46E5' : '2px solid transparent', // indigo-600
    };
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-xl">
            <Link to="/dashboard" className="font-medium text-gray-500 hover:text-gray-700">
              Workspaces
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-gray-800">{workspaceName}</span>
          </div>

          {/* Main Navigation Links */}
          <nav className="flex space-x-8">
            <NavLink to={`/workspace/${workspaceId}`} end style={getActiveStyle} className="px-1 pt-1 text-sm font-medium">
              Boards
            </NavLink>
            <NavLink to={`/settings/workspace/${workspaceId}`} style={getActiveStyle} className="px-1 pt-1 text-sm font-medium">
              Settings
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;