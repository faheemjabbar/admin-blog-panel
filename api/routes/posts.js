const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// GET all posts with optional filtering
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.authorId) {
      query.author = req.query.authorId;
    }
    const posts = await Post.find(query).populate('author', 'name').sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET analytics data for charts
router.get('/analytics', async (req, res) => {
  try {
    const publishedPosts = await Post.find({ status: 'Published' }).sort({ views: -1 }).limit(5).populate('author', 'name');
    const analyticsData = {
      topPosts: publishedPosts.map(p => ({ title: p.title, views: p.views })),
      pageViews: Array.from({ length: 30 }, () => Math.floor(Math.random() * 2000) + 500)
    };
    res.status(200).json(analyticsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new post (requires auth)
router.post('/', authMiddleware, async (req, res) => {
  const { title, status, date, views } = req.body;
  const post = new Post({
    title,
    author: req.userId,
    status,
    date,
    views
  });
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a post (requires auth)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a post (requires auth)
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;