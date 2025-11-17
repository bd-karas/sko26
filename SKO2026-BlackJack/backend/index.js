const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Initialize database
require('./database');

// Import routes
const { router: authRoutes } = require('./authRoutes');
const gameRoutes = require('./gameRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
  res.send('Blackjack backend is running!');
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});