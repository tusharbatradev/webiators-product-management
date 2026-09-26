import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
      <Typography variant="h3" component="h1">404</Typography>
      <Typography variant="body1" color="text.secondary">Page not found</Typography>
      <Button variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
    </Box>
  );
}
