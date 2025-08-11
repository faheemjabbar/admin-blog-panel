// src/features/calendar/CalendarView.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import MessageModal from '../../components/MessageModal';

export default function CalendarView() {
  const { setModal } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/calendar');
      setEvents(res);
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to load events');
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y, m) => new Date(y, m, 1).getDay();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const numDays = daysInMonth(currentYear, currentMonth);
  const start = firstDay(currentYear, currentMonth);
  const days = [...Array(start).fill(null), ...Array.from({ length: numDays }, (_, i) => i + 1)];

  const eventsForDate = (d) => {
    const key = new Date(currentYear, currentMonth, d).toDateString();
    return events.filter(e => new Date(e.date).toDateString() === key);
  };

  const openModal = (day) => {
    setSelectedDate(day);
    setIsOpen(true);
    setInput('');
  };

  const save = async () => {
    if (!input.trim()) return;
    try {
      const dateObj = new Date(currentYear, currentMonth, selectedDate);
      await api.post('/api/calendar', { name: input.trim(), date: dateObj.toISOString() });
      setIsOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setMessage(err.body?.message || err.message || 'Failed to save event');
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">Editorial Calendar</h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Click a date to add an event.</p>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-700 dark:text-gray-300 mb-4 border-b dark:border-gray-700 pb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((d, i) => (
            <div key={i} onClick={() => d !== null && openModal(d)} className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 aspect-square bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200`}>
              {d !== null && (
                <>
                  <div className="font-semibold text-gray-800 dark:text-white">{d}</div>
                  <div className="text-xs mt-1 flex flex-col items-center gap-1">
                    {eventsForDate(d).map(ev => <div key={ev._id} className="bg-indigo-500 text-white rounded-full px-2 py-1 truncate w-full text-center">{ev.name}</div>)}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add event for {selectedDate}</h3>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Event name" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg">Cancel</button>
              <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {message && <MessageModal message={message} onClose={() => setMessage('')} />}
    </div>
  );
}
