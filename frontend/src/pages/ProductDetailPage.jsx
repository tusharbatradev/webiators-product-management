import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, Stack, Divider,
  Skeleton, Breadcrumbs, Link, IconButton, Snackbar, Alert,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import DOMPurify from 'dompurify';
import * as productService from '../services/productService';
import ProductImageGallery from '../components/ProductImageGallery';
import ConfirmDialog from '../components/ConfirmDialog';

function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true }, ADD_ATTR: ['target', 'rel'] });
}

function addLinkSafety(html) {
  return html.replace(
    /<a\s([^>]*target="_blank")[^>]*>/gi,
    (match) => (match.includes('rel=') ? match : match.replace('>', ' rel="noopener noreferrer">')),
  );
}

function extractError(err) {
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (err?.message === 'Network Error') return 'Unable to reach the server.';
  return 'Something went wrong. Please try again.';
}

/* ── Skeleton ── */
function DetailSkeleton() {
  return (
    <Box>
      {/* Breadcrumb skeleton */}
      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
        <Skeleton width={40} height={16} />
        <Skeleton width={8} height={16} />
        <Skeleton width={60} height={16} />
        <Skeleton width={8} height={16} />
        <Skeleton width={100} height={16} />
      </Stack>

      {/* Two-column skeleton */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '55fr 45fr' },
          gap: { xs: 3, md: 5 },
          mb: 4,
        }}
      >
        {/* Gallery skeleton */}
        <Box>
          <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px' }} />
          <Stack direction="row" spacing={1.25} mt={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" width={80} height={80} sx={{ borderRadius: '10px', flexShrink: 0 }} />
            ))}
          </Stack>
        </Box>

        {/* Info skeleton */}
        <Box>
          <Skeleton width="30%" height={14} sx={{ mb: 1.5 }} />
          <Skeleton width="85%" height={40} sx={{ mb: 0.5 }} />
          <Skeleton width="55%" height={24} sx={{ mb: 3 }} />
          <Skeleton width="40%" height={48} sx={{ mb: 1 }} />
          <Skeleton width="60%" height={20} sx={{ mb: 3 }} />
          <Divider sx={{ mb: 3 }} />
          <Skeleton width="100%" height={16} sx={{ mb: 1 }} />
          <Skeleton width="80%" height={16} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '12px', mb: 1.5 }} />
          <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '12px' }} />
        </Box>
      </Box>

      {/* Description skeleton */}
      <Skeleton variant="rectangular" sx={{ width: '100%', height: 180, borderRadius: '16px' }} />
    </Box>
  );
}

/* ── Error state ── */
function ErrorState({ message, onBack }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 12,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          bgcolor: 'rgba(239,68,68,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        <DeleteOutlinedIcon sx={{ fontSize: 32, color: 'error.main' }} />
      </Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>Product not found</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 320 }}>
        {message || 'The requested product could not be loaded.'}
      </Typography>
    </Box>
  );
}

/* ── Meta info pill ── */
function InfoPill({ icon, label, value }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      <Typography variant="caption" color="text.disabled" fontWeight={500}>
        {label}:
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={500}
        sx={{ fontFamily: '"JetBrains Mono","Fira Code",monospace', wordBreak: 'break-all' }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState(location.state?.snackbar ? { message: location.state.snackbar, severity: 'success' } : null);

  useEffect(() => {
    productService
      .getProductById(id)
      .then((res) => setProduct(res.data.product))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productService.deleteProduct(id);
      navigate('/products', { replace: true, state: { snackbar: 'Product deleted successfully.' } });
    } catch (err) {
      setSnackbar({ message: extractError(err), severity: 'error' });
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const discount = product?.discountedPrice
    ? Math.round((1 - product.discountedPrice / product.price) * 100)
    : null;

  if (loading) return <DetailSkeleton />;
  if (error) return <ErrorState message={error} onBack={() => navigate('/products')} />;

  return (
    <Box>
      {/* ── Breadcrumb ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1.5}>
        <Breadcrumbs
          separator="/"
          sx={{ '& .MuiBreadcrumbs-separator': { color: 'text.disabled', mx: 0.75 } }}
        >
          <Link
            component={RouterLink}
            to="/products"
            underline="hover"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              fontSize: '0.8125rem',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <HomeOutlinedIcon sx={{ fontSize: 14 }} />
            Home
          </Link>
          <Link
            component={RouterLink}
            to="/products"
            underline="hover"
            sx={{ color: 'text.secondary', fontSize: '0.8125rem', '&:hover': { color: 'primary.main' } }}
          >
            Products
          </Link>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              color: 'text.primary',
              fontWeight: 500,
              maxWidth: { xs: 140, sm: 300 },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.productName}
          </Typography>
        </Breadcrumbs>
      </Stack>

      {/* ── Main two-column layout ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '42fr 58fr' },
          gap: { xs: 3, md: 4 },
          alignItems: 'start',
          mb: 4,
        }}
      >
        {/* ── LEFT: Gallery ── */}
        <Box>
          <ProductImageGallery
            images={product.galleryImages}
            productName={product.productName}
          />
        </Box>

        {/* ── RIGHT: Product info ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Meta title — subtle label above product name */}
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'primary.main',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mb: 1,
              display: 'block',
            }}
          >
            {product.metaTitle}
          </Typography>

          {/* Product name */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.6rem', sm: '1.875rem', md: '2rem' },
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            {product.productName}
          </Typography>

          {/* Pricing */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
              mb: 2.5,
              p: 2,
              bgcolor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            {product.discountedPrice ? (
              <>
                <Typography
                  sx={{ fontSize: '2rem', fontWeight: 800, color: 'primary.main', lineHeight: 1 }}
                >
                  ₹{product.discountedPrice}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.1rem',
                    color: 'text.disabled',
                    textDecoration: 'line-through',
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  ₹{product.price}
                </Typography>
                <Chip
                  label={`${discount}% OFF`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(16,185,129,0.1)',
                    color: '#059669',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 24,
                    borderRadius: '6px',
                  }}
                />
              </>
            ) : (
              <Typography
                sx={{ fontSize: '2rem', fontWeight: 800, color: 'primary.main', lineHeight: 1 }}
              >
                ₹{product.price}
              </Typography>
            )}
          </Box>

          {/* Meta info pills */}
          <Stack spacing={1} mb={3}>
            <InfoPill
              icon={<LinkOutlinedIcon sx={{ fontSize: 13 }} />}
              label="Slug"
              value={`/${product.productSlug}`}
            />
            <InfoPill
              icon={<PhotoLibraryOutlinedIcon sx={{ fontSize: 13 }} />}
              label="Gallery"
              value={`${product.galleryImages?.length || 0} image${product.galleryImages?.length !== 1 ? 's' : ''}`}
            />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Action buttons */}
          <Stack spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={() => navigate(`/products/${id}/edit`)}
              fullWidth
              sx={{
                height: 48,
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                boxShadow: '0 1px 3px rgba(99,102,241,0.3)',
                '&:hover': { boxShadow: '0 4px 12px rgba(99,102,241,0.35)' },
              }}
            >
              Edit Product
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteOutlinedIcon />}
              onClick={() => setDeleteOpen(true)}
              fullWidth
              sx={{
                height: 48,
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                borderColor: '#fca5a5',
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'rgba(239,68,68,0.04)',
                  borderColor: 'error.main',
                },
              }}
            >
              Delete Product
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* ── Full-width Description section ── */}
      {product.description && (
        <Box
          sx={{
            bgcolor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              mb: 2.5,
              pb: 2,
              borderBottom: '1px solid #f1f5f9',
              fontSize: '1rem',
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            Description
          </Typography>
          <Box
            sx={{
              '& h1, & h2, & h3, & h4': { fontWeight: 700, mt: 2, mb: 0.75, color: 'text.primary', lineHeight: 1.3 },
              '& h1': { fontSize: '1.4rem' },
              '& h2': { fontSize: '1.2rem' },
              '& h3': { fontSize: '1.05rem' },
              '& p': { mt: 0, mb: 1.25, lineHeight: 1.75, color: 'text.secondary', fontSize: '0.9375rem' },
              '& ul, & ol': { pl: 2.5, mb: 1.25 },
              '& li': { mb: 0.5, color: 'text.secondary', fontSize: '0.9375rem', lineHeight: 1.7 },
              '& blockquote': {
                borderLeft: '3px solid',
                borderColor: 'primary.light',
                pl: 2, ml: 0, my: 1.5,
                color: 'text.secondary',
                fontStyle: 'italic',
              },
              '& a': { color: 'primary.main', textDecoration: 'underline' },
              '& strong': { fontWeight: 700, color: 'text.primary' },
              '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px', my: 1 },
              '& code': {
                bgcolor: '#f1f5f9',
                px: 0.75,
                py: 0.25,
                borderRadius: '4px',
                fontSize: '0.85em',
                fontFamily: '"JetBrains Mono","Fira Code",monospace',
              },
              overflowWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{
              __html: addLinkSafety(sanitizeHtml(product.description || '')),
            }}
          />
        </Box>
      )}

      {/* ── Delete confirmation ── */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.productName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
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
