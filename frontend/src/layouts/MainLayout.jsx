import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { DesktopSidebar, MobileSidebar } from '../components/Sidebar';
import Header from '../components/Header';

const PAGE_META = {
  '/products': { title: 'Products', subtitle: 'Manage your product catalog' },
  '/products/new': { title: 'Add Product', subtitle: 'Create a new product listing' },
  '/profile': { title: 'Profile', subtitle: 'Your account information' },
};

function getPageMeta(pathname) {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  if (pathname.endsWith('/edit')) return { title: 'Edit Product', subtitle: 'Update product details' };
  if (/^\/products\/[^/]+$/.test(pathname)) return { title: 'Product Detail', subtitle: 'View product information' };
  return { title: 'Webiators PM', subtitle: '' };
}

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const { title, subtitle } = getPageMeta(location.pathname);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      {isMobile ? (
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      ) : (
        <DesktopSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
      )}

      {/* Main column — flex:1 fills the space after the sidebar spacer */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Header
          title={title}
          subtitle={subtitle}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowX: 'hidden',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 1400,
              mx: 'auto',
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 3, sm: 3.5 },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
