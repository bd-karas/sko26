const express = require('express');
const router = express.Router();
const auth = require('./auth');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = await auth.verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const user = await auth.registerUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const result = await auth.loginUser(username, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Get user stats (protected route)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await auth.getUserStats(req.user.id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get game history (protected route)
router.get('/history', authenticateToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    const history = await auth.getGameHistory(req.user.id, limit);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch game history' });
  }
});

// Verify token (protected route)
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = { router, authenticateToken };