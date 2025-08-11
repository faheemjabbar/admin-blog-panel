// src/components/MessageModal.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function MessageModal({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Alert</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{message}</p>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
