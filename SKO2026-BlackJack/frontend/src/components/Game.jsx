import React, { useState, useEffect } from 'react';
import './Game.css';

function Game({ user, token, onLogout }) {
  const [gameState, setGameState] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    startGame();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/auth/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const startGame = async () => {
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch('/api/game/start', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGameState(data);
    } catch (err) {
      console.error('Error starting game:', err);
    } finally {
      setLoading(false);
    }
  };

  const hit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/game/hit', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGameState(data);
      
      if (data.playerValue > 21) {
        setResult('You busted! Dealer wins.');
        fetchStats();
      }
    } catch (err) {
      console.error('Error hitting:', err);
    } finally {
      setLoading(false);
    }
  };

  const stand = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/game/stand', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGameState(data);
      
      let resultMessage = '';
      if (data.result === 'win') {
        resultMessage = 'You win!';
      } else if (data.result === 'loss') {
        resultMessage = 'Dealer wins!';
      } else {
        resultMessage = "It's a tie!";
      }
      setResult(resultMessage);
      fetchStats();
    } catch (err) {
      console.error('Error standing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  if (!gameState) return <div className="loading">Loading game...</div>;

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="user-info">
          <h3>Welcome, {user.username}!</h3>
          {stats && (
            <div className="stats">
              <span>Wins: {stats.total_wins}</span>
              <span>Losses: {stats.total_losses}</span>
              <span>Games: {stats.total_games}</span>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="game-board">
        <h1>Blackjack</h1>
        
        {result && <div className="result-message">{result}</div>}
        
        <div className="hand dealer-hand">
          <h2>Dealer's Hand</h2>
          <div className="cards">
            {gameState.dealerHand.map((card, index) => (
              <div key={index} className="card">
                {card.value} of {card.suit}
              </div>
            ))}
          </div>
          <p className="hand-value">Total: {gameState.dealerValue}</p>
        </div>

        <div className="hand player-hand">
          <h2>Your Hand</h2>
          <div className="cards">
            {gameState.playerHand.map((card, index) => (
              <div key={index} className="card">
                {card.value} of {card.suit}
              </div>
            ))}
          </div>
          <p className="hand-value">Total: {gameState.playerValue}</p>
        </div>

        <div className="controls">
          {!result && gameState.playerValue <= 21 && (
            <>
              <button onClick={hit} disabled={loading}>Hit</button>
              <button onClick={stand} disabled={loading}>Stand</button>
            </>
          )}
          {result && (
            <button onClick={startGame} disabled={loading}>New Game</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;