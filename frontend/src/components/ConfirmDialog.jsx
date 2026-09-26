import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Box, CircularProgress, Stack,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'rgba(239,68,68,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <WarningAmberIcon sx={{ color: 'error.main', fontSize: 18 }} />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
        <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
          <Button
            onClick={onCancel}
            disabled={loading}
            variant="outlined"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            color="error"
            variant="contained"
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
