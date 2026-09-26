import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Paper, Breadcrumbs, Link } from '@mui/material';
import ProductForm from '../components/ProductForm';
import * as productService from '../services/productService';

function extractError(err) {
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (err?.message === 'Network Error') return 'Unable to reach the server.';
  return 'Something went wrong. Please try again.';
}

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productService
      .getProductById(id)
      .then((res) => setProduct(res.data.product))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (payload) => {
    await productService.updateProduct(id, payload);
    navigate(`/products/${id}`, { replace: true, state: { snackbar: 'Product updated successfully.' } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto">
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/products" underline="hover" color="text.secondary" variant="body2">
          Products
        </Link>
        <Link
          component={RouterLink}
          to={`/products/${id}`}
          underline="hover"
          color="text.secondary"
          variant="body2"
        >
          {product?.productName || 'Product'}
        </Link>
        <Typography variant="body2" color="text.primary">Edit</Typography>
      </Breadcrumbs>

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={1} sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <ProductForm
            initialValues={product}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        </Paper>
      )}
    </Box>
  );
}
