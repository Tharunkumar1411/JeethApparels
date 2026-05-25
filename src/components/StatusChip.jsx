import { Box, Typography } from '@mui/material';

export default function StatusChip({ status }) {
  const active = status === true;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 999,
        bgcolor: active ? 'rgba(90,138,82,0.10)' : 'rgba(184,169,154,0.18)',
        border: '1px solid',
        borderColor: active ? 'rgba(90,138,82,0.25)' : 'rgba(184,169,154,0.4)',
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: active ? 'success.main' : 'transparent',
          border: active ? 'none' : '1.5px solid',
          borderColor: 'text.disabled',
          boxShadow: active ? '0 0 0 3px rgba(90,138,82,0.16)' : 'none',
        }}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: active ? 'success.dark' : 'text.secondary',
          lineHeight: 1,
        }}
      >
        {active ? 'Active' : 'Inactive'}
      </Typography>
    </Box>
  );
}
