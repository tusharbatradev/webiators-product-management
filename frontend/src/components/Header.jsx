import {
  Box, Typography, Avatar, IconButton, Tooltip,
  useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, subtitle, onMobileMenuOpen }) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box
      component="header"
      sx={{
        height: 72,
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2.5, sm: 3, md: 4 },
        gap: { xs: 1.5, sm: 2 },
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        flexShrink: 0,
        width: '100%',
      }}
    >
      {/* Mobile hamburger — only on mobile */}
      {isMobile && (
        <IconButton
          onClick={onMobileMenuOpen}
          size="small"
          aria-label="Open navigation menu"
          sx={{
            color: 'text.secondary',
            flexShrink: 0,
            '&:hover': { bgcolor: '#f1f5f9' },
          }}
        >
          <MenuIcon sx={{ fontSize: 22 }} />
        </IconButton>
      )}

      {/* Page title — takes all remaining space */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          component="h1"
          fontWeight={700}
          noWrap
          sx={{
            lineHeight: 1.25,
            fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.25rem' },
            color: 'text.primary',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            noWrap
            display="block"
            sx={{
              lineHeight: 1.4,
              color: 'text.secondary',
              fontSize: '0.8rem',
              mt: 0.1,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Avatar — pinned to far right */}
      <Tooltip
        title={`${user?.username || 'Profile'} — view profile`}
        arrow
        placement="bottom-end"
      >
        <IconButton
          onClick={() => navigate('/profile')}
          aria-label="Go to profile"
          sx={{ p: 0, flexShrink: 0 }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'box-shadow 0.15s ease, opacity 0.15s ease',
              '&:hover': {
                opacity: 0.9,
                boxShadow: '0 0 0 3px rgba(99,102,241,0.2)',
              },
            }}
          >
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </Avatar>
        </IconButton>
      </Tooltip>
    </Box>
  );
}
