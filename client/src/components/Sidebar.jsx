// src/components/Sidebar.jsx
import React from 'react';
import { FileText, LayoutDashboard, Calendar, Search } from 'lucide-react';

export default function Sidebar({ isOpen, onSelect, active }) {
  const nav = [
    { name: 'Content', id: 'content', icon: FileText },
    { name: 'Lifecycle', id: 'lifecycle', icon: LayoutDashboard },
    { name: 'Calendar', id: 'calendar', icon: Calendar },
    { name: 'SEO Tools', id: 'seo', icon: Search },
    { name: 'UI Principles', id: 'ui', icon: LayoutDashboard },
  ];

  return (
    <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 p-4 shadow-md overflow-y-auto transition-transform duration-200 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="p-4 text-center border-b border-gray-200 dark:border-gray-700 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Blog Panel Demo</h2>
        <p className="text-sm text-gray-500">Interactive Showcase</p>
      </div>

      <nav className="space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const activeClass = active === item.id ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex items-center space-x-3 p-3 my-1 rounded-md cursor-pointer transition-colors duration-200 w-full ${activeClass}`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}