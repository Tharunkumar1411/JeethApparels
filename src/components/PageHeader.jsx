import { Box, Stack, Typography } from '@mui/material';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ sm: 'center' }}
      justifyContent="space-between"
      sx={{ mb: { xs: 2, sm: 3 } }}
    >
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: { xs: 'nowrap', sm: 'normal' },
            wordBreak: 'break-word',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box>{actions}</Box>}
    </Stack>
  );
}
