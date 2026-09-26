import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5', contrastText: '#fff' },
    secondary: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706', contrastText: '#fff' },
    success: { main: '#10b981', light: '#34d399', dark: '#059669' },
    error: { main: '#ef4444', light: '#fca5a5', dark: '#dc2626' },
    warning: { main: '#f59e0b' },
    background: { default: '#F5F7FB', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b', disabled: '#94a3b8' },
    divider: '#e2e8f0',
    grey: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0',
      300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b',
      600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h5: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h6: { fontWeight: 600, lineHeight: 1.4 },
    subtitle1: { fontWeight: 600, lineHeight: 1.5 },
    subtitle2: { fontWeight: 600, lineHeight: 1.5 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    caption: { lineHeight: 1.5 },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
    '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
    '0 20px 25px -5px rgb(0 0 0 / 0.07), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
    '0 25px 50px -12px rgb(0 0 0 / 0.15)',
    ...Array(18).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': { boxSizing: 'border-box' },
        html: { scrollBehavior: 'smooth' },
        body: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        '::-webkit-scrollbar': { width: 5, height: 5 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: 3 },
        '::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingTop: 8,
          paddingBottom: 8,
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          '&:hover': { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
        },
        outlined: {
          borderColor: '#e2e8f0',
          '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99,102,241,0.04)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          backgroundImage: 'none',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 12 },
        elevation1: { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)', border: '1px solid #e2e8f0' },
        elevation2: { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)', border: '1px solid #e2e8f0' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            fontSize: '0.875rem',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#6366f1' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: 1.5 },
          },
          '& .MuiInputLabel-root': { fontSize: '0.875rem' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6, fontSize: '0.75rem' },
        colorPrimary: { backgroundColor: 'rgba(99,102,241,0.1)', color: '#4f46e5' },
        filledPrimary: { backgroundColor: '#6366f1', color: '#fff' },
        colorSuccess: { bgcolor: 'rgba(16,185,129,0.1)', color: '#059669' },
        colorError: { bgcolor: 'rgba(239,68,68,0.1)', color: '#dc2626' },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 8, fontSize: '0.875rem' } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 16, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.2)' } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#e2e8f0' } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
          '&.Mui-selected': {
            backgroundColor: 'rgba(99,102,241,0.1)',
            color: '#4f46e5',
            '&:hover': { backgroundColor: 'rgba(99,102,241,0.15)' },
            '& .MuiListItemIcon-root': { color: '#4f46e5' },
          },
          '&:hover': { backgroundColor: 'rgba(99,102,241,0.06)' },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 36 } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 6, fontSize: '0.75rem', backgroundColor: '#1e293b' },
        arrow: { color: '#1e293b' },
      },
    },
    MuiSkeleton: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiBreadcrumbs: {
      styleOverrides: { root: { fontSize: '0.8125rem' } },
    },
  },
});

export default theme;
