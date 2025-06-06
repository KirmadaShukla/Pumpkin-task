const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./models/config'); // Import MongoDB connection
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const socketHandler = require('./sockets/socket');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Root endpoint to confirm API is working
app.get('/', async (req, res) => {
  res.json({
    message: 'API is working',
    status: 'success',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use(errorMiddleware);

socketHandler(io);

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));