import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    navigate(`/products/${id}`, { replace: true });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={720} mx="auto">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/products/${id}`)}
        sx={{ mb: 2 }}
      >
        Back to Product
      </Button>
      <Typography variant="h5" component="h1" fontWeight={600} gutterBottom>
        Edit Product
      </Typography>

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <ProductForm
          initialValues={product}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      )}
    </Box>
  );
}
