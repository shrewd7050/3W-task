const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendMessage, getConversations, getMessages } = require('../controllers/messageController');

router.post('/', auth, sendMessage);
router.get('/conversations', auth, getConversations);
router.get('/:userId', auth, getMessages);

module.exports = router;
