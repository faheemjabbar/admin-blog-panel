// src/features/content/ContentDashboard.jsx
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Search, Plus, Edit, Trash, Loader, CheckCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import PostModal from '../../components/PostModal';
import useDebounce from '../../hooks/useDebounce';
import MessageModal from '../../components/MessageModal';

export default function ContentDashboard() {
  const { user, setModal } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterAuthor, setFilterAuthor] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentPost, setCurrentPost] = useState(null);
  const [message, setMessage] = useState('');

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/posts${filterAuthor ? `?authorId=${filterAuthor}` : ''}`);
      setPosts(res);
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
    // eslint-disable-next-line
  }, [user, filterAuthor]);

  // search and filter
  const filteredPosts = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return posts.filter(post =>
      post.title?.toLowerCase().includes(q) ||
      post.author?.name?.toLowerCase().includes(q)
    );
  }, [posts, debouncedSearch]);

  const uniqueAuthors = useMemo(() => {
    const acc = [];
    posts.forEach(p => {
      if (p.author && !acc.find(a => a._id === p.author._id)) acc.push(p.author);
    });
    return acc;
  }, [posts]);

  const openNewPost = () => {
    setCurrentPost(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleSavePost = async (postData) => {
    try {
      if (modalType === 'add') {
        await api.post('/api/posts', { ...postData });
      } else {
        await api.put(`/api/posts/${postData._id}`, postData);
      }
      await fetchPosts();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setMessage(err.body?.message || err.message || 'Failed to save post');
    }
  };

  const handleEdit = (p) => {
    setCurrentPost(p);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.del(`/api/posts/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      setMessage(err.body?.message || err.message || 'Delete failed');
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">Content Management</h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Manage blog posts below.</p>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search posts..." className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
        <select value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)} className="w-full md:w-48 px-4 py-2 rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">All Authors</option>
          {uniqueAuthors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
        <button onClick={openNewPost} className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-md">
          <Plus size={18}/> <span>New Post</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr><td colSpan="6" className="text-center py-8"><div className="flex flex-col items-center"><Loader className="animate-spin" size={32}/> <span>Loading posts...</span></div></td></tr>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white truncate max-w-sm">{post.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{post.author?.name || 'Unknown'}</td>
                  <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : post.status === 'In Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : post.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>{post.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{post.date ? new Date(post.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{post.views}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(post)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:text-red-900 dark:text-red-400"><Trash size={16}/></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">No posts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <PostModal post={currentPost} onClose={() => setShowModal(false)} onSave={handleSavePost} type={modalType} uniqueAuthors={uniqueAuthors} />
      )}

      {message && <MessageModal message={message} onClose={() => setMessage('')} />}
    </div>
  );
}
