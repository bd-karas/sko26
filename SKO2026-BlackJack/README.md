# Blackjack Game with User Authentication

A full-stack Blackjack game built with Node.js, Express, React, Vite, and SQLite database for user authentication and game history tracking.

## Project Structure

```
SKO2026-BlackJack/
├── backend/
│   ├── index.js          # Express server with database initialization
│   ├── database.js       # SQLite database setup
│   ├── auth.js           # Authentication logic (bcrypt, JWT)
│   ├── authRoutes.js     # Authentication API routes
│   ├── gameRoutes.js     # Game API routes (protected)
│   ├── gameLogic.js      # Blackjack game logic
│   ├── blackjack.db      # SQLite database (auto-created)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx       # Login component
    │   │   ├── Register.jsx    # Registration component
    │   │   ├── Game.jsx        # Game component with stats
    │   │   ├── Login.css       # Auth styles
    │   │   └── Game.css        # Game styles
    │   ├── App.jsx             # Main app with auth flow
    │   └── App.css
    ├── vite.config.js          # Vite configuration with proxy
    └── package.json
```

## Features

### Authentication
- User registration with email and password
- Secure password hashing using bcrypt
- JWT-based authentication
- Protected game routes
- Persistent login sessions

### Game Features
- Player vs Dealer gameplay
- Standard Blackjack rules
- Hit and Stand actions
- Automatic dealer play (dealer hits until 17 or higher)
- Real-time game state updates
- Game result tracking

### User Statistics
- Total wins tracking
- Total losses tracking
- Total games played
- Game history storage
- Personal stats display

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `created_at` - Account creation timestamp
- `total_wins` - Number of wins
- `total_losses` - Number of losses
- `total_games` - Total games played

### Game History Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `player_hand` - JSON of player's cards
- `dealer_hand` - JSON of dealer's cards
- `player_value` - Final player hand value
- `dealer_value` - Final dealer hand value
- `result` - Game result (win/loss/tie)
- `played_at` - Game timestamp

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd SKO2026-BlackJack/backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
   
   Dependencies include:
   - express
   - cors
   - sqlite3
   - bcrypt
   - jsonwebtoken
   - express-session

3. Start the backend server:
   ```bash
   node index.js
   ```

   The server will run on `http://localhost:3000` and automatically create the SQLite database.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd SKO2026-BlackJack/frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## How to Use

### First Time Users

1. Open your browser and navigate to `http://localhost:5173`
2. Click "Register here" to create a new account
3. Fill in username, email, and password (minimum 6 characters)
4. After successful registration, you'll be redirected to login
5. Login with your credentials

### Playing the Game

1. After logging in, you'll see the game board with your stats
2. The game automatically starts with both player and dealer receiving 2 cards
3. Click "Hit" to draw another card
4. Click "Stand" to end your turn and let the dealer play
5. The dealer will automatically draw cards until reaching 17 or higher
6. Game results are automatically saved to your history
7. Click "New Game" to start another round
8. Your stats (wins, losses, total games) update automatically

### User Stats

Your statistics are displayed at the top of the game screen:
- **Wins**: Total number of games won
- **Losses**: Total number of games lost
- **Games**: Total number of games played

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/stats` - Get user statistics (protected)
- `GET /api/auth/history` - Get game history (protected)
- `GET /api/auth/verify` - Verify JWT token (protected)

### Game Endpoints (All Protected)
- `GET /api/game/start` - Start a new game
- `GET /api/game/hit` - Draw a card for the player
- `GET /api/game/stand` - End player's turn and let dealer play

## Technologies Used

- **Backend**: 
  - Node.js
  - Express
  - SQLite3 (database)
  - bcrypt (password hashing)
  - jsonwebtoken (JWT authentication)
  - CORS

- **Frontend**: 
  - React
  - Vite
  - CSS3 (with gradients and animations)

- **Game Logic**: 
  - Custom Blackjack implementation
  - Standard deck and rules

## Game Rules

- Number cards (2-10) are worth their face value
- Face cards (Jack, Queen, King) are worth 10
- Aces are worth 11, but count as 1 if the hand would bust
- Dealer must hit until reaching 17 or higher
- Player can hit or stand at any time
- Player busts if hand value exceeds 21

## Security Features

- Passwords are hashed using bcrypt with salt rounds
- JWT tokens for secure authentication
- Protected API routes requiring valid tokens
- CORS enabled for cross-origin requests
- Session persistence using localStorage

## Troubleshooting

If you encounter issues:

1. **Database errors**: Delete `blackjack.db` and restart the backend to recreate tables
2. **Authentication errors**: Clear browser localStorage and try logging in again
3. **Connection errors**: Ensure both servers are running (backend on 3000, frontend on 5173)
4. **CORS errors**: Verify the Vite proxy configuration in `frontend/vite.config.js`
5. **Module errors**: Run `npm install` in both backend and frontend directories

## Development Notes

- The JWT secret key should be changed in production (see `backend/auth.js`)
- SQLite database file is created automatically on first run
- Game state is stored per user session
- All game results are persisted to the database
- Frontend uses localStorage for token persistence

## Future Enhancements

Potential features to add:
- Betting system with virtual currency
- Leaderboard showing top players
- Multiple game modes (e.g., Spanish 21, Pontoon)
- Card counting statistics
- Multiplayer support
- Mobile-responsive design improvements