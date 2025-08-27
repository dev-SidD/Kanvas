import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext'; // ✅ 1. Import the SocketProvider
// Import Components
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkspacePage from './components/WorkspacePage';
import WorkspaceSettings from './components/WorkspaceSettings';
import BoardView from './components/BoardView';
import PrivateRoute from './routing/PrivateRoute';
import Layout from './components/Layout';
import Profile from './components/ProfilePage';
import MyTasksPage from './components/MyTasksPage';
import Calendar from './components/Calendar';

function App() {
  return (
    // ✅ 2. Wrap the entire application with the SocketProvider
    <SocketProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes wrapped in the Layout */}
          <Route 
            path="/" 
            element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} 
          />
          <Route 
            path="/workspace/:id" 
            element={<PrivateRoute><Layout><WorkspacePage /></Layout></PrivateRoute>} 
          />
          <Route 
            path="/settings/workspace/:id" 
            element={<PrivateRoute><Layout><WorkspaceSettings /></Layout></PrivateRoute>} 
          />
          <Route 
            path="/profile" 
            element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} 
          />
          <Route 
            path="/tasks" 
            element={<PrivateRoute><Layout><MyTasksPage /></Layout></PrivateRoute>} 
          />
          <Route 
            path="/calendar" 
            element={<PrivateRoute><Layout><Calendar /></Layout></PrivateRoute>} 
          />
          {/* BoardView - also inside Layout */}
          <Route 
            path="/board/:boardId"
            element={<PrivateRoute><Layout><BoardView /></Layout></PrivateRoute>} 
          />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
