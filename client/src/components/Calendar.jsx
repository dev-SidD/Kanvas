import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import { Loader2, AlertTriangle, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';

// Enhanced custom CSS for the premium indigo theme
const CalendarStyles = () => (
  <style>{`
    /* --- General Font & Container --- */
    .fc {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: transparent;
    }

    /* --- Toolbar & Header --- */
    .fc .fc-toolbar.fc-header-toolbar {
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1rem 0;
    }
    
    .fc .fc-toolbar-title {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 4px rgba(79, 70, 229, 0.1);
    }

    .fc .fc-button-group {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-radius: 1rem;
      overflow: hidden;
      background: white;
    }

    .fc .fc-button {
      background: white;
      border: none;
      color: #6366f1;
      font-weight: 600;
      padding: 0.75rem 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .fc .fc-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.5s;
    }

    .fc .fc-button:hover::before {
      left: 100%;
    }
    
    .fc .fc-button-primary:not(:disabled):hover {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      color: #4338ca;
      transform: translateY(-1px);
      box-shadow: 0 8px 25px -8px rgba(79, 70, 229, 0.3);
    }

    .fc .fc-button-primary:not(:disabled).fc-button-active {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      box-shadow: 0 8px 25px -8px rgba(79, 70, 229, 0.5);
    }

    /* --- Calendar Grid --- */
    .fc-theme-standard .fc-scrollgrid {
      border: none;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .fc .fc-daygrid-day {
      border-color: rgba(238, 242, 255, 0.8);
      transition: background-color 0.2s ease;
    }

    .fc .fc-daygrid-day:hover {
      background-color: rgba(238, 242, 255, 0.3);
    }

    .fc .fc-col-header-cell {
      border: none;
      padding: 1rem 0;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .fc .fc-col-header-cell-cushion {
      color: #475569;
      font-weight: 700;
      text-decoration: none;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .fc .fc-daygrid-day-number {
      color: #1e293b;
      padding: 0.75rem;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .fc .fc-daygrid-day-number:hover {
      color: #4f46e5;
      transform: scale(1.1);
    }

    .fc .fc-day-today {
      background: linear-gradient(135deg, rgba(238, 242, 255, 0.8) 0%, rgba(224, 231, 255, 0.6) 100%) !important;
      position: relative;
    }

    .fc .fc-day-today::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #4f46e5, #7c3aed);
    }

    .fc .fc-day-today .fc-daygrid-day-number {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }

    /* --- Event Styling --- */
    .fc-daygrid-event, .fc-timegrid-event {
      border: none;
      background: none !important;
      margin: 2px 4px;
      cursor: pointer;
    }

    .fc-daygrid-event-dot {
      display: none;
    }

    /* --- List View Styling --- */
    .fc-list-event:hover td {
      background-color: rgba(238, 242, 255, 0.5);
    }

    .fc-list-day-cushion {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      color: #475569;
      font-weight: 700;
    }

    /* --- Time Grid Styling --- */
    .fc .fc-timegrid-slot {
      border-color: rgba(238, 242, 255, 0.6);
    }

    .fc .fc-timegrid-axis-cushion {
      color: #64748b;
      font-weight: 600;
    }

    /* --- Responsive --- */
    @media (max-width: 768px) {
      .fc .fc-toolbar.fc-header-toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      
      .fc .fc-toolbar-title {
        font-size: 1.75rem;
        text-align: center;
      }

      .fc .fc-toolbar-chunk {
        display: flex;
        justify-content: center;
      }

      .fc .fc-button {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
    }

    /* --- Animation Keyframes --- */
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fc {
      animation: fadeInUp 0.6s ease-out;
    }
  `}</style>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[500px]">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <div className="space-y-2">
        <p className="text-xl font-semibold text-gray-800">Loading your calendar...</p>
        <p className="text-sm text-gray-500">Fetching your tasks and events</p>
      </div>
      <div className="mt-4 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-6 rounded-r-xl shadow-lg">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-bold text-red-800 mb-1">Oops! Something went wrong</h3>
        <p className="text-sm text-red-700 leading-relaxed">{message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

const StatsCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found. Please log in.');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`Failed to fetch user data. Status: ${response.status}`);

        const userData = await response.json();

        if (userData && userData.tasks) {
          const formattedEvents = userData.tasks
            .filter(task => task.dueDate && task.boardId)
            .map((task, index) => {
              // Color variations for visual diversity
              const colors = [
                { bg: '#4f46e5', border: '#4338ca' }, // indigo
                { bg: '#7c3aed', border: '#6d28d9' }, // violet
                { bg: '#db2777', border: '#be185d' }, // pink
                { bg: '#059669', border: '#047857' }, // emerald
                { bg: '#dc2626', border: '#b91c1c' }, // red
                { bg: '#ea580c', border: '#c2410c' }, // orange
              ];
              const colorSet = colors[index % colors.length];
              
              return {
                id: task._id,
                title: task.title,
                start: task.dueDate,
                allDay: false,
                extendedProps: {
                  boardId: task.boardId?._id,
                  boardTitle: task.boardId?.title || 'N/A'
                },
                backgroundColor: colorSet.bg,
                borderColor: colorSet.border,
              };
            });
          setEvents(formattedEvents);
        }
      } catch (err) {
        console.error("Error fetching user tasks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, []);

  const renderEventContent = (eventInfo) => {
    return (
      <div 
        className="group relative bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg p-2 w-full overflow-hidden hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50"
        title={`${eventInfo.event.title} - ${eventInfo.event.extendedProps.boardTitle}`}
      >
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: eventInfo.event.backgroundColor }}
          ></div>
          <div className="flex-1 min-w-0">
            {eventInfo.timeText && (
              <span className="text-xs font-semibold text-gray-500 block">{eventInfo.timeText}</span>
            )}
            <span className="text-sm font-medium text-gray-900 truncate block">{eventInfo.event.title}</span>
            <span className="text-xs text-gray-500 truncate block">{eventInfo.event.extendedProps.boardTitle}</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </div>
    );
  };

  const handleEventClick = (clickInfo) => {
    const boardId = clickInfo.event.extendedProps.boardId;
    if (boardId) {
      navigate(`/board/${boardId}`);
    } else {
      console.error("Could not find a board ID for this task.");
    }
  };

  // Calculate stats
  const totalTasks = events.length;
  const todayTasks = events.filter(event => {
    const today = new Date();
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === today.toDateString();
  }).length;
  const upcomingTasks = events.filter(event => {
    const today = new Date();
    const eventDate = new Date(event.start);
    return eventDate > today;
  }).length;

  return (
    <>
      <CalendarStyles />
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-3 mb-4">
                 
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                      My Calendar
                    </h1>
                    <p className="text-gray-600 text-lg mt-1">Your unified task timeline</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                icon={Clock}
                title="Total Tasks"
                value={totalTasks}
                color="bg-gradient-to-br from-indigo-500 to-indigo-600"
              />
              <StatsCard
                icon={MapPin}
                title="Due Today"
                value={todayTasks}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              <StatsCard
                icon={Users}
                title="Upcoming"
                value={upcomingTasks}
                color="bg-gradient-to-br from-pink-500 to-pink-600"
              />
            </div>
          </div>

          {/* Calendar Container */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/50 to-indigo-100/50 rounded-full translate-y-24 -translate-x-24 blur-3xl"></div>
            
            <div className="relative z-10">
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorDisplay message={error} />
              ) : (
                <div className="calendar-container">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,listWeek'
                    }}
                    initialView="dayGridMonth"
                    events={events}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    height="auto"
                    dayHeaderFormat={{ weekday: 'short' }}
                    editable={true}
                    droppable={true}
                    eventDisplay="block"
                    dayMaxEvents={3}
                    moreLinkClick="popover"
                    eventMouseEnter={(info) => {
                      info.el.style.transform = 'scale(1.02)';
                      info.el.style.zIndex = '10';
                    }}
                    eventMouseLeave={(info) => {
                      info.el.style.transform = 'scale(1)';
                      info.el.style.zIndex = '1';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Click on any task to navigate to its board • Drag events to reschedule
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;