const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ==================== REGISTER ====================

exports.register = async (req, res) => {
  console.log('🔥 REGISTER REQUEST RECEIVED');

  console.log('Body:', {
    username: req.body?.username,
    email: req.body?.email,
    hasPassword: !!req.body?.password
  });

  try {
    const { username, email, password } = req.body;

    console.log('🔍 Checking if username already exists...');

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log('⚠️ Username already taken');

      return res.status(400).json({
        error: 'Username already taken. Please change your username.'
      });
    }

    console.log('🔐 Hashing password...');

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('👤 Creating user...');

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    console.log('✅ User saved to MongoDB');

    console.log('🔑 Creating JWT...');

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    console.log('✅ JWT created');

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('🔥 REGISTER ERROR:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);

    return res.status(500).json({
      error: error.message
    });
  }
};


// ==================== LOGIN ====================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 LOGIN REQUEST:', email);

    let user = await User.findOne({ email });

    if (!user) {
      console.log('👤 User not found. Creating user...');

      const username = email.split('@')[0];

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        username,
        email,
        password: hashedPassword
      });

      await user.save();

      console.log('✅ New user created');

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d'
        }
      );

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        }
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('🔥 LOGIN ERROR:', error);
    console.error('Message:', error.message);

    return res.status(500).json({
      error: error.message
    });
  }
};


// ==================== GET ME ====================

exports.getMe = async (req, res) => {
  try {
    const u = req.user;

    return res.json({
      user: {
        id: u._id,
        username: u.username,
        email: u.email,
        avatar: u.avatar
      }
    });

  } catch (error) {
    console.error('🔥 GET ME ERROR:', error);
    console.error('Message:', error.message);

    return res.status(500).json({
      error: error.message
    });
  }
};
