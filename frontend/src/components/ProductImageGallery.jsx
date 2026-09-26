import { useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const PLACEHOLDER_BG = '#f0f0f0';

function MainImage({ src, alt }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16/9',
          bgcolor: PLACEHOLDER_BG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
        }}
        role="img"
        aria-label="No product image available"
      >
        <Typography variant="body2" color="text.secondary">
          No product image available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      sx={{
        width: '100%',
        aspectRatio: '16/9',
        objectFit: 'contain',
        bgcolor: PLACEHOLDER_BG,
        borderRadius: 1,
        display: 'block',
      }}
    />
  );
}

function Thumbnail({ src, alt, selected, onClick }) {
  const [broken, setBroken] = useState(false);

  return (
    <Box
      component="button"
      onClick={onClick}
      aria-label={alt}
      aria-pressed={selected}
      sx={{
        width: 72,
        height: 56,
        p: 0,
        border: '2px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        borderRadius: 1,
        cursor: 'pointer',
        overflow: 'hidden',
        bgcolor: PLACEHOLDER_BG,
        flexShrink: 0,
        outline: 'none',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      {broken || !src ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary" fontSize={9}>
            N/A
          </Typography>
        </Box>
      ) : (
        <Box
          component="img"
          src={src}
          alt=""
          aria-hidden="true"
          onError={() => setBroken(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
    </Box>
  );
}

export default function ProductImageGallery({ images, productName }) {
  const safeImages = Array.isArray(images) && images.length > 0 ? images : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If no images, show placeholder immediately
  if (safeImages.length === 0) {
    return <MainImage src={null} alt="No product image available" />;
  }

  const handlePrev = () => setSelectedIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setSelectedIndex((i) => Math.min(safeImages.length - 1, i + 1));

  const isFirst = selectedIndex === 0;
  const isLast = selectedIndex === safeImages.length - 1;

  return (
    <Box>
      {/* Main image + prev/next controls */}
      <Box sx={{ position: 'relative' }}>
        <MainImage
          src={safeImages[selectedIndex]}
          alt={`${productName} image ${selectedIndex + 1}`}
        />

        {safeImages.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              disabled={isFirst}
              aria-label="Previous image"
              size="small"
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.85)',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                '&.Mui-disabled': { opacity: 0.3 },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={handleNext}
              disabled={isLast}
              aria-label="Next image"
              size="small"
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.85)',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                '&.Mui-disabled': { opacity: 0.3 },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          mt={1.5}
          sx={{ overflowX: 'auto', pb: 0.5 }}
          role="list"
          aria-label="Product image thumbnails"
        >
          {safeImages.map((url, i) => (
            <Box key={i} role="listitem">
              <Thumbnail
                src={url}
                alt={`View ${productName} image ${i + 1}`}
                selected={i === selectedIndex}
                onClick={() => setSelectedIndex(i)}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
