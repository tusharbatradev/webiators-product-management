import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f1f5f9"
      px={2}
    >
      <Paper
        elevation={1}
        sx={{
          p: { xs: 4, sm: 6 },
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: 'rgba(99,102,241,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5,
          }}
        >
          <SearchOffIcon sx={{ fontSize: 36, color: 'primary.main' }} />
        </Box>
        <Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/products')}>
          Go to Products
        </Button>
      </Paper>
    </Box>
  );
}
