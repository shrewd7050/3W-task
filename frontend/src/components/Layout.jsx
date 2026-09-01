import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, Box,
  BottomNavigation, BottomNavigationAction, Paper, TextField,
  InputAdornment, List, ListItem, ListItemAvatar, ListItemText,
  Divider, Chip, CircularProgress, ClickAwayListener, Fade
} from '@mui/material';
import { Home, Message, Person, Logout, Search, Close } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI } from '../services/api';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchPosts, setSearchPosts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const getNavValue = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/messages')) return 1;
    if (location.pathname.startsWith('/profile')) return 2;
    return 0;
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchUsers([]);
      setSearchPosts([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const [uRes, pRes] = await Promise.all([
          userAPI.search(searchQuery),
          postAPI.search(searchQuery)
        ]);
        setSearchUsers(uRes.data);
        setSearchPosts(pRes.data);
      } catch (err) {
        console.error(err);
      }
      setSearchLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSelect = () => {
    setSearchQuery('');
    setSearchFocused(false);
    setSearchUsers([]);
    setSearchPosts([]);
  };

  return (
    <ClickAwayListener onClickAway={() => setSearchFocused(false)}>
      <Box sx={{ pb: 8 }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: '#fff',
            color: '#1a1a2e',
            borderBottom: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <Toolbar sx={{ py: 0.5, gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #2196F3, #1565C0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                minWidth: 'fit-content'
              }}
            >
              TaskPlanet
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users, posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#999', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    {searchLoading ? (
                      <CircularProgress size={18} />
                    ) : (
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <Close sx={{ fontSize: 18, color: '#999' }} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ) : null,
                sx: {
                  borderRadius: '12px',
                  bgcolor: '#F5F7FA',
                  '& fieldset': { border: 'none' },
                  fontSize: '0.85rem'
                }
              }}
            />
            <IconButton onClick={() => navigate(`/profile/${user.id}`)}>
              <Avatar sx={{
                bgcolor: '#2196F3',
                width: 34,
                height: 34,
                border: '2px solid #E3F2FD',
                fontSize: 13
              }}>
                {user.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <IconButton color="inherit" onClick={logout} sx={{ ml: -0.5 }}>
              <Logout sx={{ color: '#999', fontSize: 22 }} />
            </IconButton>
          </Toolbar>

          {/* Search Results Dropdown */}
          {searchFocused && searchQuery.trim() && (
            <Fade in>
              <Paper
                elevation={4}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '60vh',
                  overflow: 'auto',
                  zIndex: 1300,
                  borderTop: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                {searchLoading && !searchUsers.length && !searchPosts.length ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Searching...
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {/* Users Section */}
                    {searchUsers.length > 0 && (
                      <>
                        <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            Users
                          </Typography>
                          <Chip label={searchUsers.length} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                        </Box>
                        {searchUsers.map((u) => (
                          <ListItem
                            key={u._id}
                            button
                            onClick={() => { navigate(`/profile/${u._id}`); handleSearchSelect(); }}
                            sx={{ py: 1 }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: '#2196F3', width: 38, height: 38, fontSize: 15 }}>
                                {u.username?.[0]?.toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={<Typography fontWeight={600} fontSize="0.9rem">{u.username}</Typography>}
                              secondary={`@${u.username} · ${u.followers?.length || 0} followers`}
                            />
                          </ListItem>
                        ))}
                        <Divider />
                      </>
                    )}

                    {/* Posts Section */}
                    {searchPosts.length > 0 && (
                      <>
                        <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            Posts
                          </Typography>
                          <Chip label={searchPosts.length} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                        </Box>
                        {searchPosts.map((p) => (
                          <ListItem
                            key={p._id}
                            button
                            onClick={() => { navigate('/'); handleSearchSelect(); }}
                            sx={{ py: 1 }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: '#FF9800', width: 38, height: 38, fontSize: 15 }}>
                                {p.user?.username?.[0]?.toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography fontWeight={600} fontSize="0.85rem">{p.user?.username}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(p.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary" fontSize="0.8rem" sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {p.content}
                                </Typography>
                              }
                            />
                            <Chip
                              label={`${p.likes?.length || 0} likes`}
                              size="small"
                              sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontSize: '0.65rem', height: 20 }}
                            />
                          </ListItem>
                        ))}
                      </>
                    )}

                    {/* No Results */}
                    {!searchLoading && searchUsers.length === 0 && searchPosts.length === 0 && (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Search sx={{ fontSize: 36, color: '#ddd', mb: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          No record found
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Paper>
            </Fade>
          )}
        </AppBar>

        <Box sx={{ mt: 8 }}>
          <Outlet />
        </Box>

        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: '20px 20px 0 0',
            overflow: 'hidden',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.08)'
          }}
          elevation={0}
        >
          <BottomNavigation
            value={getNavValue()}
            sx={{
              background: 'linear-gradient(135deg, #2196F3, #1565C0)',
              height: 60,
              '& .MuiBottomNavigationAction-root': {
                color: 'rgba(255,255,255,0.55)',
                minWidth: 0,
                py: 1,
                '&.Mui-selected': { color: '#fff' }
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.68rem',
                mt: 0.3,
                fontWeight: 600,
                '&.Mui-selected': { fontSize: '0.72rem' }
              }
            }}
            onChange={(_, newValue) => {
              if (newValue === 0) navigate('/');
              if (newValue === 1) navigate('/messages');
              if (newValue === 2) navigate(`/profile/${user.id}`);
            }}
          >
            <BottomNavigationAction label="Home" icon={<Home />} />
            <BottomNavigationAction label="Messages" icon={<Message />} />
            <BottomNavigationAction label="Profile" icon={<Person />} />
          </BottomNavigation>
        </Paper>
      </Box>
    </ClickAwayListener>
  );
}
