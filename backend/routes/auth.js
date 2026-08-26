const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readData, writeData } = require('../utils/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const USERS_FILE = 'users.json';

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'dev_secret_change_me',
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Name is required.' });
  }
  if (!email || !isEmail(email)) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const users = readData(USERS_FILE);
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeData(USERS_FILE, users);

  const token = signToken(newUser);
  res.status(201).json({
    message: 'Account created successfully.',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !isEmail(email)) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  const users = readData(USERS_FILE);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = signToken(user);
  res.json({
    message: 'Logged in successfully.',
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// GET /api/auth/me (protected) — used by frontend to check if token is still valid
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
