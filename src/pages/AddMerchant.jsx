import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import PageHeader from '../components/PageHeader.jsx';
import { useCreateMerchant } from '../hooks/useMerchants';
import { generateReferralCode } from '../utils/referralCode';
import { MERCHANT_STATUS, ROUTES } from '../utils/constants';

export default function AddMerchant() {
  const navigate = useNavigate();
  const createMerchant = useCreateMerchant();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      storeName: '',
      mobile: '',
      city: '',
      state: '',
      email: '',
      description: '',
      status: 'true',
      referralCode: generateReferralCode(''),
    },
  });

  const storeNameValue = watch('storeName');

  const regenerateCode = () => {
    setValue('referralCode', generateReferralCode(storeNameValue), {
      shouldDirty: true,
    });
  };

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const created = await createMerchant.mutateAsync({
        ...values,
        status: values.status === 'true' || values.status === true,
      });
      navigate(ROUTES.MERCHANT_DETAIL(created.id));
    } catch (err) {
      setServerError(err.message ?? 'Failed to create merchant');
    }
  };

  const formId = 'add-merchant-form';

  return (
    <Box sx={{ pb: { xs: 10, sm: 0 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(ROUTES.MERCHANTS)}
        sx={{ mb: 1, ml: -1 }}
      >
        Back to merchants
      </Button>

      <PageHeader
        title="Add Merchant"
        subtitle="Create a new merchant and generate a referral code"
      />

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            id={formId}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={2.5}
            noValidate
          >
            {serverError && <Alert severity="error">{serverError}</Alert>}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <TextField
                label="Store name"
                fullWidth
                autoComplete="organization"
                {...register('storeName', {
                  required: 'Store name is required',
                })}
                error={!!errors.storeName}
                helperText={errors.storeName?.message}
              />
              <TextField
                label="Mobile"
                type="tel"
                fullWidth
                inputProps={{ inputMode: 'numeric', autoComplete: 'tel' }}
                {...register('mobile', {
                  required: 'Mobile is required',
                  pattern: {
                    value: /^[0-9+\-\s()]{7,15}$/,
                    message: 'Enter a valid mobile number',
                  },
                })}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                fullWidth
                autoComplete="address-level2"
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
              <TextField
                label="State"
                fullWidth
                autoComplete="address-level1"
                {...register('state', { required: 'State is required' })}
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <TextField
                label="Email (optional)"
                type="email"
                fullWidth
                autoComplete="email"
                {...register('email', {
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Enter a valid email',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                select
                label="Status"
                fullWidth
                defaultValue="true"
                {...register('status')}
              >
                {MERCHANT_STATUS.map((opt) => (
                  <MenuItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <TextField
              label="Description (optional)"
              fullWidth
              multiline
              minRows={2}
              {...register('description')}
            />

            <TextField
              label="Referral code"
              fullWidth
              {...register('referralCode', {
                required: 'Referral code is required',
              })}
              error={!!errors.referralCode}
              helperText={errors.referralCode?.message}
              sx={{ maxWidth: { sm: '50%' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={regenerateCode}
                    >
                      New
                    </Button>
                  </InputAdornment>
                ),
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <Button
                variant="text"
                onClick={() => navigate(ROUTES.MERCHANTS)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving…' : 'Create merchant'}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Paper
        elevation={8}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
          gap: 1,
          borderRadius: 0,
          borderTop: 1,
          borderColor: 'divider',
          zIndex: (t) => t.zIndex.appBar - 1,
        }}
      >
        <Button
          fullWidth
          variant="text"
          onClick={() => navigate(ROUTES.MERCHANTS)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          type="submit"
          form={formId}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Create merchant'}
        </Button>
      </Paper>
    </Box>
  );
}
