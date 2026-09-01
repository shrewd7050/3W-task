const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { createPost, getFeed, likePost, addComment, sharePost, deletePost, searchPosts } = require('../controllers/postController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/search', auth, searchPosts);
router.post('/', auth, upload.single('media'), createPost);
router.get('/', auth, getFeed);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, addComment);
router.post('/:id/share', auth, sharePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
