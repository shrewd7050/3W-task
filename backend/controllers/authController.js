const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  console.log('🔥 REGISTER REQUEST RECEIVED');

  console.log('Body:', {
    username: req.body?.username,
    email: req.body?.email,
    hasPassword: !!req.body?.password
  });

  try {
    // ⬇️ KEEP YOUR EXISTING REGISTER CODE HERE


  } catch (error) {
    console.error('🔥 REGISTER ERROR:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);

    res.status(500).json({
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      const username = email.split('@')[0];
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ username, email, password: hashedPassword });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar } });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  const u = req.user;
  res.json({ user: { id: u._id, username: u.username, email: u.email, avatar: u.avatar } });
};
