import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 50%, #E3F2FD 100%)',
      p: 2
    }}>
      <Container maxWidth="xs">
        <Paper sx={{
          p: 4,
          borderRadius: '24px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          background: '#fff'
        }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '20px',
              background: 'linear-gradient(135deg, #2196F3, #1565C0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 2, fontSize: 32
            }}>
              🪐
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e' }}>
              TaskPlanet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Trial-Task demo site
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              sx={{
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2196F3, #1565C0)',
                boxShadow: '0 4px 20px rgba(33,150,243,0.4)',
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1E88E5, #0D47A1)',
                  boxShadow: '0 6px 24px rgba(33,150,243,0.5)'
                }
              }}
            >
              Login
            </Button>
            <Typography align="center" sx={{ mt: 3, color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2196F3', fontWeight: 600, textDecoration: 'none' }}>
                Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
