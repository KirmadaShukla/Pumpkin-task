const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./models/config'); // Import MongoDB connection
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const socketHandler = require('./sockets/socket');
const { generatedErrors } = require('./middleware/error');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } });

// Connect to MongoDB
connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser());

// Root endpoint to confirm API is working
app.get('/', async (_req, res) => {
  res.json({
    message: 'API is working',
    status: 'success',
    version: '1.0.0'
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);

// Error handling middleware should be last
app.use(generatedErrors);

socketHandler(io);

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));