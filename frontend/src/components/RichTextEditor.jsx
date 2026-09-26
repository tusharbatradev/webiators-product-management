import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Box, Typography } from '@mui/material';

const MODULES = {
  toolbar: [
    [{ heading: [1, 2, 3, false] }],
    ['bold', 'italic', 'link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['clean'],
  ],
};

const FORMATS = [
  'header', 'bold', 'italic', 'link',
  'list', 'blockquote',
];

export default function RichTextEditor({ value, onChange, error }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="body2"
        fontWeight={500}
        gutterBottom
        color={error ? 'error' : 'text.primary'}
      >
        Description *
      </Typography>

      <Box
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : '#e2e8f0',
          borderRadius: 1,
          overflow: 'hidden',
          '& .ql-toolbar': {
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: '1px solid #e2e8f0',
            fontFamily: 'inherit',
          },
          '& .ql-container': {
            border: 'none',
            fontFamily: 'inherit',
            fontSize: '0.875rem',
          },
          '& .ql-editor': {
            minHeight: 160,
            maxHeight: 400,
            overflowY: 'auto',
            color: '#0f172a',
          },
          '& .ql-editor.ql-blank::before': {
            color: '#94a3b8',
            fontStyle: 'normal',
          },
        }}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={MODULES}
          formats={FORMATS}
          placeholder="Write a product description…"
        />
      </Box>

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
