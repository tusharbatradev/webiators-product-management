import { Box, Paper, Typography, Avatar, Divider, Chip, Stack } from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useAuth } from '../context/AuthContext';

function InfoRow({ icon, label, value }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: 'rgba(99,102,241,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.3}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Box maxWidth={520}>
      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        {/* Header band */}
        <Box
          sx={{
            height: 80,
            bgcolor: 'primary.main',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          }}
        />

        {/* Avatar + name */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Box sx={{ mt: -4, mb: 2 }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: '#fff',
                color: 'primary.main',
                fontSize: '1.75rem',
                fontWeight: 700,
                border: '3px solid #fff',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            >
              {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </Box>

          <Typography variant="h6" fontWeight={700}>
            {user?.name || user?.username || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            @{user?.username}
          </Typography>
          <Stack direction="row" spacing={1} mt={0.5}>
            <Chip
              label="Administrator"
              size="small"
              color="primary"
              sx={{ height: 22, fontSize: '0.7rem', color: '#fff' }}
            />
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          <Typography variant="subtitle2" fontWeight={700} gutterBottom color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            Account Details
          </Typography>

          <InfoRow
            icon={<PersonOutlinedIcon fontSize="small" />}
            label="Full Name"
            value={user?.name || '—'}
          />
          <InfoRow
            icon={<PersonOutlinedIcon fontSize="small" />}
            label="Username"
            value={user?.username || '—'}
          />
          <InfoRow
            icon={<ShieldOutlinedIcon fontSize="small" />}
            label="Role"
            value="Administrator"
          />
          <InfoRow
            icon={<CalendarTodayOutlinedIcon fontSize="small" />}
            label="Session"
            value="Active"
          />
        </Box>
      </Paper>
    </Box>
  );
}
