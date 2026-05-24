import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PageHeader from '../components/PageHeader.jsx';
import StatusChip from '../components/StatusChip.jsx';
import {
  useDeleteMerchant,
  useMerchantQuery,
  useUpdateMerchant,
} from '../hooks/useMerchants';
import {
  DOC_KINDS,
  DOC_LABELS,
  useDocSignedUrl,
  useRemoveMerchantDoc,
  useUploadMerchantDoc,
} from '../hooks/useMerchantDocs';
import { MERCHANT_STATUS, ROUTES } from '../utils/constants';

const DOC_SLOTS = [
  { kind: DOC_KINDS.STORE_IMAGE_1, accept: 'image/*' },
  { kind: DOC_KINDS.STORE_IMAGE_2, accept: 'image/*' },
  { kind: DOC_KINDS.PAN, accept: 'image/*,application/pdf' },
  { kind: DOC_KINDS.AADHAAR, accept: 'image/*,application/pdf' },
  { kind: DOC_KINDS.GST, accept: 'image/*,application/pdf' },
];

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
        sx={{ mb: 1, ml: -1 }}
      >
        Back to merchants
      </Button>

      <PageHeader
        title={merchant.store_name}
        subtitle={`${merchant.city}, ${merchant.state}`}
        actions={
          <Stack direction="row" spacing={1} alignItems="center">
            <StatusChip status={merchant.status} />
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(ROUTES.EDIT_MERCHANT(id))}
            >
              Edit
            </Button>
          </Stack>
        }
      />

      <Stack spacing={3}>
        {/* Referral code hero */}
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Referral code
                </Typography>
                <Typography
                  component="code"
                  sx={{
                    display: 'block',
                    fontFamily: 'monospace',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                >
                  {merchant.referral_code}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
                sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
              >
                {copied ? 'Copied' : 'Copy code'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Profile + Danger zone */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h2" sx={{ mb: 2 }}>
                Profile
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  columnGap: 2,
                  rowGap: 2,
                }}
              >
                <Field label="Owner" value={merchant.owner_name || '—'} />
                <Field label="Mobile" value={merchant.mobile} />
                <Field label="Email" value={merchant.email || '—'} />
                <Field label="Address" value={merchant.address || '—'} full />
                <Field label="City" value={merchant.city} />
                <Field label="State" value={merchant.state} />
                <Field label="Pincode" value={merchant.pincode || '—'} />
                <Field
                  label="Created"
                  value={
                    merchant.created_at
                      ? new Date(merchant.created_at).toLocaleString()
                      : '—'
                  }
                />
                <Field
                  label="Description"
                  value={merchant.description || '—'}
                  full
                />
              </Box>

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

          <Card>
            <CardContent>
              <Typography variant="h2" sx={{ mb: 1 }}>
                Danger zone
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Permanently delete this merchant. Uploaded documents are
                removed from the bucket as part of the delete.
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
        </Box>

        {/* Documents */}
        <Card>
          <CardContent>
            <Typography variant="h2" sx={{ mb: 0.5 }}>
              Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              All optional. Store images accept JPG/PNG; PAN, Aadhaar, and GST
              accept images or PDF.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr',
                },
                gap: 2,
              }}
            >
              {DOC_SLOTS.map((slot) => (
                <DocSlot
                  key={slot.kind}
                  merchantId={id}
                  kind={slot.kind}
                  label={DOC_LABELS[slot.kind]}
                  path={merchant[slot.kind]}
                  accept={slot.accept}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

function Field({ label, value, full }) {
  return (
    <Box sx={{ gridColumn: full ? { sm: '1 / -1' } : undefined }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 0.25 }}>
        {value}
      </Typography>
    </Box>
  );
}

function DocSlot({ merchantId, kind, label, path, accept }) {
  const inputRef = useRef(null);
  const upload = useUploadMerchantDoc(merchantId);
  const remove = useRemoveMerchantDoc(merchantId);
  const { data: signedUrl, isLoading: urlLoading } = useDocSignedUrl(path);

  const isImage =
    path && /\.(png|jpe?g|gif|webp|svg|heic|heif)$/i.test(path);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    upload.mutate({ kind, file });
  };

  const errorMsg = upload.error?.message || remove.error?.message;

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">{label}</Typography>

          {path ? (
            <>
              <Box
                sx={{
                  height: 140,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {urlLoading && <CircularProgress size={24} />}
                {!urlLoading && isImage && signedUrl && (
                  <Box
                    component="img"
                    src={signedUrl}
                    alt={label}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                {!urlLoading && !isImage && signedUrl && (
                  <Button
                    component="a"
                    href={signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNewIcon />}
                  >
                    Open file
                  </Button>
                )}
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={() => inputRef.current?.click()}
                  disabled={upload.isPending || remove.isPending}
                >
                  {upload.isPending ? 'Uploading…' : 'Replace'}
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => remove.mutate({ kind, path })}
                  disabled={upload.isPending || remove.isPending}
                >
                  {remove.isPending ? 'Removing…' : 'Remove'}
                </Button>
              </Stack>
            </>
          ) : (
            <Box
              sx={{
                height: 140,
                bgcolor: 'background.default',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => inputRef.current?.click()}
                disabled={upload.isPending}
              >
                {upload.isPending ? 'Uploading…' : 'Upload'}
              </Button>
            </Box>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            hidden
            onChange={handleFile}
          />

          {errorMsg && (
            <Typography variant="caption" color="error">
              {errorMsg}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
