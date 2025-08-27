import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    User,
    LogOut,
    Bell,
    Menu,
    X,
    Sparkles,
    ChevronRight
} from 'lucide-react';

// Enhanced Icon Components with Lucide React
const Icons = {
    Dashboard: () => <LayoutDashboard className="h-5 w-5" />,
    Tasks: () => <CheckSquare className="h-5 w-5" />,
    Calendar: () => <Calendar className="h-5 w-5" />,
    Profile: () => <User className="h-5 w-5" />,
    Logout: () => <LogOut className="h-5 w-5" />,
    Notification: () => <Bell className="h-5 w-5" />,
    Menu: () => <Menu className="h-5 w-5" />,
    Close: () => <X className="h-5 w-5" />,
    Sparkles: () => <Sparkles className="h-4 w-4" />,
    ChevronRight: () => <ChevronRight className="h-4 w-4" />
};

const KanvasLogo = ({ collapsed = false }) => (
    <div className="flex items-center mb-8 flex-shrink-0 group">
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 6H15.5L25 16L15.5 26H7L16.5 16L7 6Z" fill="currentColor" />
                    <path d="M16 7H24V9H16V7Z" fill="currentColor" />
                    <path d="M16 13H22V15H16V13Z" fill="currentColor" />
                    <path d="M16 19H20V21H16V19Z" fill="currentColor" />
                </svg>
            </div>
        </div>
        {!collapsed && (
            <div className="ml-3 overflow-hidden">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Kanvas
                </span>

            </div>
        )}
    </div>
);

const Layout = ({ children }) => {
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const socket = useSocket();
    const notificationRef = useRef(null);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/login');
    }, [navigate]);

    // Fetch user and initial notifications
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, config);
                setUser(userRes.data);

                const notificationsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, config);
                setNotifications(notificationsRes.data);
                if (notificationsRes.data.some(n => !n.isRead)) {
                    setHasNewNotification(true);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error("Authentication error: Token is invalid or expired.");
                    handleLogout();
                } else {
                    console.error("Could not fetch initial data", error);
                }
            }
        };
        fetchData();
    }, [navigate, handleLogout]);

    // Listen for real-time notifications
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (newNotification) => {
            setHasNewNotification(true);
            setNotifications(prev => [newNotification, ...prev]);
        };

        socket.on('new_notification', handleNewNotification);

        return () => {
            socket.off('new_notification', handleNewNotification);
        };
    }, [socket]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
        if (hasNewNotification) {
            setHasNewNotification(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {}, config);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setHasNewNotification(false);
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    const handleNotificationClick = async (notif) => {
        try {
            if (!notif.isRead) {
                const token = localStorage.getItem('token');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                await axios.patch(`${import.meta.env.VITE_API_URL}/api/notifications/${notif._id}/read`, {}, config);
                setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
            }
            setShowNotifications(false);
            navigate(notif.link || '#');
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const isActive = (path) => location.pathname.startsWith(path);
    const isExactActive = (path) => location.pathname === path;

    const navigationItems = [
        { path: '/', label: 'Workspaces', icon: Icons.Dashboard, exact: true },
        { path: '/tasks', label: 'Tasks', icon: Icons.Tasks },
        { path: '/calendar', label: 'Calendar', icon: Icons.Calendar },
        { path: '/profile', label: 'Profile', icon: Icons.Profile }
    ];

    const NavItem = ({ item, collapsed }) => {
        const active = item.exact ? isExactActive(item.path) : isActive(item.path);

        return (
            <Link
                to={item.path}
                className={`group relative flex items-center rounded-xl p-3 font-medium transition-all duration-200 ${active
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div className={`flex items-center justify-center ${active ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'} transition-colors duration-200`}>
                    <item.icon />
                </div>
                {!collapsed && (
                    <>
                        <span className="ml-3 transition-all duration-200">{item.label}</span>
                        {active && (
                            <div className="ml-auto">
                                <Icons.ChevronRight />
                            </div>
                        )}
                    </>
                )}
                {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-10 animate-pulse"></div>
                )}
            </Link>
        );
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-[#00000000] z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                ${sidebarCollapsed ? 'w-20' : 'w-62'} 
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                bg-white/80 backdrop-blur-xl border-r border-gray-200/50 
                transition-all duration-300 ease-in-out
                shadow-2xl lg:shadow-xl
            `}>
                <div className="flex h-full flex-col p-4">
                    {/* Logo and Toggle */}
                    <div className="flex flex-col justify-between mb-8">
                        <KanvasLogo collapsed={sidebarCollapsed} />
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        >
                            <Icons.Menu />
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        >
                            <Icons.Close />
                        </button>
                    </div>

                    {/* Navigation Section */}
                    {!sidebarCollapsed && (
                        <div className="mb-6">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                Overview
                            </p>
                        </div>
                    )}

                    {/* Navigation Items */}
                    <nav className="flex-1 space-y-2">
                        {navigationItems.map((item) => (
                            <NavItem key={item.path} item={item} collapsed={sidebarCollapsed} />
                        ))}
                    </nav>

                    {/* User Section */}
                    {user && !sidebarCollapsed && (
                        <div className="mt-auto pt-6 border-t border-gray-200">
                            <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 mb-4">
                                <img
                                    src={user.avatarUrl || `https://placehold.co/40x40/E0E7FF/4F46E5?text=${user.name[0]}`}
                                    alt="User Avatar"
                                    className="h-10 w-10 rounded-full ring-2 ring-white shadow-sm"
                                />
                                <div className="ml-3 flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className={`
                            flex items-center w-full p-3 rounded-xl font-medium
                            text-gray-600 hover:bg-red-50 hover:text-red-600 
                            transition-all duration-200 group
                            ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
                        `}
                    >
                        <Icons.Logout />
                        {!sidebarCollapsed && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-grow flex-col min-w-0">
                {/* Header */}
                <header className="relative z-30 flex h-20 flex-shrink-0 items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 shadow-sm">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                        <Icons.Menu />
                    </button>

                    {/* Header Actions */}
                    <div className="flex items-center space-x-4 ml-auto">
                        {user && (
                            <>
                                {/* Notifications */}
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        onClick={toggleNotifications}
                                        className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
                                    >
                                        <Icons.Notification />
                                        {hasNewNotification && (
                                            <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center">
                                                    <span className="text-xs font-medium text-white">
                                                        {notifications.filter(n => !n.isRead).length}
                                                    </span>
                                                </span>
                                            </span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    {showNotifications && (
                                        <>
                                            {/* Overlay for mobile */}
                                            <div
                                                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                                                onClick={() => setShowNotifications(false)}
                                            ></div>

                                            <div className="
      absolute right-0 mt-2 z-50 
      w-[90vw] max-w-md md:w-96   /* Responsive width */
      max-h-[80vh] md:max-h-96   /* Taller on small screens */
      overflow-hidden origin-top-right 
      rounded-2xl bg-white/95 backdrop-blur-xl 
      shadow-2xl ring-1 ring-black/5 
      border border-gray-200/50 
      animate-in slide-in-from-top-2 duration-200
    ">
                                                {/* Header */}
                                                <div className="p-4 border-b border-gray-200/50">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                                        {notifications.some(n => !n.isRead) && (
                                                            <button
                                                                onClick={handleMarkAllRead}
                                                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                                                            >
                                                                Mark all read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Notifications list */}
                                                <div className="max-h-[70vh] md:max-h-80 overflow-y-auto">
                                                    {notifications.length > 0 ? (
                                                        notifications.map((notif, index) => (
                                                            <div
                                                                key={notif._id}
                                                                onClick={() => handleNotificationClick(notif)}
                                                                className={`
                block p-4 text-sm cursor-pointer transition-all duration-200
                hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                ${!notif.isRead ? 'bg-indigo-50/50' : ''}
              `}
                                                                style={{ animationDelay: `${index * 50}ms` }}
                                                            >
                                                                <div className="flex items-start space-x-3">
                                                                    {!notif.isRead && (
                                                                        <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-indigo-500"></span>
                                                                    )}
                                                                    <div className={`flex-1 ${notif.isRead ? 'ml-5' : ''}`}>
                                                                        <p className={`text-gray-900 ${!notif.isRead ? 'font-semibold' : ''}`}>
                                                                            {notif.message}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {new Date(notif.createdAt).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-8 text-center">
                                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                                <Icons.Notification />
                                                            </div>
                                                            <p className="text-gray-500">You're all caught up!</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>

                                {/* User Avatar - Desktop */}
                                <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-gray-200">
                                    <img
                                        src={user.avatarUrl || `https://placehold.co/40x40/E0E7FF/4F46E5?text=${user.name[0]}`}
                                        alt="User Avatar"
                                        className="h-10 w-10 rounded-full ring-2 ring-white shadow-sm"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">Online</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow overflow-y-auto p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
