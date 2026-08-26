const express = require('express');
const { readData, writeData } = require('../utils/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const BLOGS_FILE = 'blogs.json';

// POST /api/blogs (protected) — create a new post
router.post('/', requireAuth, (req, res) => {
  const { title, tag, body, status } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: 'Title must be at least 3 characters.' });
  }
  if (!body || body.trim().length < 20) {
    return res.status(400).json({ message: 'Body must be at least 20 characters.' });
  }

  const blogs = readData(BLOGS_FILE);
  const newBlog = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    title: title.trim(),
    tag: tag ? tag.trim() : 'Untagged',
    body: body.trim(),
    status: status === 'draft' ? 'draft' : 'published',
    authorId: req.user.id,
    authorName: req.user.name,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  blogs.push(newBlog);
  writeData(BLOGS_FILE, blogs);

  res.status(201).json({ message: 'Post saved.', post: newBlog });
});

// GET /api/blogs (protected) — list the logged-in user's posts
router.get('/', requireAuth, (req, res) => {
  const blogs = readData(BLOGS_FILE);
  const mine = blogs
    .filter((b) => b.authorId === req.user.id)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json({ posts: mine });
});

// GET /api/blogs/public — all published posts, for the home page (no auth needed)
router.get('/public', (req, res) => {
  const blogs = readData(BLOGS_FILE);
  const published = blogs
    .filter((b) => b.status === 'published')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 12);
  res.json({ posts: published });
});

// GET /api/blogs/:id (protected)
router.get('/:id', requireAuth, (req, res) => {
  const blogs = readData(BLOGS_FILE);
  const post = blogs.find((b) => b.id === req.params.id && b.authorId === req.user.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  res.json({ post });
});

// PUT /api/blogs/:id (protected) — update a post
router.put('/:id', requireAuth, (req, res) => {
  const blogs = readData(BLOGS_FILE);
  const index = blogs.findIndex((b) => b.id === req.params.id && b.authorId === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'Post not found.' });

  const { title, tag, body, status } = req.body;
  if (title && title.trim().length >= 3) blogs[index].title = title.trim();
  if (tag) blogs[index].tag = tag.trim();
  if (body && body.trim().length >= 20) blogs[index].body = body.trim();
  if (status === 'draft' || status === 'published') blogs[index].status = status;
  blogs[index].updatedAt = new Date().toISOString();

  writeData(BLOGS_FILE, blogs);
  res.json({ message: 'Post updated.', post: blogs[index] });
});

// DELETE /api/blogs/:id (protected)
router.delete('/:id', requireAuth, (req, res) => {
  const blogs = readData(BLOGS_FILE);
  const index = blogs.findIndex((b) => b.id === req.params.id && b.authorId === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'Post not found.' });

  blogs.splice(index, 1);
  writeData(BLOGS_FILE, blogs);
  res.json({ message: 'Post deleted.' });
});

module.exports = router;
