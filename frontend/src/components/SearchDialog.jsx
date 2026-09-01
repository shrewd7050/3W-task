import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, Box, TextField, IconButton, Typography, List, ListItem,
  ListItemAvatar, ListItemText, Avatar, Divider, InputAdornment, Tabs, Tab,
  CircularProgress, Chip
} from '@mui/material';
import { Close, Search, Person, Article } from '@mui/icons-material';
import { userAPI, postAPI } from '../services/api';

export default function SearchDialog({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery('');
      setUsers([]);
      setPosts([]);
    }
  }, [open]);

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setUsers([]);
      setPosts([]);
      return;
    }
    setLoading(true);
    try {
      const [userRes, postRes] = await Promise.all([
        userAPI.search(q),
        postAPI.search(q)
      ]);
      setUsers(userRes.data);
      setPosts(postRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) doSearch(query);
      else { setUsers([]); setPosts([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleUserClick = (userId) => {
    onClose();
    navigate(`/profile/${userId}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxHeight: '80vh',
          m: 2
        }
      }}
    >
      <Box sx={{ p: 2, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            autoFocus
            placeholder="Search users, posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#999' }} />
                </InputAdornment>
              ),
              endAdornment: loading ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
              sx: {
                borderRadius: '12px',
                bgcolor: '#F5F5F5',
                '& fieldset': { border: 'none' },
                '& input': { py: '10px' }
              }
            }}
          />
          <IconButton onClick={onClose} sx={{ color: '#999' }}>
            <Close />
          </IconButton>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 36,
            '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' },
            '& .MuiTabs-indicator': { height: 3, borderRadius: 2 }
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Person sx={{ fontSize: 18 }} />
                Users
                {users.length > 0 && (
                  <Chip label={users.length} size="small" sx={{ height: 20, fontSize: '0.7rem', ml: 0.5 }} />
                )}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Article sx={{ fontSize: 18 }} />
                Posts
                {posts.length > 0 && (
                  <Chip label={posts.length} size="small" sx={{ height: 20, fontSize: '0.7rem', ml: 0.5 }} />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      <Divider />

      <Box sx={{ overflow: 'auto', maxHeight: 'calc(80vh - 140px)' }}>
        {!query.trim() ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Search sx={{ fontSize: 48, color: '#ddd', mb: 1 }} />
            <Typography color="text.secondary">
              Search for users or posts
            </Typography>
          </Box>
        ) : loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography color="text.secondary" sx={{ mt: 1 }}>Searching...</Typography>
          </Box>
        ) : tab === 0 ? (
          users.length > 0 ? (
            <List disablePadding>
              {users.map((u) => (
                <ListItem
                  key={u._id}
                  button
                  onClick={() => handleUserClick(u._id)}
                  sx={{ px: 2, py: 1.5 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#2196F3', width: 44, height: 44 }}>
                      {u.username?.[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography fontWeight={600}>{u.username}</Typography>}
                    secondary={`@${u.username} · ${u.followers?.length || 0} followers`}
                  />
                  <Chip
                    label="View"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No users found</Typography>
            </Box>
          )
        ) : posts.length > 0 ? (
          <List disablePadding>
            {posts.map((p) => (
              <ListItem
                key={p._id}
                button
                onClick={() => { onClose(); navigate('/'); }}
                sx={{ px: 2, py: 1.5 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#FF9800', width: 44, height: 44 }}>
                    {p.user?.username?.[0]?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography fontWeight={600} fontSize="0.9rem">
                        {p.user?.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {p.content}
                    </Typography>
                  }
                />
                <Chip
                  label={`${p.likes?.length || 0} likes`}
                  size="small"
                  sx={{ bgcolor: '#FFF3E0', color: '#E65100', borderRadius: 2, fontSize: '0.7rem' }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No posts found</Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
