import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: { main: '#2196F3', light: '#64B5F6', dark: '#1565C0' },
    secondary: { main: '#FF9800', light: '#FFB74D', dark: '#F57C00' },
    background: { default: '#F0F2F5', paper: '#FFFFFF' },
    success: { main: '#4CAF50' },
    error: { main: '#F44336' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 }
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
        elevation1: { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: 'none', fontWeight: 600 },
        contained: { boxShadow: '0 4px 14px rgba(33,150,243,0.35)' }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 20, fontWeight: 600 },
        filled: { '&.MuiChip-colorPrimary': { color: '#fff' } }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 }
      }
    }
  }
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" /> : children;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Feed />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:userId" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
