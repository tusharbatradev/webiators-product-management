import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import ProductForm from '../components/ProductForm';
import * as productService from '../services/productService';

export default function AddProductPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const res = await productService.createProduct(payload);
    navigate(`/products/${res.data.product._id}`, { replace: true, state: { snackbar: 'Product created successfully.' } });
  };

  return (
    <Box maxWidth={800} mx="auto">
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/products" underline="hover" color="text.secondary" variant="body2">
          Products
        </Link>
        <Typography variant="body2" color="text.primary">Add Product</Typography>
      </Breadcrumbs>

      <Paper elevation={1} sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
      </Paper>
    </Box>
  );
}
