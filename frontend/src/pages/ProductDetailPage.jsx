import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Button, CircularProgress, Alert,
  Chip, Stack, Divider, Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import * as productService from '../services/productService';

function extractError(err) {
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (err?.message === 'Network Error') return 'Unable to reach the server.';
  return 'Something went wrong. Please try again.';
}

export default function ProductDetailPage() {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth={720} mx="auto">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} sx={{ mb: 2 }}>
          Back to Products
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth={720} mx="auto">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')}>
          Back to Products
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/products/${id}/edit`)}
        >
          Edit
        </Button>
      </Stack>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" component="h1" fontWeight={600} gutterBottom>
          {product.productName}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Meta Title: {product.metaTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Slug: /{product.productSlug}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" my={2}>
          {product.discountedPrice ? (
            <>
              <Chip label={`₹${product.discountedPrice}`} color="primary" />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ₹{product.price}
              </Typography>
            </>
          ) : (
            <Chip label={`₹${product.price}`} color="primary" />
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {product.description}
        </Typography>

        {product.galleryImages?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Gallery Images
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2} mt={1}>
              {product.galleryImages.map((url, i) => (
                <Box
                  key={i}
                  component="img"
                  src={url}
                  alt={`${product.productName} image ${i + 1}`}
                  sx={{
                    width: { xs: '100%', sm: 200 },
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                />
              ))}
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
}
