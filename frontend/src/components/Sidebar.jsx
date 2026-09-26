import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Divider, Tooltip, IconButton,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory2';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../context/AuthContext';

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

const NAV_ITEMS = [
  { label: 'Products', icon: <Inventory2OutlinedIcon sx={{ fontSize: 20 }} />, path: '/products' },
  { label: 'Profile', icon: <PersonOutlinedIcon sx={{ fontSize: 20 }} />, path: '/profile' },
];

function SidebarContent({ collapsed, onToggleCollapse, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
  };

  const isActive = (path) =>
    path === '/products'
      ? location.pathname.startsWith('/products')
      : location.pathname === path;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* ── Logo + collapse button ── */}
      <Box
        sx={{
          height: 72,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0,
        }}
      >
        {/* Logo mark + text — hidden when collapsed */}
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, overflow: 'hidden' }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
              }}
            >
              <InventoryIcon sx={{ fontSize: 19, color: '#fff' }} />
            </Box>
            <Box sx={{ overflow: 'hidden', minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                noWrap
                sx={{ lineHeight: 1.25, color: 'text.primary', fontSize: '0.9rem' }}
              >
                Webiators
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ lineHeight: 1.25, color: 'text.secondary', fontSize: '0.72rem' }}
              >
                Product Mgmt
              </Typography>
            </Box>
          </Box>
        )}

        {/* Collapse / expand button — ALWAYS inside sidebar */}
        {onToggleCollapse && (
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right" arrow>
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              sx={{
                flexShrink: 0,
                width: 28,
                height: 28,
                color: 'text.secondary',
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '7px',
                '&:hover': { bgcolor: '#f1f5f9', color: 'primary.main' },
              }}
            >
              {collapsed
                ? <ChevronRightIcon sx={{ fontSize: 16 }} />
                : <ChevronLeftIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* ── Navigation ── */}
      <Box
        sx={{
          flex: 1,
          px: 1.5,
          py: 2,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{
              px: 1,
              mb: 1,
              display: 'block',
              color: 'text.disabled',
              fontWeight: 600,
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Menu
          </Typography>
        )}
        <List disablePadding>
          {NAV_ITEMS.map((item) => (
            <Tooltip
              key={item.path}
              title={collapsed ? item.label : ''}
              placement="right"
              arrow
            >
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => handleNav(item.path)}
                sx={{
                  px: collapsed ? 0 : 1.25,
                  py: 0.875,
                  mb: 0.5,
                  borderRadius: '9px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  minHeight: 42,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 'auto' : 34,
                    color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive(item.path) ? 600 : 500,
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* ── Bottom: user card + logout ── */}
      <Box
        sx={{
          borderTop: '1px solid #e2e8f0',
          px: 1.5,
          py: 1.5,
          flexShrink: 0,
        }}
      >
        {/* User info row */}
        {!collapsed ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.25,
              py: 1,
              mb: 0.75,
              borderRadius: '9px',
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.8rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                noWrap
                display="block"
                sx={{ lineHeight: 1.3, color: 'text.primary', fontSize: '0.8rem' }}
              >
                {user?.username || 'User'}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                display="block"
                sx={{ lineHeight: 1.3, color: 'text.secondary', fontSize: '0.7rem' }}
              >
                Administrator
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.75 }}>
            <Tooltip title={user?.username || 'User'} placement="right" arrow>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </Tooltip>
          </Box>
        )}

        {/* Logout */}
        <Tooltip title={collapsed ? 'Logout' : ''} placement="right" arrow>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              px: collapsed ? 0 : 1.25,
              py: 0.875,
              borderRadius: '9px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              minHeight: 42,
              color: 'error.main',
              '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 'auto' : 34,
                color: 'error.main',
                justifyContent: 'center',
              }}
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'error.main',
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

/* ── Desktop persistent sidebar ── */
export function DesktopSidebar({ collapsed, onToggleCollapse }) {
  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        width,
        flexShrink: 0,
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <Box
        sx={{
          width,
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          zIndex: 1200,
          overflow: 'hidden',
        }}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      </Box>
    </Box>
  );
}

/* ── Mobile drawer sidebar ── */
export function MobileSidebar({ open, onClose }) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: SIDEBAR_WIDTH,
          border: 'none',
          boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
        },
      }}
    >
      <SidebarContent onClose={onClose} />
    </Drawer>
  );
}
