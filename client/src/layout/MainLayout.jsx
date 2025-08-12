// src/layout/MainLayout.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainLayout({ children, onNavSelect, activeView }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const toggleDark = () => {
    setIsDark((d) => !d);
    if (!isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleSelect = (view) => {
    if (typeof onNavSelect === 'function') onNavSelect(view);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Sidebar is fixed and positioned below the header on large screens */}
      <Sidebar isOpen={isSidebarOpen} onSelect={handleSelect} active={activeView} />
      
      {/* This div contains the header and main content */}
      <div className="flex-1 lg:ml-64 relative">
        {/* Header is fixed to the top */}
        <Header onToggleSidebar={toggleSidebar} isDarkMode={isDark} toggleDarkMode={toggleDark} />
        
        {/* Main content with top padding to account for the header */}
        <main className="pt-16 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}