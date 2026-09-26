import { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert,
  IconButton, Stack, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RichTextEditor from './RichTextEditor';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_RE = /^https?:\/\/.+/;

// Strip HTML tags and decode whitespace to check for meaningful text content.
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

export default function ProductForm({ initialValues, onSubmit, submitLabel = 'Save' }) {
  const [fields, setFields] = useState(() => ({
    ...EMPTY,
    ...initialValues,
    galleryImages:
      initialValues?.galleryImages?.length ? initialValues.galleryImages : [''],
    price: initialValues?.price != null ? String(initialValues.price) : '',
    discountedPrice:
      initialValues?.discountedPrice != null ? String(initialValues.discountedPrice) : '',
  }));
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (name, value) =>
    setFields((prev) => ({ ...prev, [name]: value }));

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
        description: fields.description, // HTML string from CKEditor — do not trim
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
        <Alert severity="error" sx={{ mb: 2 }} role="alert">
          {apiError}
        </Alert>
      )}

      <TextField
        label="Meta Title"
        name="metaTitle"
        value={fields.metaTitle}
        onChange={(e) => set('metaTitle', e.target.value)}
        fullWidth
        required
        margin="normal"
        error={!!errors.metaTitle}
        helperText={errors.metaTitle}
        inputProps={{ maxLength: 100 }}
      />

      <TextField
        label="Product Name"
        name="productName"
        value={fields.productName}
        onChange={(e) => set('productName', e.target.value)}
        fullWidth
        required
        margin="normal"
        error={!!errors.productName}
        helperText={errors.productName}
        inputProps={{ maxLength: 200 }}
      />

      <TextField
        label="Product Slug"
        name="productSlug"
        value={fields.productSlug}
        onChange={(e) => set('productSlug', e.target.value)}
        fullWidth
        required
        margin="normal"
        error={!!errors.productSlug}
        helperText={errors.productSlug || 'e.g. my-product-name'}
      />

      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography variant="body2" fontWeight={500} gutterBottom>
          Gallery Images *
        </Typography>
        {fields.galleryImages.map((url, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <TextField
              label={`Image URL ${i + 1}`}
              value={url}
              onChange={(e) => setImage(i, e.target.value)}
              fullWidth
              size="small"
              error={!!errors.galleryImages}
              inputProps={{ 'aria-label': `Gallery image URL ${i + 1}` }}
            />
            {fields.galleryImages.length > 1 && (
              <IconButton
                onClick={() => removeImage(i)}
                aria-label={`Remove image ${i + 1}`}
                size="small"
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        ))}
        {errors.galleryImages && (
          <Typography variant="caption" color="error">
            {errors.galleryImages}
          </Typography>
        )}
        <Button
          startIcon={<AddIcon />}
          onClick={addImage}
          size="small"
          sx={{ mt: 0.5 }}
        >
          Add image URL
        </Button>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
        <TextField
          label="Price"
          name="price"
          type="number"
          value={fields.price}
          onChange={(e) => set('price', e.target.value)}
          fullWidth
          required
          margin="normal"
          error={!!errors.price}
          helperText={errors.price}
          inputProps={{ min: 0, step: 'any', 'aria-label': 'Price' }}
        />
        <TextField
          label="Discounted Price"
          name="discountedPrice"
          type="number"
          value={fields.discountedPrice}
          onChange={(e) => set('discountedPrice', e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.discountedPrice}
          helperText={errors.discountedPrice || 'Optional'}
          inputProps={{ min: 0, step: 'any', 'aria-label': 'Discounted price' }}
        />
      </Stack>

      <RichTextEditor
        value={fields.description}
        onChange={(html) => set('description', html)}
        error={errors.description}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        sx={{ mt: 3, py: 1.2, minWidth: 140 }}
      >
        {submitting ? <CircularProgress size={22} color="inherit" /> : submitLabel}
      </Button>
    </Box>
  );
}
