import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '../components/PageHeader.jsx';
import StatusChip from '../components/StatusChip.jsx';
import { useMerchantsQuery } from '../hooks/useMerchants';
import { ROUTES } from '../utils/constants';

export default function MerchantList() {
  const navigate = useNavigate();
  const { data: merchants, isLoading, error } = useMerchantsQuery();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!merchants) return [];
    const q = search.trim().toLowerCase();
    if (!q) return merchants;
    return merchants.filter((m) =>
      [m.store_name, m.owner_name, m.mobile, m.city, m.state, m.email, m.referral_code]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [merchants, search]);

  return (
    <Box>
      <PageHeader
        title="Stores"
        subtitle="Manage stores and their referral codes"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(ROUTES.ADD_MERCHANT)}
          >
            Add Store
          </Button>
        }
      />

      <Card sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            placeholder="Search by store, owner, mobile, city, or code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error.message}</Alert>}

        {!isLoading && !error && (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Store</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Referral</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ py: 4 }}
                      >
                        No stores found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((m) => (
                  <TableRow
                    key={m.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(ROUTES.MERCHANT_DETAIL(m.id))}
                  >
                    <TableCell>{m.store_name}</TableCell>
                    <TableCell>{m.owner_name || '—'}</TableCell>
                    <TableCell>{m.mobile}</TableCell>
                    <TableCell>{m.city}</TableCell>
                    <TableCell>{m.state}</TableCell>
                    <TableCell>
                      <Typography
                        component="code"
                        sx={{
                          fontFamily: 'monospace',
                          bgcolor: 'background.default',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                        }}
                      >
                        {m.referral_code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={m.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
}
