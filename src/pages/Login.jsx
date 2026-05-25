import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { signInWithPassword } from '../services/auth';
import { useAuth } from '../hooks/useAuth.jsx';
import { ROUTES } from '../utils/constants';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? ROUTES.MERCHANTS;
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await signInWithPassword(values);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message ?? 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
        backgroundImage:
          'radial-gradient(at 20% 10%, rgba(201,123,94,0.10), transparent 50%), radial-gradient(at 80% 90%, rgba(43,24,16,0.06), transparent 50%)',
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 420 }}>
        <Stack alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"DM Serif Display", serif',
              fontSize: '1.75rem',
              boxShadow: '0 10px 28px rgba(201,123,94,0.35)',
            }}
          >
            J
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"DM Serif Display", serif',
              fontSize: '1.25rem',
            }}
          >
            Jeeth Apparels
          </Typography>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ mt: -0.5 }}
          >
            Admin Panel
          </Typography>
        </Stack>

        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="h1" sx={{ fontSize: '1.75rem' }}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to manage stores and referral codes.
              </Typography>
            </Stack>

            <Stack
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={2}
              noValidate
            >
            {serverError && <Alert severity="error">{serverError}</Alert>}

            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              fullWidth
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
