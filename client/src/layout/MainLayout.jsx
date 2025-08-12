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

    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <Sidebar isOpen={isSidebarOpen} onSelect={handleSelect} active={activeView} />

      <div className="flex-1 ml-0 lg:ml-64">

        <Header onToggleSidebar={toggleSidebar} isDarkMode={isDark} toggleDarkMode={toggleDark} />

        <main className="pt-16 overflow-y-auto h-[calc(100vh-4rem)]">

          {children}

        </main>

      </div>

    </div>

  );

}



