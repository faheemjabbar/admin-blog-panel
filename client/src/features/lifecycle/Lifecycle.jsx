// src/features/lifecycle/Lifecycle.jsx
import React, { useState } from 'react';
import { Lightbulb, FileText, Edit, Calendar, CheckCircle } from 'lucide-react';

export default function Lifecycle() {
  const [steps, setSteps] = useState([
    { title: "Idea Generation", description: "Brainstorm and research new topics.", icon: <Lightbulb size={24} />, completed: false },
    { title: "Drafting", description: "Write the initial content.", icon: <FileText size={24} />, completed: false },
    { title: "Editing & Review", description: "Refine the draft and get feedback.", icon: <Edit size={24} />, completed: false },
    { title: "Scheduling", description: "Select a publication date and time.", icon: <Calendar size={24} />, completed: false },
    { title: "Publishing", description: "The content goes live.", icon: <CheckCircle size={24} />, completed: false }
  ]);

  const toggle = (i) => setSteps(steps.map((s, idx) => idx === i ? { ...s, completed: !s.completed } : s));

  return (
    <div className="flex-1 p-8">
      <h2 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">Post Lifecycle</h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
        Click a step to mark it complete.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center cursor-pointer transition-transform duration-200 transform hover:scale-105 ${step.completed ? 'ring-2 ring-green-500' : ''}`}
          >
            <div className="p-4 rounded-full inline-block mb-4">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
            {step.completed && (
              <div className="mt-2 text-green-500 flex items-center justify-center space-x-1">
                <CheckCircle size={16}/> 
                <span className="text-sm font-semibold">Completed</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
