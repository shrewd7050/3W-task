const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      text
    });
    await message.save();
    await message.populate('sender', 'username avatar');
    await message.populate('receiver', 'username avatar');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar')
      .sort({ createdAt: -1 });

    const conversations = {};
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user._id.toString()
        ? msg.receiver : msg.sender;
      if (!conversations[otherUser._id]) {
        conversations[otherUser._id] = { user: otherUser, lastMessage: msg };
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
