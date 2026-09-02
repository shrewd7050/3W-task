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
  : [
      'http://localhost:3000',
      'https://3-w-task-delta.vercel.app'
    ];

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

// JSON parser
app.use(express.json());

// REQUEST LOGGER
app.use((req, res, next) => {
  console.log('==============================');
  console.log('📥 REQUEST RECEIVED');
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Body:', {
    username: req.body?.username,
    email: req.body?.email,
    hasPassword: !!req.body?.password
  });
  console.log('==============================');

  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('🔥 EXPRESS ERROR');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);

  res.status(500).json({
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log('MongoDB URI present:', !!process.env.MONGODB_URI);
    console.log('JWT SECRET present:', !!process.env.JWT_SECRET);
    console.log('CLOUDINARY_CLOUD_NAME present:', !!process.env.CLOUDINARY_CLOUD_NAME);
    console.log('CLOUDINARY_API_KEY present:', !!process.env.CLOUDINARY_API_KEY);
    console.log('CLOUDINARY_API_SECRET present:', !!process.env.CLOUDINARY_API_SECRET);
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