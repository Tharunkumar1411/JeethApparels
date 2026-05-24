import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { MERCHANT_STATUS } from '../utils/constants';
import { INDIAN_STATES, citiesForState } from '../utils/indianGeography';

const FORM_ID = 'merchant-form';

const EMPTY_DEFAULTS = {
  storeName: '',
  ownerName: '',
  mobile: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  email: '',
  description: '',
  referralCode: '',
  status: 'true',
};

function buildDefaults(merchant) {
  if (!merchant) return EMPTY_DEFAULTS;
  return {
    storeName: merchant.store_name ?? '',
    ownerName: merchant.owner_name ?? '',
    mobile: merchant.mobile ?? '',
    address: merchant.address ?? '',
    city: merchant.city ?? '',
    state: merchant.state ?? '',
    pincode: merchant.pincode ?? '',
    email: merchant.email ?? '',
    description: merchant.description ?? '',
    referralCode: merchant.referral_code ?? '',
    status: String(merchant.status ?? true),
  };
}

export default function MerchantForm({
  merchant,
  submitLabel = 'Save',
  onSubmit,
  onCancel,
}) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: buildDefaults(merchant) });

  const watchedState = watch('state');
  const cityOptions = citiesForState(watchedState);

  const submit = async (values) => {
    setServerError('');
    try {
      await onSubmit({
        ...values,
        referralCode: values.referralCode.trim().toUpperCase(),
        status: values.status === 'true' || values.status === true,
      });
    } catch (err) {
      setServerError(err.message ?? 'Something went wrong');
    }
  };

  return (
    <Box sx={{ pb: { xs: 10, sm: 0 } }}>
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            id={FORM_ID}
            component="form"
            onSubmit={handleSubmit(submit)}
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
                label="Store owner name"
                fullWidth
                autoComplete="name"
                {...register('ownerName', {
                  required: 'Store owner name is required',
                })}
                error={!!errors.ownerName}
                helperText={errors.ownerName?.message}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
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
            </Stack>

            <TextField
              label="Store address"
              fullWidth
              autoComplete="street-address"
              {...register('address', { required: 'Address is required' })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <Controller
                name="state"
                control={control}
                rules={{ required: 'State is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    select
                    label="State"
                    fullWidth
                    onChange={(e) => {
                      field.onChange(e);
                      // Clear city when state changes so the user picks again.
                      setValue('city', '', { shouldValidate: false });
                    }}
                    error={!!error}
                    helperText={error?.message}
                  >
                    {INDIAN_STATES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="city"
                control={control}
                rules={{ required: 'City is required' }}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    freeSolo
                    autoSelect
                    fullWidth
                    options={cityOptions}
                    value={field.value || ''}
                    onChange={(_, v) => field.onChange(v ?? '')}
                    onInputChange={(_, v) => field.onChange(v ?? '')}
                    disabled={!watchedState}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="City"
                        autoComplete="address-level2"
                        error={!!error}
                        helperText={
                          error?.message ||
                          (!watchedState ? 'Select a state first' : '')
                        }
                      />
                    )}
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <TextField
                label="Pincode"
                type="tel"
                fullWidth
                autoComplete="postal-code"
                inputProps={{ inputMode: 'numeric', maxLength: 6 }}
                {...register('pincode', {
                  required: 'Pincode is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Pincode must be 6 digits',
                  },
                })}
                error={!!errors.pincode}
                helperText={errors.pincode?.message}
              />
              <TextField
                label="Referral code"
                fullWidth
                inputProps={{ style: { textTransform: 'uppercase' } }}
                {...register('referralCode', {
                  required: 'Referral code is required',
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: 'Letters only, no spaces or numbers',
                  },
                  minLength: {
                    value: 4,
                    message: 'At least 4 letters',
                  },
                  maxLength: {
                    value: 20,
                    message: 'At most 20 letters',
                  },
                })}
                error={!!errors.referralCode}
                helperText={
                  errors.referralCode?.message || 'Letters A–Z only. Must be unique.'
                }
              />
            </Stack>

            <TextField
              select
              label="Status"
              defaultValue={buildDefaults(merchant).status}
              sx={{ maxWidth: { sm: '50%' } }}
              {...register('status')}
            >
              {MERCHANT_STATUS.map((opt) => (
                <MenuItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Description (optional)"
              fullWidth
              multiline
              minRows={2}
              {...register('description')}
            />

            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <Button
                variant="text"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving…' : submitLabel}
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          type="submit"
          form={FORM_ID}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </Paper>
    </Box>
  );
}
