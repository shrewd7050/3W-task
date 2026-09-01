const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, followUser, searchUsers } = require('../controllers/userController');

router.get('/search', auth, searchUsers);
router.get('/:id', auth, getProfile);
router.post('/:id/follow', auth, followUser);

module.exports = router;
