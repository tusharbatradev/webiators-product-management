import { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert,
  IconButton, Stack, CircularProgress, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import RichTextEditor from './RichTextEditor';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_RE = /^https?:\/\/.+/;

function hasText(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length > 0;
}

function validate(fields) {
  const errors = {};
  if (!fields.metaTitle.trim()) errors.metaTitle = 'Meta title is required.';
  if (!fields.productName.trim()) errors.productName = 'Product name is required.';
  if (!fields.productSlug.trim()) {
    errors.productSlug = 'Product slug is required.';
  } else if (!SLUG_RE.test(fields.productSlug.trim())) {
    errors.productSlug = 'Slug must be lowercase letters, numbers, and hyphens (e.g. my-product).';
  }
  const validImages = fields.galleryImages.filter((u) => u.trim());
  if (validImages.length === 0) {
    errors.galleryImages = 'At least one image URL is required.';
  } else if (validImages.some((u) => !URL_RE.test(u.trim()))) {
    errors.galleryImages = 'Each image must be a valid URL starting with http:// or https://.';
  }
  const price = parseFloat(fields.price);
  if (!fields.price) {
    errors.price = 'Price is required.';
  } else if (isNaN(price) || price <= 0) {
    errors.price = 'Price must be a positive number.';
  }
  if (fields.discountedPrice !== '') {
    const dp = parseFloat(fields.discountedPrice);
    if (isNaN(dp) || dp <= 0) {
      errors.discountedPrice = 'Discounted price must be a positive number.';
    } else if (!isNaN(price) && dp >= price) {
      errors.discountedPrice = 'Discounted price must be less than the price.';
    }
  }
  if (!hasText(fields.description)) errors.description = 'Description is required.';
  return errors;
}

function extractApiError(err) {
  const data = err?.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(' ');
  if (data?.message) return data.message;
  if (err?.message === 'Network Error') return 'Unable to reach the server. Check your connection.';
  return 'Something went wrong. Please try again.';
}

const EMPTY = {
  metaTitle: '',
  productName: '',
  productSlug: '',
  galleryImages: [''],
  price: '',
  discountedPrice: '',
  description: '',
};

function SectionHeading({ children }) {
  return (
    <Typography
      variant="caption"
      fontWeight={700}
      color="text.secondary"
      sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 2 }}
    >
      {children}
    </Typography>
  );
}

function ImagePreview({ src }) {
  const [broken, setBroken] = useState(false);
  const valid = src.trim() && URL_RE.test(src.trim());

  return (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: 1.5,
        overflow: 'hidden',
        bgcolor: '#f1f5f9',
        border: '1px solid #e2e8f0',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {valid && !broken ? (
        <Box
          component="img"
          src={src}
          alt=""
          onError={() => setBroken(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <ImageOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
      )}
    </Box>
  );
}

export default function ProductForm({ initialValues, onSubmit, submitLabel = 'Save' }) {
  const [fields, setFields] = useState(() => ({
    ...EMPTY,
    ...initialValues,
    galleryImages: initialValues?.galleryImages?.length ? initialValues.galleryImages : [''],
    price: initialValues?.price != null ? String(initialValues.price) : '',
    discountedPrice:
      initialValues?.discountedPrice != null ? String(initialValues.discountedPrice) : '',
  }));
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (name, value) => setFields((prev) => ({ ...prev, [name]: value }));

  const setImage = (i, value) =>
    setFields((prev) => {
      const imgs = [...prev.galleryImages];
      imgs[i] = value;
      return { ...prev, galleryImages: imgs };
    });

  const addImage = () =>
    setFields((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ''] }));

  const removeImage = (i) =>
    setFields((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setApiError('');
    setSubmitting(true);
    try {
      const payload = {
        metaTitle: fields.metaTitle.trim(),
        productName: fields.productName.trim(),
        productSlug: fields.productSlug.trim(),
        galleryImages: fields.galleryImages.map((u) => u.trim()).filter(Boolean),
        price: parseFloat(fields.price),
        description: fields.description,
      };
      if (fields.discountedPrice !== '') {
        payload.discountedPrice = parseFloat(fields.discountedPrice);
      }
      await onSubmit(payload);
    } catch (err) {
      setApiError(extractApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }} role="alert">
          {apiError}
        </Alert>
      )}

      {/* Product Information */}
      <SectionHeading>Product Information</SectionHeading>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Product Name"
          name="productName"
          value={fields.productName}
          onChange={(e) => set('productName', e.target.value)}
          fullWidth
          required
          error={!!errors.productName}
          helperText={errors.productName}
          inputProps={{ maxLength: 200 }}
        />
        <TextField
          label="Meta Title"
          name="metaTitle"
          value={fields.metaTitle}
          onChange={(e) => set('metaTitle', e.target.value)}
          fullWidth
          required
          error={!!errors.metaTitle}
          helperText={errors.metaTitle || 'Used for SEO — keep it under 100 characters.'}
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          label="Product Slug"
          name="productSlug"
          value={fields.productSlug}
          onChange={(e) => set('productSlug', e.target.value)}
          fullWidth
          required
          error={!!errors.productSlug}
          helperText={errors.productSlug || 'URL-friendly identifier, e.g. my-product-name'}
        />
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Pricing */}
      <SectionHeading>Pricing</SectionHeading>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Price (₹)"
          name="price"
          type="number"
          value={fields.price}
          onChange={(e) => set('price', e.target.value)}
          fullWidth
          required
          error={!!errors.price}
          helperText={errors.price}
          inputProps={{ min: 0, step: 'any', 'aria-label': 'Price' }}
        />
        <TextField
          label="Discounted Price (₹)"
          name="discountedPrice"
          type="number"
          value={fields.discountedPrice}
          onChange={(e) => set('discountedPrice', e.target.value)}
          fullWidth
          error={!!errors.discountedPrice}
          helperText={errors.discountedPrice || 'Optional — must be less than price'}
          inputProps={{ min: 0, step: 'any', 'aria-label': 'Discounted price' }}
        />
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Media */}
      <SectionHeading>Media</SectionHeading>
      <Stack spacing={1.5} sx={{ mb: 1 }}>
        {fields.galleryImages.map((url, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <ImagePreview src={url} />
            <TextField
              label={`Image URL ${i + 1}`}
              value={url}
              onChange={(e) => setImage(i, e.target.value)}
              fullWidth
              error={!!errors.galleryImages}
              inputProps={{ 'aria-label': `Gallery image URL ${i + 1}` }}
            />
            {fields.galleryImages.length > 1 && (
              <IconButton
                onClick={() => removeImage(i)}
                aria-label={`Remove image ${i + 1}`}
                size="small"
                sx={{
                  color: 'error.main',
                  border: '1px solid #fca5a5',
                  borderRadius: 1.5,
                  p: 0.6,
                  flexShrink: 0,
                  '&:hover': { bgcolor: 'rgba(239,68,68,0.06)' },
                }}
              >
                <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Stack>
        ))}
      </Stack>
      {errors.galleryImages && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
          {errors.galleryImages}
        </Typography>
      )}
      <Button
        startIcon={<AddIcon />}
        onClick={addImage}
        size="small"
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Add image URL
      </Button>

      <Divider sx={{ mb: 3 }} />

      {/* Description */}
      <SectionHeading>Description</SectionHeading>
      <RichTextEditor
        value={fields.description}
        onChange={(html) => set('description', html)}
        error={errors.description}
      />

      {/* Actions */}
      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{ py: 1.1, px: 4, minWidth: 160 }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
