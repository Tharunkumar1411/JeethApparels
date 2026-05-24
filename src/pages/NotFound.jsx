import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h1">404</Typography>
        <Typography variant="body1" color="text.secondary">
          The page you’re looking for doesn’t exist.
        </Typography>
        <Button variant="contained" onClick={() => navigate(ROUTES.MERCHANTS)}>
          Go to stores
        </Button>
      </Stack>
    </Box>
  );
}
