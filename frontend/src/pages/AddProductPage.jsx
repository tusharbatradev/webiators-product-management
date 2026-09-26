import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductForm from '../components/ProductForm';
import * as productService from '../services/productService';

export default function AddProductPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const res = await productService.createProduct(payload);
    navigate(`/products/${res.data.product._id}`, { replace: true });
  };

  return (
    <Box maxWidth={720} mx="auto">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/products')}
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>
      <Typography variant="h5" component="h1" fontWeight={600} gutterBottom>
        Add Product
      </Typography>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
    </Box>
  );
}
