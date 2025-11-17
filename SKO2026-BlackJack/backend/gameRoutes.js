const express = require('express');
const router = express.Router();
const BlackjackGame = require('./gameLogic');
const auth = require('./auth');
const { authenticateToken } = require('./authRoutes');

// Store active games per user
const activeGames = new Map();

// Get or create game for user
const getGame = (userId) => {
  if (!activeGames.has(userId)) {
    activeGames.set(userId, new BlackjackGame());
  }
  return activeGames.get(userId);
};

// Calculate game result
const calculateResult = (playerValue, dealerValue) => {
  if (playerValue > 21) return 'loss';
  if (dealerValue > 21) return 'win';
  if (playerValue > dealerValue) return 'win';
  if (playerValue < dealerValue) return 'loss';
  return 'tie';
};

// Start new game (protected route)
router.get('/start', authenticateToken, (req, res) => {
  console.log('Received request to start game for user:', req.user.username);
  const game = getGame(req.user.id);
  game.startGame();
  res.json(game.getGameState());
});

// Hit (protected route)
router.get('/hit', authenticateToken, (req, res) => {
  console.log('Received request to hit for user:', req.user.username);
  const game = getGame(req.user.id);
  game.dealCard(game.playerHand);
  const state = game.getGameState();
  
  // Check if player busted
  if (state.playerValue > 21) {
    // Auto-save game result
    auth.saveGameResult(
      req.user.id,
      state.playerHand,
      state.dealerHand,
      state.playerValue,
      state.dealerValue,
      'loss'
    ).catch(err => console.error('Error saving game:', err));
  }
  
  res.json(state);
});

// Stand (protected route)
router.get('/stand', authenticateToken, async (req, res) => {
  console.log('Received request to stand for user:', req.user.username);
  const game = getGame(req.user.id);
  
  // Dealer plays
  while (game.calculateHandValue(game.dealerHand) < 17) {
    game.dealCard(game.dealerHand);
  }
  
  const state = game.getGameState();
  const result = calculateResult(state.playerValue, state.dealerValue);
  
  // Save game result
  try {
    await auth.saveGameResult(
      req.user.id,
      state.playerHand,
      state.dealerHand,
      state.playerValue,
      state.dealerValue,
      result
    );
  } catch (err) {
    console.error('Error saving game:', err);
  }
  
  res.json({ ...state, result });
});

module.exports = router;