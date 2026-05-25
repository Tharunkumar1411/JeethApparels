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
        status: values.status === 'true' || values.status === true,
      });
    } catch (err) {
      setServerError(err.message ?? 'Something went wrong');
    }
  };

  return (
    <Box sx={{ pb: { xs: 14, sm: 0 } }}>
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
                inputProps={{
                  inputMode: 'numeric',
                  autoComplete: 'tel',
                  maxLength: 10,
                }}
                {...register('mobile', {
                  required: 'Mobile is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Must be 10 digits starting with 6, 7, 8, or 9',
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
              multiline
              minRows={3}
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
                    slotProps={{
                      popper: { sx: { maxWidth: '100vw' } },
                    }}
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

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 2.5 }}
            >
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
                select
                label="Status"
                fullWidth
                defaultValue={buildDefaults(merchant).status}
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
          px: 1.5,
          pt: 1.5,
          pb: 'calc(12px + env(safe-area-inset-bottom))',
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
