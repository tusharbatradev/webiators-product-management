import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, Button, Alert, Chip, Stack,
  Snackbar, IconButton, Tooltip, InputBase,
  Skeleton, Card, CardContent, CardActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import * as productService from '../services/productService';
import ConfirmDialog from '../components/ConfirmDialog';

function extractError(err) {
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (err?.message === 'Network Error') return 'Unable to reach the server.';
  return 'Something went wrong. Please try again.';
}

/* ── Skeleton card ── */
function ProductCardSkeleton() {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <Skeleton
        variant="rectangular"
        sx={{ aspectRatio: '4/3', width: '100%', borderRadius: 0, flexShrink: 0 }}
      />
      <CardContent sx={{ p: 2 }}>
        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 0.75 }} />
        <Skeleton variant="text" width="50%" height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={14} sx={{ mb: 1.5 }} />
        <Skeleton variant="rectangular" width={80} height={22} sx={{ borderRadius: 1 }} />
      </CardContent>
      <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" height={34} sx={{ flex: 1, borderRadius: 1.5 }} />
        <Skeleton variant="rectangular" height={34} sx={{ flex: 1, borderRadius: 1.5 }} />
        <Skeleton variant="rectangular" width={34} height={34} sx={{ borderRadius: 1.5 }} />
      </Box>
    </Card>
  );
}

/* ── Empty state ── */
function EmptyState({ hasSearch, onAdd }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 10, sm: 14 },
        px: 2,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(99,102,241,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        <Inventory2OutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />
      </Box>
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
        {hasSearch ? 'No products found' : 'No products yet'}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 340, mb: hasSearch ? 0 : 3, lineHeight: 1.7 }}
      >
        {hasSearch
          ? 'Try a different search term or clear the search to see all products.'
          : 'Start building your product catalog by adding your first product.'}
      </Typography>
      {!hasSearch && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} sx={{ mt: 1 }}>
          Add Product
        </Button>
      )}
    </Box>
  );
}

/* ── Product image with fallback ── */
function ProductImage({ src, alt }) {
  const [broken, setBroken] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '4/3',
        overflow: 'hidden',
        bgcolor: '#f8fafc',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      {src && !broken ? (
        <Box
          component="img"
          src={src}
          alt={alt}
          onError={() => setBroken(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.3s ease',
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            '.MuiCard-root:hover &': { transform: 'scale(1.05)' },
          }}
        />
      ) : (
        <Inventory2OutlinedIcon sx={{ fontSize: 44, color: '#cbd5e1' }} />
      )}
    </Box>
  );
}

/* ── Product card ── */
function ProductCard({ product, onView, onEdit, onDelete }) {
  const hasDiscount = !!product.discountedPrice;
  const discountPct = hasDiscount
    ? Math.round((1 - product.discountedPrice / product.price) * 100)
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '14px',
        overflow: 'hidden',
      }}
    >
      {/* Image */}
      <ProductImage src={product.galleryImages?.[0]} alt={product.productName} />

      {/* Body */}
      <CardContent
        sx={{
          flex: 1,
          p: 2,
          pb: '12px !important',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Photo count badge */}
        {product.galleryImages?.length > 1 && (
          <Box sx={{ mb: 1 }}>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.4,
                px: 0.875,
                py: 0.3,
                bgcolor: 'rgba(99,102,241,0.08)',
                color: 'primary.dark',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {product.galleryImages.length} photos
            </Box>
          </Box>
        )}

        {/* Product name */}
        <Typography
          fontWeight={700}
          noWrap
          title={product.productName}
          sx={{ fontSize: '0.9375rem', color: 'text.primary', lineHeight: 1.35, mb: 0.4 }}
        >
          {product.productName}
        </Typography>

        {/* Slug */}
        <Typography
          noWrap
          title={`/${product.productSlug}`}
          sx={{
            fontSize: '0.75rem',
            color: 'text.secondary',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            mb: 0.5,
          }}
        >
          /{product.productSlug}
        </Typography>

        {/* Meta title */}
        <Typography
          noWrap
          title={product.metaTitle}
          sx={{ fontSize: '0.78rem', color: 'text.secondary', mb: 1.25, lineHeight: 1.4 }}
        >
          {product.metaTitle}
        </Typography>

        {/* Price row */}
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mt: 'auto', gap: 0.75 }}>
          {hasDiscount ? (
            <>
              <Typography
                fontWeight={700}
                sx={{ fontSize: '1rem', color: 'primary.main', lineHeight: 1 }}
              >
                ₹{product.discountedPrice}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                  textDecoration: 'line-through',
                  lineHeight: 1,
                }}
              >
                ₹{product.price}
              </Typography>
              <Chip
                label={`${discountPct}% off`}
                size="small"
                color="success"
                sx={{ height: 20, fontSize: '0.67rem', fontWeight: 700, px: 0.25 }}
              />
            </>
          ) : (
            <Typography
              fontWeight={700}
              sx={{ fontSize: '1rem', color: 'primary.main', lineHeight: 1 }}
            >
              ₹{product.price}
            </Typography>
          )}
        </Stack>
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          px: 2,
          pb: 2,
          pt: 0.75,
          gap: 0.75,
          borderTop: '1px solid #f1f5f9',
        }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityOutlinedIcon sx={{ fontSize: '15px !important' }} />}
          onClick={onView}
          sx={{
            flex: 1,
            fontSize: '0.78rem',
            py: 0.75,
            borderRadius: '8px',
            borderColor: '#e2e8f0',
            color: 'text.secondary',
            '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(99,102,241,0.04)' },
          }}
        >
          View
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditOutlinedIcon sx={{ fontSize: '15px !important' }} />}
          onClick={onEdit}
          sx={{
            flex: 1,
            fontSize: '0.78rem',
            py: 0.75,
            borderRadius: '8px',
            borderColor: '#e2e8f0',
            color: 'text.secondary',
            '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(99,102,241,0.04)' },
          }}
        >
          Edit
        </Button>
        <Tooltip title="Delete product" arrow>
          <IconButton
            size="small"
            onClick={onDelete}
            aria-label={`Delete ${product.productName}`}
            sx={{
              width: 34,
              height: 34,
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: 'text.secondary',
              flexShrink: 0,
              '&:hover': {
                bgcolor: 'rgba(239,68,68,0.06)',
                borderColor: '#fca5a5',
                color: 'error.main',
              },
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

/* ── Page ── */
export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState(location.state?.snackbar ? { message: location.state.snackbar, severity: 'success' } : null);
  const [search, setSearch] = useState('');

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
      setSnackbar({ message: 'Product deleted successfully.', severity: 'success' });
    } catch (err) {
      setSnackbar({ message: extractError(err), severity: 'error' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      !search.trim() ||
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.metaTitle?.toLowerCase().includes(search.toLowerCase()) ||
      p.productSlug?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box>
      {/* ── Toolbar ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{ mb: 2.5 }}
      >
        {/* Search */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            height: 44,
            px: 1.75,
            bgcolor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '11px',
            width: { xs: '100%', sm: 340, md: 380 },
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            '&:focus-within': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 3px rgba(99,102,241,0.12)',
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
          <InputBase
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputProps={{ 'aria-label': 'Search products' }}
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              color: 'text.primary',
              '& input::placeholder': { color: 'text.secondary', opacity: 1 },
            }}
          />
        </Box>

        {/* Add Product */}
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: '18px !important' }} />}
          onClick={() => navigate('/products/new')}
          sx={{
            height: 44,
            px: 2.5,
            borderRadius: '11px',
            fontSize: '0.875rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(99,102,241,0.3)',
            '&:hover': { boxShadow: '0 4px 12px rgba(99,102,241,0.35)' },
          }}
        >
          Add Product
        </Button>
      </Stack>

      {/* ── Product count ── */}
      {!loading && !error && (
        <Typography
          variant="body2"
          sx={{ mb: 2.5, color: 'text.secondary', fontSize: '0.8125rem' }}
        >
          {products.length === 0
            ? 'No products'
            : filtered.length === products.length
            ? `${products.length} product${products.length !== 1 ? 's' : ''}`
            : `${filtered.length} of ${products.length} product${products.length !== 1 ? 's' : ''}`}
        </Typography>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* ── Grid ── */}
      {!loading && filtered.length === 0 ? (
        <EmptyState
          hasSearch={!!search.trim()}
          onAdd={() => navigate('/products/new')}
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(280px, 320px))',
            },
            justifyContent: 'start',
            gap: { xs: 2, sm: 2.5 },
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : filtered.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onView={() => navigate(`/products/${product._id}`)}
                  onEdit={() => navigate(`/products/${product._id}/edit`)}
                  onDelete={() => setDeleteTarget(product)}
                />
              ))}
        </Box>
      )}

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
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity={snackbar?.severity || 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
