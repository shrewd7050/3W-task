import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Avatar, Typography, Button, Box, Tabs, Tab,
  Card, CardContent, IconButton, Chip
} from '@mui/material';
import { ArrowBack, Edit, Settings, Message } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI } from '../services/api';
import { getMediaUrl } from '../utils/media';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    loadProfile();
    loadPosts();
  }, [id]);

  const loadProfile = async () => {
    try {
      const res = await userAPI.getProfile(id);
      setProfile(res.data);
      setIsFollowing(res.data.followers.some(f => f._id === currentUser.id));
    } catch (err) {
      console.error(err);
    }
  };

  const loadPosts = async () => {
    try {
      const res = await postAPI.getFeed();
      setPosts(res.data.filter(p => p.user._id === id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async () => {
    try {
      await userAPI.follow(id);
      setIsFollowing(!isFollowing);
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return null;

  const isOwnProfile = currentUser.id === id;

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      {/* Profile Header Card */}
      <Paper sx={{
        mb: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)'
      }}>
        {/* Gradient Banner */}
        <Box sx={{
          height: 120,
          background: isOwnProfile
            ? 'linear-gradient(135deg, #2196F3 0%, #1565C0 50%, #0D47A1 100%)'
            : 'linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #E65100 100%)',
          position: 'relative'
        }}>
          {!isOwnProfile && (
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ position: 'absolute', top: 8, left: 8, color: '#fff', bgcolor: 'rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' } }}
            >
              <ArrowBack />
            </IconButton>
          )}
        </Box>

        {/* Avatar + Info */}
        <Box sx={{ px: 3, pb: 3, textAlign: 'center', mt: -5 }}>
          <Avatar sx={{
            width: 96,
            height: 96,
            mx: 'auto',
            mb: 1.5,
            bgcolor: isOwnProfile ? '#2196F3' : '#FF9800',
            fontSize: 40,
            border: '4px solid #fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
          }}>
            {profile.username?.[0]?.toUpperCase()}
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a2e' }}>
            {profile.username}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
            @{profile.username}
          </Typography>
          {profile.bio && (
            <Typography sx={{ mb: 2, color: '#555', fontSize: '0.9rem' }}>
              {profile.bio}
            </Typography>
          )}

          {/* Stats */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            mb: 2.5,
            '& .stat': {
              textAlign: 'center',
              px: 2,
              py: 1,
              borderRadius: 3,
              bgcolor: '#F5F7FA'
            }
          }}>
            <Box className="stat">
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2196F3' }}>
                {profile.followers.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Followers
              </Typography>
            </Box>
            <Box className="stat">
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FF9800' }}>
                {profile.following.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Following
              </Typography>
            </Box>
            <Box className="stat">
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#4CAF50' }}>
                {posts.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Posts
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          {isOwnProfile ? (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                sx={{
                  borderColor: '#2196F3',
                  color: '#2196F3',
                  borderRadius: '12px',
                  px: 3,
                  '&:hover': { borderColor: '#1565C0', bgcolor: '#E3F2FD' }
                }}
              >
                Edit Profile
              </Button>
              <IconButton sx={{ border: '1px solid #E0E0E0', borderRadius: '12px' }}>
                <Settings sx={{ color: '#666' }} />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                onClick={handleFollow}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  fontWeight: 700,
                  ...(isFollowing ? {
                    borderColor: '#F44336',
                    color: '#F44336',
                    '&:hover': { borderColor: '#D32F2F', bgcolor: '#FFEBEE' }
                  } : {
                    background: 'linear-gradient(135deg, #2196F3, #1565C0)',
                    boxShadow: '0 4px 14px rgba(33,150,243,0.35)',
                    '&:hover': { background: 'linear-gradient(135deg, #1E88E5, #0D47A1)' }
                  })
                }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Message />}
                onClick={() => navigate(`/messages/${id}`)}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  borderColor: '#E0E0E0',
                  color: '#666',
                  '&:hover': { borderColor: '#2196F3', color: '#2196F3', bgcolor: '#E3F2FD' }
                }}
              >
                Message
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2, borderRadius: '16px', overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              minHeight: 48
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 2,
              bgcolor: '#2196F3'
            }
          }}
        >
          <Tab label={`Posts (${posts.length})`} />
          <Tab label={`Following (${profile.following.length})`} />
          <Tab label={`Followers (${profile.followers.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tab === 0 && posts.map((post) => (
        <Card key={post._id} sx={{
          mb: 2,
          transition: 'all 0.2s',
          '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
        }}>
          <CardContent>
            <Typography sx={{ lineHeight: 1.6 }}>{post.content}</Typography>
            {post.media && (
              <Box sx={{ borderRadius: '4px', overflow: 'hidden', mt: 1.5 }}>
                {post.mediaType === 'video' ? (
                  <video src={getMediaUrl(post.media)} controls style={{ width: '100%', maxHeight: 400, display: 'block' }} />
                ) : (
                  <img src={getMediaUrl(post.media)} alt="Post" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
                )}
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
              <Chip
                label={`${post.likes.length} likes`}
                size="small"
                sx={{ bgcolor: '#FFEBEE', color: '#C62828', fontWeight: 600, borderRadius: 2 }}
              />
              <Chip
                label={`${post.comments.length} comments`}
                size="small"
                sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 600, borderRadius: 2 }}
              />
              <Chip
                label={`${post.shares} shares`}
                size="small"
                sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600, borderRadius: 2 }}
              />
            </Box>
          </CardContent>
        </Card>
      ))}

      {tab === 1 && profile.following.map((u) => (
        <Paper
          key={u._id}
          sx={{
            p: 2,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transform: 'translateY(-1px)' }
          }}
          onClick={() => navigate(`/profile/${u._id}`)}
        >
          <Avatar sx={{
            mr: 2,
            bgcolor: '#FF9800',
            width: 44,
            height: 44,
            border: '2px solid #FFE0B2'
          }}>
            {u.username?.[0]?.toUpperCase()}
          </Avatar>
          <Typography sx={{ fontWeight: 600 }}>{u.username}</Typography>
        </Paper>
      ))}

      {tab === 2 && profile.followers.map((u) => (
        <Paper
          key={u._id}
          sx={{
            p: 2,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transform: 'translateY(-1px)' }
          }}
          onClick={() => navigate(`/profile/${u._id}`)}
        >
          <Avatar sx={{
            mr: 2,
            bgcolor: '#2196F3',
            width: 44,
            height: 44,
            border: '2px solid #E3F2FD'
          }}>
            {u.username?.[0]?.toUpperCase()}
          </Avatar>
          <Typography sx={{ fontWeight: 600 }}>{u.username}</Typography>
        </Paper>
      ))}
    </Container>
  );
}
