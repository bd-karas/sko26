const express = require('express');
const router = express.Router();
const BlackjackGame = require('./gameLogic');

const game = new BlackjackGame();

router.get('/start', (req, res) => {
  console.log('Received request to start game');
  game.startGame();
  res.json(game.getGameState());
});

router.get('/hit', (req, res) => {
  console.log('Received request to hit');
  game.dealCard(game.playerHand);
  res.json(game.getGameState());
});

router.get('/stand', (req, res) => {
  console.log('Received request to stand');
  while (game.calculateHandValue(game.dealerHand) < 17) {
    game.dealCard(game.dealerHand);
  }
  res.json(game.getGameState());
});

module.exports = router;