import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Box, Avatar, IconButton,
  Card, CardContent, CardActions, Typography, Divider, Alert, Chip
} from '@mui/material';
import {
  Favorite, FavoriteBorder, Comment, Share, PhotoCamera,
  Videocam, Delete, Send, TrendingUp, Whatshot, ThumbUp, ChatBubbleOutline
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';

const FILTER_OPTIONS = ['All Post', 'For You', 'Most Liked', 'Most Commented'];

export default function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState(0);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try {
      const res = await postAPI.getFeed();
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load posts');
    }
  };

  const getFilteredPosts = () => {
    const sorted = [...posts];
    switch (activeFilter) {
      case 1:
        return sorted.slice(0, Math.ceil(sorted.length / 2));
      case 2:
        return sorted.sort((a, b) => b.likes.length - a.likes.length);
      case 3:
        return sorted.sort((a, b) => b.comments.length - a.comments.length);
      default:
        return sorted;
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content && !media) return;
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (media) formData.append('media', media);
      await postAPI.create(formData);
      setContent('');
      setMedia(null);
      setMediaPreview('');
      setShowCreatePost(false);
      loadPosts();
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      await postAPI.like(postId);
      loadPosts();
    } catch (err) {
      setError('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]) return;
    try {
      await postAPI.comment(postId, commentText[postId]);
      setCommentText({ ...commentText, [postId]: '' });
      loadPosts();
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleShare = async (postId) => {
    try {
      await postAPI.share(postId);
      loadPosts();
    } catch (err) {
      setError('Failed to share post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await postAPI.delete(postId);
      loadPosts();
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Create Post Card */}
      <Paper
        sx={{
          p: 2.5,
          mb: 2,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
        }}
        onClick={() => setShowCreatePost(!showCreatePost)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: showCreatePost ? 2 : 0 }}>
          <Avatar sx={{
            bgcolor: '#2196F3',
            width: 42,
            height: 42,
            border: '2px solid #E3F2FD'
          }}>
            {user.username?.[0]?.toUpperCase()}
          </Avatar>
          <TextField
            fullWidth
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
            onClick={(e) => { e.stopPropagation(); setShowCreatePost(true); }}
            InputProps={{
              readOnly: !showCreatePost,
              sx: {
                borderRadius: '12px',
                bgcolor: '#F5F7FA',
                '& fieldset': { border: 'none' },
                '&:hover': { bgcolor: '#EEF1F5' }
              }
            }}
          />
        </Box>

        {showCreatePost && (
          <>
            {mediaPreview && (
              <Box sx={{ mb: 2, borderRadius: '4px', overflow: 'hidden' }}>
                {media?.type?.startsWith('video') ? (
                  <video src={mediaPreview} controls style={{ width: '100%', maxHeight: 300, display: 'block' }} />
                ) : (
                  <img src={mediaPreview} alt="Preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }} />
                )}
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <input type="file" accept="image/*,video/*" hidden id="media-input" onChange={handleMediaChange} />
                <label htmlFor="media-input">
                  <IconButton component="span" sx={{ color: '#2196F3', bgcolor: '#E3F2FD', mr: 1, '&:hover': { bgcolor: '#BBDEFB' } }}>
                    <PhotoCamera />
                  </IconButton>
                </label>
                <input type="file" accept="video/*" hidden id="video-input" onChange={handleMediaChange} />
                <label htmlFor="video-input">
                  <IconButton component="span" sx={{ color: '#FF9800', bgcolor: '#FFF3E0', '&:hover': { bgcolor: '#FFE0B2' } }}>
                    <Videocam />
                  </IconButton>
                </label>
              </Box>
              <Button
                variant="contained"
                endIcon={<Send />}
                onClick={(e) => { e.stopPropagation(); handleCreatePost(e); }}
                disabled={!content && !media}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  background: 'linear-gradient(135deg, #2196F3, #1565C0)',
                  boxShadow: '0 4px 14px rgba(33,150,243,0.35)',
                  '&:hover': { background: 'linear-gradient(135deg, #1E88E5, #0D47A1)' }
                }}
              >
                Post
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2.5, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}>
        {FILTER_OPTIONS.map((label, idx) => (
          <Chip
            key={label}
            label={label}
            onClick={() => setActiveFilter(idx)}
            color={activeFilter === idx ? 'primary' : 'default'}
            variant={activeFilter === idx ? 'filled' : 'outlined'}
            icon={idx === 1 ? <TrendingUp sx={{ fontSize: 16 }} /> : idx === 2 ? <Whatshot sx={{ fontSize: 16 }} /> : idx === 3 ? <ChatBubbleOutline sx={{ fontSize: 16 }} /> : undefined}
            sx={{
              px: 1,
              whiteSpace: 'nowrap',
              fontWeight: 600,
              borderColor: activeFilter === idx ? 'transparent' : '#E0E0E0',
              bgcolor: activeFilter === idx ? '#2196F3' : '#fff',
              '&:hover': { bgcolor: activeFilter === idx ? '#1E88E5' : '#F5F5F5' }
            }}
          />
        ))}
      </Box>

      {/* Posts */}
      {getFilteredPosts().map((post) => (
        <Card key={post._id} sx={{
          mb: 2,
          transition: 'all 0.2s',
          '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
        }}>
          <CardContent sx={{ pb: 1 }}>
            {/* Post Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Avatar
                sx={{
                  mr: 1.5,
                  cursor: 'pointer',
                  bgcolor: '#2196F3',
                  width: 42,
                  height: 42,
                  border: '2px solid #E3F2FD'
                }}
                onClick={() => navigate(`/profile/${post.user._id}`)}
              >
                {post.user.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ cursor: 'pointer', fontWeight: 700, '&:hover': { color: '#2196F3' } }}
                    onClick={() => navigate(`/profile/${post.user._id}`)}
                  >
                    {post.user.username}
                  </Typography>
                  {post.user._id !== user.id && (
                    <Chip
                      label="Follow"
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: '#2196F3',
                        color: '#fff',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#1E88E5' }
                      }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.user._id}`); }}
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Box>
              {post.user._id === user.id && (
                <IconButton
                  size="small"
                  onClick={() => handleDelete(post._id)}
                  sx={{ color: '#ccc', '&:hover': { color: '#F44336', bgcolor: '#FFEBEE' } }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Post Content */}
            {post.content && (
              <Typography sx={{ mb: 1.5, lineHeight: 1.6, color: '#333' }}>
                {post.content}
              </Typography>
            )}

            {/* Post Media */}
            {post.media && (
              <Box sx={{ borderRadius: '4px', overflow: 'hidden', mb: 1 }}>
                {post.mediaType === 'video' ? (
                  <video src={post.media} controls style={{ width: '100%', maxHeight: 400, display: 'block' }} />
                ) : (
                  <img src={post.media} alt="Post" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
                )}
              </Box>
            )}
          </CardContent>

          {/* Action Bar */}
          <CardActions sx={{ px: 2, pb: 1, pt: 0, gap: 0.5 }}>
            <IconButton
              onClick={() => handleLike(post._id)}
              sx={{
                color: post.likes.includes(user.id) ? '#F44336' : '#999',
                '&:hover': { bgcolor: '#FFEBEE' }
              }}
            >
              {post.likes.includes(user.id) ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1.5, fontWeight: 600 }}>
              {post.likes.length}
            </Typography>
            <IconButton sx={{ color: '#999', '&:hover': { bgcolor: '#E3F2FD' } }}>
              <Comment />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1.5, fontWeight: 600 }}>
              {post.comments.length}
            </Typography>
            <IconButton
              onClick={() => handleShare(post._id)}
              sx={{ color: '#999', '&:hover': { bgcolor: '#E8F5E9' } }}
            >
              <Share />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {post.shares}
            </Typography>
          </CardActions>

          <Divider sx={{ mx: 2 }} />

          {/* Comments */}
          <Box sx={{ px: 2, py: 1.5 }}>
            {post.comments.map((comment, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Avatar sx={{
                  width: 28,
                  height: 28,
                  bgcolor: '#FF9800',
                  fontSize: 12,
                  border: '1px solid #FFE0B2'
                }}>
                  {comment.user.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ bgcolor: '#F5F7FA', borderRadius: 2, px: 1.5, py: 0.8, flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                    {comment.user.username}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    {comment.text}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText[post._id] || ''}
                onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                InputProps={{
                  sx: {
                    borderRadius: '10px',
                    bgcolor: '#F5F7FA',
                    fontSize: '0.85rem',
                    '& fieldset': { border: 'none' }
                  }
                }}
              />
              <Button
                size="small"
                onClick={() => handleComment(post._id)}
                sx={{
                  minWidth: 0,
                  px: 2,
                  color: '#2196F3',
                  fontWeight: 700
                }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Card>
      ))}
    </Container>
  );
}
