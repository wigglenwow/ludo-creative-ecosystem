const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// IMPORT SECURITY DEFENDERS
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// 1. Load environment variables
dotenv.config();

console.log("DEBUG: Your URI is ->", process.env.MONGO_URI); 

// 2. Initialize the Express server framework
const app = express();

// =========================================================================
// SECURITY MIDDLEWARE SHIELDS (Must be placed before routes)
// =========================================================================
app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173', // Your React/Vite app URI
  credentials: true
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    message: "Too many attempts from this IP address. Please try again after 15 minutes."
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use('/api/auth', authLimiter);

// =========================================================================

// 3. Fire up the bridge to MongoDB Atlas
connectDB();

// 4. Parse incoming JSON payloads
app.use(express.json());

// Mounting Routing Engine Doors
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

app.get('/', (req, res) => {
  res.send('WiggleNWow Backend Engine is running securely with Real-Time Sockets.');
});

// =========================================================================
// 🚀 SOCKET.IO REAL-TIME COMMUNICATION CONFIGURATION
// =========================================================================
const http = require('http');
const server = http.createServer(app); // Wrap Express inside a native HTTP Server instance
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your frontend dev platform to connect
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Setup the active socket listener pipeline
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to signaling matrix: ${socket.id}`);

  // Event A: User enters a specific conversation room stream
  socket.on('join_room', (chatId) => {
    socket.join(chatId);
    console.log(`👤 User joined dynamic chat space ID: ${chatId}`);
  });

  // Event B: Processing a real-time message relay bubble
  socket.on('send_message', (data) => {
    // data payload shape: { chat: chatId, sender: userId, text: "message text" }
    // Instantly broadcasts the payload directly into the target room channel
    socket.to(data.chat).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected from socket link: ${socket.id}`);
  });
});

// Turn on the upgraded server layer engine instance loop
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Secure Socket-Enabled Server running on http://localhost:${PORT}`);
});