import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Drawer, List, ListItemButton, ListItemText, Divider, Avatar,
  useMediaQuery, useTheme,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory2';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
  };

  const drawerContent = (
    <Box sx={{ width: 240 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <InventoryIcon sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle1" fontWeight={700}>Webiators</Typography>
      </Box>
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            <ListItemButton
              onClick={() => { navigate('/products'); setDrawerOpen(false); }}
            >
              <ListItemText primary="Products" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton onClick={() => { navigate('/login'); setDrawerOpen(false); }}>
              <ListItemText primary="Login" />
            </ListItemButton>
            <ListItemButton onClick={() => { navigate('/signup'); setDrawerOpen(false); }}>
              <ListItemText primary="Sign Up" />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ gap: 1 }}>
        {/* Logo */}
        <Box
          component={RouterLink}
          to={isAuthenticated ? '/products' : '/login'}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            textDecoration: 'none', color: 'inherit', flexGrow: 1,
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              p: 0.5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <InventoryIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Webiators PM
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            WPM
          </Typography>
        </Box>

        {/* Desktop nav */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/products"
                  sx={{ borderRadius: 2, px: 2 }}
                >
                  Products
                </Button>
                <Button
                  color="inherit"
                  onClick={logout}
                  startIcon={<LogoutIcon fontSize="small" />}
                  sx={{
                    borderRadius: 2, px: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login" sx={{ borderRadius: 2 }}>
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    boxShadow: 'none',
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}
