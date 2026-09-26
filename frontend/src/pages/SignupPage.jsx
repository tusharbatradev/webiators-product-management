import { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button,
  Alert, CircularProgress, Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function extractError(err) {
  const data = err?.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(' ');
  if (data?.message) return data.message;
  if (err?.message === 'Network Error') return 'Unable to reach the server. Check your connection.';
  return 'Something went wrong. Please try again.';
}

export default function SignupPage() {
  const { signup } = useAuth();

  const [form, setForm] = useState({ username: '', password: '' });
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
      await signup(form);
      // AuthContext.signup navigates to /login on success
    } catch (err) {
      setError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 400, mx: 'auto' }}
    >
      <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
        Create account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} role="alert">
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
          margin="normal"
          inputProps={{ 'aria-label': 'Username' }}
        />
        <TextField
          label="Password"
          name="password"
          id="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          autoComplete="new-password"
          margin="normal"
          inputProps={{ 'aria-label': 'Password' }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={submitting}
          sx={{ mt: 2, py: 1.2 }}
        >
          {submitting ? <CircularProgress size={22} color="inherit" /> : 'Create account'}
        </Button>
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">
          Log in
        </Link>
      </Typography>
    </Paper>
  );
}
