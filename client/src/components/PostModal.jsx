// src/components/PostModal.jsx
import React, { useState, useEffect } from 'react';

export default function PostModal({ post = null, onClose, onSave, uniqueAuthors = [], type = 'add' }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Idea');
  const [date, setDate] = useState('');
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setStatus(post.status || 'Idea');
      setDate(post.date ? new Date(post.date).toISOString().split('T')[0] : '');
      setViews(post.views || 0);
    } else {
      setTitle('');
      setStatus('Idea');
      setDate('');
      setViews(0);
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      _id: post?._id,
      title,
      status,
      date: date || null,
      views: Number(views || 0),
    });
  };

  // Common input styles
  const inputClass =
    "mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 " +
    "bg-white dark:bg-gray-700 text-gray-900 dark:text-white " +
    "px-4 py-3 text-base " +
    "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none " +
    "placeholder-gray-400 dark:placeholder-gray-500";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-80 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {type === 'add' ? 'New Post' : 'Edit Post'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              placeholder="Enter post title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option>Idea</option>
              <option>Draft</option>
              <option>In Review</option>
              <option>Scheduled</option>
              <option>Published</option>
            </select>
          </div>

          {/* Published Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Published Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Views */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Views</label>
            <input
              type="number"
              placeholder="0"
              value={views}
              onChange={(e) => setViews(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                         text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {type === 'add' ? 'Create' : 'Save'} Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
