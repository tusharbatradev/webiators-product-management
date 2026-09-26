import { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button,
  Alert, CircularProgress, Link, InputAdornment, IconButton, Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useAuth } from '../context/AuthContext';

function extractError(err) {
  const data = err?.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(' ');
  if (data?.message) return data.message;
  if (err?.message === 'Network Error') return 'Unable to reach the server. Check your connection.';
  return 'Something went wrong. Please try again.';
}

export default function LoginPage() {
  const { login } = useAuth();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Username and password are required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login(form);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 0.5 }}>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sign in to your account to continue
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }} role="alert">
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Username"
          name="username"
          id="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="username"
          autoFocus
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                </InputAdornment>
              ),
            },
            htmlInput: { 'aria-label': 'Username' },
          }}
        />
        <TextField
          label="Password"
          name="password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="current-password"
          sx={{ mb: 2.5 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    size="small"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword
                      ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                      : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            },
            htmlInput: { 'aria-label': 'Password' },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={submitting}
          sx={{ py: 1.2, fontSize: '0.9rem' }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
        </Button>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      <Typography variant="body2" align="center" color="text.secondary">
        Don&apos;t have an account?{' '}
        <Link component={RouterLink} to="/signup" fontWeight={600} underline="hover">
          Create one
        </Link>
      </Typography>
    </Paper>
  );
}
