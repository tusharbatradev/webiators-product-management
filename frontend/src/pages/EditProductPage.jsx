import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function EditProductPage() {
  const { id } = useParams();
  return (
    <Box p={4}>
      <Typography variant="h4" component="h1">Edit Product</Typography>
      <Typography variant="body2" color="text.secondary">ID: {id}</Typography>
    </Box>
  );
}
