const dns = require('dns');

dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'https://3-w-task-delta.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('MongoDB URI present:', !!process.env.MONGODB_URI);
    console.log('Connecting to MongoDB...');

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log('✅ Connected to MongoDB Atlas');
    console.log('Database:', mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('Full error:', err);

    process.exit(1);
  }
}

startServer();