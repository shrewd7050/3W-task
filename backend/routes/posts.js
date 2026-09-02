const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const { createPost, getFeed, likePost, addComment, sharePost, deletePost, searchPosts } = require('../controllers/postController');

router.get('/search', auth, searchPosts);
router.post('/', auth, upload.single('media'), createPost);
router.get('/', auth, getFeed);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, addComment);
router.post('/:id/share', auth, sharePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
