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
      {/* Sidebar is already fixed and correctly positioned at top-16 */}
      <Sidebar isOpen={isSidebarOpen} onSelect={handleSelect} active={activeView} />
      
      {/* This div now holds the header and the main content */}
      <div className="flex-1 lg:ml-64 relative">
        {/* Header is now fixed at the top */}
        <Header onToggleSidebar={toggleSidebar} isDarkMode={isDark} toggleDarkMode={toggleDark} />
        
        {/* Main content area needs top padding to not be hidden by the fixed header */}
        <main className="pt-16 overflow-y-auto h-[calc(100vh)]">
          {children}
        </main>
      </div>
    </div>
  );
}