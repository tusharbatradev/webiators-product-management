import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Alert, CircularProgress,
  Card, CardContent, CardActions, CardMedia,
  Grid, Chip, Stack, Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import * as productService from '../services/productService';
import ConfirmDialog from '../components/ConfirmDialog';

function extractError(err) {
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (err?.message === 'Network Error') return 'Unable to reach the server.';
  return 'Something went wrong. Please try again.';
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    productService
      .getProducts()
      .then((res) => setProducts(res.data.products))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productService.deleteProduct(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setSnackbar('Product deleted successfully.');
    } catch (err) {
      setSnackbar(extractError(err));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1" fontWeight={600}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/products/new')}
        >
          Add Product
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!error && products.length === 0 && (
        <Alert severity="info">No products yet. Add your first product.</Alert>
      )}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {product.galleryImages?.[0] && (
                <CardMedia
                  component="img"
                  height="180"
                  image={product.galleryImages[0]}
                  alt={product.productName}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap gutterBottom>
                  {product.metaTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  /{product.productSlug}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  {product.discountedPrice ? (
                    <>
                      <Chip
                        label={`₹${product.discountedPrice}`}
                        color="primary"
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{product.price}
                      </Typography>
                    </>
                  ) : (
                    <Chip label={`₹${product.price}`} color="primary" size="small" />
                  )}
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button size="small" onClick={() => navigate(`/products/${product._id}`)}>
                  View
                </Button>
                <Button size="small" onClick={() => navigate(`/products/${product._id}/edit`)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => setDeleteTarget(product)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.productName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Box>
  );
}
