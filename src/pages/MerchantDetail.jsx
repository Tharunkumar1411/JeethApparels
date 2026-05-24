import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PageHeader from '../components/PageHeader.jsx';
import StatusChip from '../components/StatusChip.jsx';
import {
  useDeleteMerchant,
  useMerchantQuery,
  useUpdateMerchant,
} from '../hooks/useMerchants';
import { MERCHANT_STATUS, ROUTES } from '../utils/constants';

export default function MerchantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: merchant, isLoading, error } = useMerchantQuery(id);
  const updateMerchant = useUpdateMerchant(id);
  const deleteMerchant = useDeleteMerchant();

  const [statusDraft, setStatusDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  const currentStatus =
    statusDraft === null ? merchant?.status ?? true : statusDraft;

  const handleStatusSave = async () => {
    await updateMerchant.mutateAsync({ status: currentStatus });
    setStatusDraft(null);
  };

  const handleCopy = async () => {
    if (!merchant?.referral_code) return;
    await navigator.clipboard.writeText(merchant.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this merchant? This cannot be undone.')) return;
    await deleteMerchant.mutateAsync(id);
    navigate(ROUTES.MERCHANTS, { replace: true });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!merchant) {
    return <Alert severity="warning">Merchant not found.</Alert>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(ROUTES.MERCHANTS)}
        sx={{ mb: 2 }}
      >
        Back to merchants
      </Button>

      <PageHeader
        title={merchant.store_name}
        subtitle={`${merchant.city}, ${merchant.state}`}
        actions={<StatusChip status={merchant.status} />}
      />

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h2" sx={{ mb: 2 }}>
                Profile
              </Typography>
              <Grid container spacing={2}>
                <Field label="Mobile" value={merchant.mobile} />
                <Field label="Email" value={merchant.email || '—'} />
                <Field label="City" value={merchant.city} />
                <Field label="State" value={merchant.state} />
                <Field
                  label="Description"
                  value={merchant.description || '—'}
                />
                <Field
                  label="Created"
                  value={
                    merchant.created_at
                      ? new Date(merchant.created_at).toLocaleString()
                      : '—'
                  }
                />
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h2" sx={{ mb: 2 }}>
                Status
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ sm: 'center' }}
              >
                <TextField
                  select
                  label="Status"
                  size="small"
                  value={String(currentStatus)}
                  onChange={(e) => setStatusDraft(e.target.value === 'true')}
                  sx={{ minWidth: 200 }}
                >
                  {MERCHANT_STATUS.map((opt) => (
                    <MenuItem key={String(opt.value)} value={String(opt.value)}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  onClick={handleStatusSave}
                  disabled={
                    updateMerchant.isPending ||
                    currentStatus === merchant.status
                  }
                >
                  {updateMerchant.isPending ? 'Saving…' : 'Save'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 1 }}>
                  Referral code
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Share this code to attribute new sign-ups to this merchant.
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    component="code"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '1.1rem',
                      bgcolor: 'background.default',
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      flexGrow: 1,
                    }}
                  >
                    {merchant.referral_code}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 1 }}>
                  Danger zone
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Permanently delete this merchant.
                </Typography>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={handleDelete}
                  disabled={deleteMerchant.isPending}
                >
                  {deleteMerchant.isPending ? 'Deleting…' : 'Delete merchant'}
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

function Field({ label, value }) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Grid>
  );
}
