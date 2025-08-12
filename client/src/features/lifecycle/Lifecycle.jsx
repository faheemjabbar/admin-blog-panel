// src/features/lifecycle/Lifecycle.jsx
import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  FileText,
  Edit,
  Calendar,
  CheckCircle,
} from "lucide-react";

const iconMap = {
  lightbulb: <Lightbulb size={24} />,
  filetext: <FileText size={24} />,
  edit: <Edit size={24} />,
  calendar: <Calendar size={24} />,
  checkcircle: <CheckCircle size={24} />,
};

export default function Lifecycle() {
  const initialSteps = [
    {
      title: "Idea Generation",
      description: "Brainstorm new topics.",
      icon: "lightbulb",
      completed: false,
      dueDate: "",
      notes: "",
    },
    {
      title: "Drafting",
      description: "Write the initial content.",
      icon: "filetext",
      completed: false,
      dueDate: "",
      notes: "",
    },
    {
      title: "Editing & Review",
      description: "Refine the draft and get feedback.",
      icon: "edit",
      completed: false,
      dueDate: "",
      notes: "",
    },
    {
      title: "Scheduling",
      description: "Select a publication date and time.",
      icon: "calendar",
      completed: false,
      dueDate: "",
      notes: "",
    },
    {
      title: "Publishing",
      description: "The content goes live.",
      icon: "checkcircle",
      completed: false,
      dueDate: "",
      notes: "",
    },
  ];

  const [steps, setSteps] = useState(() => {
    const saved = localStorage.getItem("lifecycleSteps");
    return saved ? JSON.parse(saved) : initialSteps;
  });

  // Save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("lifecycleSteps", JSON.stringify(steps));
    } catch (err) {
      console.error("Failed to save lifecycleSteps:", err);
    }
  }, [steps]);

  const toggle = (i) =>
    setSteps((prev) =>
      prev.map((s, idx) =>
        idx === i ? { ...s, completed: !s.completed } : s
      )
    );

  const updateDueDate = (i, date) =>
    setSteps((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, dueDate: date } : s))
    );

  const updateNotes = (i, text) =>
    setSteps((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, notes: text } : s))
    );

  const progress =
    (steps.filter((step) => step.completed).length / steps.length) * 100;

  const getCardColor = (completed) => {
    if (completed) return "ring-2 ring-green-500";
    return "hover:ring-2 hover:ring-yellow-400";
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
        Post Lifecycle
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
        Track your post’s journey from idea to publishing.
      </p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-10">
        <div
          className="bg-green-500 h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-transform duration-200 transform hover:scale-105 cursor-pointer ${getCardColor(
              step.completed
            )}`}
          >
            <div onClick={() => toggle(i)}>
              <div className="p-4 rounded-full inline-block mb-4">
                {iconMap[step.icon]}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
              {step.completed && (
                <div className="mt-2 text-green-500 flex items-center justify-center space-x-1">
                  <CheckCircle size={16} />
                  <span className="text-sm font-semibold">Completed</span>
                </div>
              )}
            </div>

            {/* Due date */}
            <div className="mt-4">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Due Date:
              </label>
              <input
                type="date"
                value={step.dueDate}
                onChange={(e) => updateDueDate(i, e.target.value)}
                className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-600 
               text-sm text-gray-800 dark:text-gray-200 
               bg-white dark:bg-gray-700 
               placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Notes:
              </label>
              <textarea
                value={step.notes}
                onChange={(e) => updateNotes(i, e.target.value)}
                placeholder="Add details..."
                className="w-full min-h-[40px] px-3 py-2 rounded border border-gray-300 dark:border-gray-600 
               text-sm text-gray-800 dark:text-gray-200 
               bg-white dark:bg-gray-700 
               placeholder-gray-400 dark:placeholder-gray-300 resize-none"
    rows={2}
  />
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
