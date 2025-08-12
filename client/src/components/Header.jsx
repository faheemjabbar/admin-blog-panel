// src/components/Header.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Menu, Bell, Lightbulb, Moon, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Header({ onToggleSidebar, isDarkMode, toggleDarkMode }) {
  const { user, logout } = useContext(AuthContext);
  const [showUserBox, setShowUserBox] = useState(false);
  const userBoxRef = useRef(null);

  // Close user box if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userBoxRef.current && !userBoxRef.current.contains(event.target)) {
        setShowUserBox(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 p-4 shadow-sm flex justify-between items-center transition-colors duration-300">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {user?.name || 'Guest'}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {isDarkMode ? <Lightbulb size={18} /> : <Moon size={18} />}
        </button>
        <Bell className="text-gray-500 dark:text-gray-400" />
        <div className="relative" ref={userBoxRef}>
          <div
            className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold cursor-pointer select-none"
            onClick={() => setShowUserBox(!showUserBox)}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {showUserBox && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-20 transition-opacity duration-200">
              <div className="p-4 border-b dark:border-gray-600">
                <p className="font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-md flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
