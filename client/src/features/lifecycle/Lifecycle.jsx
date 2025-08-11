import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import MessageModal from '../../components/MessageModal';

// The main CalendarView component
export default function CalendarView() {
  // Now using useContext for AuthContext as originally intended
  const { setModal } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Function to fetch events from the API
  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/calendar');
      setEvents(res);
    } catch (err) {
      console.error(err);
      // Using the app's global modal via AuthContext
      setModal({ message: err.message || 'Failed to load events', type: 'error' });
    }
  };

  // The useEffect hook now depends on `currentDate` so that events are re-fetched
  // whenever the user navigates to a new month.
  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  // Helper functions to calculate calendar days
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y, m) => new Date(y, m, 1).getDay();

  // Get month and year from the `currentDate` state
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const numDays = daysInMonth(currentYear, currentMonth);
  const start = firstDay(currentYear, currentMonth);
  const days = [...Array(start).fill(null), ...Array.from({ length: numDays }, (_, i) => i + 1)];

  // Filter events for a specific date
  const eventsForDate = (d) => {
    const key = new Date(currentYear, currentMonth, d).toDateString();
    return events.filter(e => new Date(e.date).toDateString() === key);
  };

  // Function to open the event creation modal
  const openModal = (day, event = null) => {
    setSelectedDate(day);
    setEditingEventId(event ? event._id : null);
    setInput(event ? event.name : '');
    setIsOpen(true);
  };

  // Function to save a new event or update an existing one
  const save = async () => {
    if (!input.trim()) return;
    try {
      const dateObj = new Date(currentYear, currentMonth, selectedDate);
      if (editingEventId) {
        await api.put(`/api/calendar/${editingEventId}`, { name: input.trim(), date: dateObj.toISOString() });
      } else {
        await api.post('/api/calendar', { name: input.trim(), date: dateObj.toISOString() });
      }
      setIsOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setModal({ message: err.body?.message || err.message || 'Failed to save event', type: 'error' });
    }
  };

  // Function to delete an event
  const deleteEvent = async () => {
    if (!editingEventId) return;
    try {
      await api.delete(`/api/calendar/${editingEventId}`);
      setIsOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setModal({ message: err.body?.message || err.message || 'Failed to delete event', type: 'error' });
    }
  };

  // Functions to navigate to the previous and next month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Function to check if a day is today's date
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  return (
    <div className="flex-1 p-8">
      {/* Navigation and Title Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
        >
          &lt; Previous
        </button>
        <h2 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
          {/* Display the current month and year */}
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
        >
          Next &gt;
        </button>
      </div>

      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Click a date to add an event.</p>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-700 dark:text-gray-300 mb-4 border-b dark:border-gray-700 pb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((d, i) => (
            <div
              key={i}
              onClick={() => d !== null && openModal(d)}
              className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 aspect-square ${
                // Conditional styling for the day cells
                d !== null
                  ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200'
                  : ''
              } ${
                d !== null
                  ? isToday(d)
                    ? 'bg-indigo-200 dark:bg-indigo-600'
                    : 'bg-gray-50 dark:bg-gray-700'
                  : ''
              }`}
            >
              {d !== null && (
                <>
                  {/* Conditional styling for the day number */}
                  <div className={`font-semibold ${isToday(d) ? 'text-indigo-800 dark:text-indigo-100' : 'text-gray-800 dark:text-white'}`}>
                    {d}
                  </div>
                  <div className="text-xs mt-1 flex flex-col items-center gap-1">
                    {eventsForDate(d).map(ev => (
                      <div
                        key={ev._id}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the parent div's onClick from firing
                          openModal(d, ev);
                        }}
                        className="bg-indigo-500 text-white rounded-full px-2 py-1 truncate w-full text-center"
                      >
                        {ev.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for adding/editing events */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-10">
              {editingEventId ? 'Edit event' : 'Add event for'} {selectedDate}
            </h3>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Event name"
            />
            <div className="flex justify-between gap-2 mt-4">
              <div className="flex">
                {editingEventId && (
                  <button onClick={deleteEvent} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                    Delete
                  </button>
                )}
              </div>
              <div className="flex">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Cancel</button>
                <button
                  onClick={save}
                  disabled={!input.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ml-2 ${
                    !input.trim()
                      ? 'bg-blue-300 cursor-not-allowed text-gray-500'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message modal for errors, using the component from the app */}
      {/* Note: MessageModal is now properly imported and used */}
      {message && <MessageModal message={message} onClose={() => setMessage('')} />}
    </div>
  );
}
