import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Button, CircularProgress, Alert,
  Chip, Stack, Divider, Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DOMPurify from 'dompurify';
import * as productService from '../services/productService';
import ProductImageGallery from '../components/ProductImageGallery';

// Sanitize HTML and make external links safe before rendering.
function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  });
}

// After sanitization, force target="_blank" links to also carry rel="noopener noreferrer".
function addLinkSafety(html) {
  return html.replace(
    /<a\s([^>]*target="_blank")[^>]*>/gi,
    (match) =>
      match.includes('rel=') ? match : match.replace('>', ' rel="noopener noreferrer">'),
  );
}

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

        <ProductImageGallery
          images={product.galleryImages}
          productName={product.productName}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Description
        </Typography>
        <Box
          sx={{
            '& h2, & h3, & h4': { mt: 1.5, mb: 0.5, fontWeight: 600 },
            '& p': { mt: 0, mb: 1 },
            '& ul, & ol': { pl: 3, mb: 1 },
            '& li': { mb: 0.25 },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'divider',
              pl: 2,
              ml: 0,
              color: 'text.secondary',
            },
            '& a': { color: 'primary.main' },
            '& strong': { fontWeight: 700 },
          }}
          dangerouslySetInnerHTML={{
            __html: addLinkSafety(sanitizeHtml(product.description || '')),
          }}
        />
      </Paper>
    </Box>
  );
}
