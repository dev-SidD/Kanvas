const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http'); // 1. Import Node's http module
const { Server } = require("socket.io"); // 2. Import Server from socket.io

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// 3. Create an HTTP server from the Express app
const server = http.createServer(app);

// 4. Initialize Socket.IO and configure CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // The origin of your React client
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON requests

// 5. Middleware to attach the 'io' instance to every request
// This makes it accessible in your API controllers as `req.io`
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 6. Handle WebSocket connections
io.on('connection', (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  // Listen for a client to join a specific board's "room"
  socket.on('join_board', (boardId) => {
    socket.join(boardId);
    console.log(`Socket ${socket.id} joined board room: ${boardId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});


// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/workspaces', require('./routes/workspaces'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/lists', require('./routes/lists'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/notifications', require('./routes/notifications')); // ✅ Added notifications route

// Root health-check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;

// 7. Listen on the 'server' instance, not the 'app'
server.listen(PORT, () => console.log(`🚀 Server (with Socket.IO) started on port ${PORT}`));
