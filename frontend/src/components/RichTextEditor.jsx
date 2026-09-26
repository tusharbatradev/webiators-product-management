import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold, Italic, Link,
  List,
  BlockQuote, Heading,
  Essentials, Paragraph,
  Undo,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { Box, Typography } from '@mui/material';

const EDITOR_CONFIG = {
  plugins: [
    Essentials, Paragraph, Heading,
    Bold, Italic, Link,
    List,
    BlockQuote, Undo,
  ],
  toolbar: [
    'heading', '|',
    'bold', 'italic', 'link', '|',
    'bulletedList', 'numberedList', 'blockQuote', '|',
    'undo', 'redo',
  ],
  link: {
    defaultProtocol: 'https://',
    decorators: {
      openInNewTab: {
        mode: 'manual',
        label: 'Open in a new tab',
        attributes: { target: '_blank', rel: 'noopener noreferrer' },
      },
    },
  },
};

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
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          '& .ck-editor__editable': {
            minHeight: 160,
            maxHeight: 400,
            overflowY: 'auto',
          },
          '& .ck.ck-toolbar': {
            flexWrap: 'wrap',
          },
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          config={EDITOR_CONFIG}
          data={value}
          onChange={(_event, editor) => {
            onChange(editor.getData());
          }}
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
