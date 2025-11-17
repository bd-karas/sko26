const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');

const JWT_SECRET = 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// Register a new user
const registerUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) {
        return reject(err);
      }

      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.run(sql, [username, email, hash], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return reject(new Error('Username or email already exists'));
          }
          return reject(err);
        }
        resolve({ id: this.lastID, username, email });
      });
    });
  });
};

// Login user
const loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, user) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return reject(new Error('Invalid username or password'));
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return reject(err);
        }
        if (!result) {
          return reject(new Error('Invalid username or password'));
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        resolve({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            total_wins: user.total_wins,
            total_losses: user.total_losses,
            total_games: user.total_games
          }
        });
      });
    });
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

// Get user stats
const getUserStats = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT total_wins, total_losses, total_games FROM users WHERE id = ?';
    db.get(sql, [userId], (err, stats) => {
      if (err) {
        return reject(err);
      }
      resolve(stats);
    });
  });
};

// Save game result
const saveGameResult = (userId, playerHand, dealerHand, playerValue, dealerValue, result) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO game_history (user_id, player_hand, dealer_hand, player_value, dealer_value, result)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [
      userId,
      JSON.stringify(playerHand),
      JSON.stringify(dealerHand),
      playerValue,
      dealerValue,
      result
    ], function(err) {
      if (err) {
        return reject(err);
      }

      // Update user stats
      let updateSql;
      if (result === 'win') {
        updateSql = 'UPDATE users SET total_wins = total_wins + 1, total_games = total_games + 1 WHERE id = ?';
      } else if (result === 'loss') {
        updateSql = 'UPDATE users SET total_losses = total_losses + 1, total_games = total_games + 1 WHERE id = ?';
      } else {
        updateSql = 'UPDATE users SET total_games = total_games + 1 WHERE id = ?';
      }

      db.run(updateSql, [userId], (err) => {
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID });
      });
    });
  });
};

// Get user game history
const getGameHistory = (userId, limit = 10) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM game_history
      WHERE user_id = ?
      ORDER BY played_at DESC
      LIMIT ?
    `;
    db.all(sql, [userId, limit], (err, games) => {
      if (err) {
        return reject(err);
      }
      resolve(games.map(game => ({
        ...game,
        player_hand: JSON.parse(game.player_hand),
        dealer_hand: JSON.parse(game.dealer_hand)
      })));
    });
  });
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  getUserStats,
  saveGameResult,
  getGameHistory
};