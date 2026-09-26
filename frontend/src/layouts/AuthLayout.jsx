import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory2';

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f1f5f9',
        px: 2,
        py: 4,
      }}
    >
      {/* Brand */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            borderRadius: '14px',
            bgcolor: 'primary.main',
            mb: 1.5,
            boxShadow: '0 4px 14px 0 rgba(99,102,241,0.4)',
          }}
        >
          <InventoryIcon sx={{ fontSize: 26, color: '#fff' }} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Webiators
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Product Management
        </Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
