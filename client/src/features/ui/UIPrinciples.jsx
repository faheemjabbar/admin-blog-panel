// src/features/ui/UIPrinciples.jsx
import React from 'react';

export default function UIPrinciples() {
  const principles = [
    { title: 'Clarity', desc: 'Make content easy to scan—clear labels, hierarchy, and spacing.' },
    { title: 'Consistency', desc: 'Use the same components and visual rules across the app.' },
    { title: 'Feedback', desc: 'Show confirmations and errors promptly and clearly.' },
    { title: 'Efficiency', desc: 'Minimize steps required to complete a task.' },
    { title: 'Adaptability', desc: 'Work well across screen sizes and in both light & dark modes.' },
  ];

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
          UI Principles in Action
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
          Show practical examples of core UI principles in action.
        </p>
      </div>

      {/* Principles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {principles.map((p, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition transform hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
              {p.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
