import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Box, Avatar, Typography, TextField, IconButton,
  List, ListItem, ListItemAvatar, ListItemText, Divider, Badge
} from '@mui/material';
import { Send, ArrowBack, Search } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';

export default function Messages() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { if (userId) loadMessages(userId); }, [userId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await messageAPI.getConversations();
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async (uid) => {
    try {
      const res = await messageAPI.getMessages(uid);
      setMessages(res.data);
      setSelectedUser(res.data[0]?.sender._id === currentUser.id ? res.data[0]?.receiver : res.data[0]?.sender);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return;
    try {
      await messageAPI.send({ receiverId: userId, text: newMessage });
      setNewMessage('');
      loadMessages(userId);
    } catch (err) {
      console.error(err);
    }
  };

  if (!userId) {
    return (
      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a2e' }}>
            Messages
          </Typography>
        </Box>

        {conversations.length === 0 ? (
          <Paper sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '16px',
            background: '#fff'
          }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: '50%',
              bgcolor: '#E3F2FD',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 2
            }}>
              <Search sx={{ fontSize: 40, color: '#2196F3' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              No conversations yet
            </Typography>
            <Typography color="text.secondary" fontSize="0.9rem">
              Visit a user's profile to start chatting!
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ overflow: 'hidden', borderRadius: '16px' }}>
            {conversations.map((conv, idx) => (
              <Box key={conv.user._id}>
                {idx > 0 && <Divider />}
                <ListItem
                  button
                  onClick={() => navigate(`/messages/${conv.user._id}`)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#F5F7FA' }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box sx={{
                          width: 12, height: 12, borderRadius: '50%',
                          bgcolor: '#4CAF50',
                          border: '2px solid #fff'
                        }} />
                      }
                    >
                      <Avatar sx={{
                        bgcolor: '#2196F3',
                        width: 48,
                        height: 48
                      }}>
                        {conv.user.username?.[0]?.toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {conv.user.username}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontSize: '0.85rem'
                        }}
                      >
                        {conv.lastMessage.text}
                      </Typography>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </Paper>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Paper sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 120px)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)'
      }}>
        {/* Chat Header */}
        <Box sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          bgcolor: '#fff'
        }}>
          <IconButton
            onClick={() => navigate('/messages')}
            sx={{ mr: 1, color: '#666' }}
          >
            <ArrowBack />
          </IconButton>
          {selectedUser && (
            <>
              <Avatar sx={{
                mr: 1.5,
                bgcolor: '#2196F3',
                width: 40,
                height: 40
              }}>
                {selectedUser.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {selectedUser.username}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  Online
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Messages Area */}
        <Box sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: '#F5F7FA',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 2 }
        }}>
          {messages.map((msg) => {
            const isOwn = msg.sender._id === currentUser.id;
            return (
              <Box
                key={msg._id}
                sx={{
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  mb: 1.5
                }}
              >
                {!isOwn && (
                  <Avatar sx={{
                    width: 28,
                    height: 28,
                    bgcolor: '#FF9800',
                    fontSize: 12,
                    mr: 0.8,
                    mt: 0.5
                  }}>
                    {selectedUser?.username?.[0]?.toUpperCase()}
                  </Avatar>
                )}
                <Box sx={{ maxWidth: '75%' }}>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: isOwn ? '#2196F3' : '#fff',
                      color: isOwn ? '#fff' : '#333',
                      borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      boxShadow: isOwn
                        ? '0 2px 8px rgba(33,150,243,0.3)'
                        : '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: isOwn ? 'right' : 'left',
                      color: '#999',
                      mt: 0.3,
                      mx: 1,
                      fontSize: '0.7rem'
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{
          p: 1.5,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          gap: 1,
          bgcolor: '#fff',
          alignItems: 'center'
        }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            InputProps={{
              sx: {
                borderRadius: '12px',
                bgcolor: '#F5F7FA',
                '& fieldset': { border: 'none' }
              }
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!newMessage.trim()}
            sx={{
              bgcolor: newMessage.trim() ? '#2196F3' : '#E0E0E0',
              color: '#fff',
              width: 40,
              height: 40,
              '&:hover': { bgcolor: newMessage.trim() ? '#1565C0' : '#E0E0E0' },
              transition: 'all 0.2s'
            }}
          >
            <Send sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
}
