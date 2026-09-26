import { useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

function MainImage({ src, alt }) {
  const [broken, setBroken] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        bgcolor: '#f8fafc',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e2e8f0',
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
            objectFit: 'contain',
            display: 'block',
            p: 2,
          }}
        />
      ) : (
        <Box sx={{ textAlign: 'center', color: 'text.disabled' }}>
          <ImageOutlinedIcon sx={{ fontSize: 64, mb: 1, opacity: 0.4 }} />
          <Typography variant="caption" display="block">No image available</Typography>
        </Box>
      )}
    </Box>
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
        width: 64,
        height: 64,
        p: 0,
        border: '2px solid',
        borderColor: selected ? 'primary.main' : '#e2e8f0',
        borderRadius: '10px',
        cursor: 'pointer',
        overflow: 'hidden',
        bgcolor: '#f8fafc',
        flexShrink: 0,
        outline: 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
        '&:hover': {
          borderColor: selected ? 'primary.main' : '#94a3b8',
        },
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
          <ImageOutlinedIcon sx={{ fontSize: 20, color: '#cbd5e1' }} />
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

  if (safeImages.length === 0) {
    return <MainImage src={null} alt="No product image available" />;
  }

  const handlePrev = () => setSelectedIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setSelectedIndex((i) => Math.min(safeImages.length - 1, i + 1));

  return (
    <Box>
      {/* Main image with prev/next */}
      <Box sx={{ position: 'relative' }}>
        <MainImage
          src={safeImages[selectedIndex]}
          alt={`${productName} — image ${selectedIndex + 1}`}
        />

        {safeImages.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              disabled={selectedIndex === 0}
              aria-label="Previous image"
              size="small"
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.92)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                '&:hover': { bgcolor: '#fff' },
                '&.Mui-disabled': { opacity: 0.3 },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
            </IconButton>

            <IconButton
              onClick={handleNext}
              disabled={selectedIndex === safeImages.length - 1}
              aria-label="Next image"
              size="small"
              sx={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.92)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                '&:hover': { bgcolor: '#fff' },
                '&.Mui-disabled': { opacity: 0.3 },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </>
        )}
      </Box>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <Stack
          direction="row"
          spacing={1.25}
          mt={2}
          sx={{ overflowX: 'auto', pb: 0.5 }}
          role="list"
          aria-label="Product image thumbnails"
        >
          {safeImages.map((url, i) => (
            <Box key={i} role="listitem">
              <Thumbnail
                src={url}
                alt={`View image ${i + 1}`}
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
