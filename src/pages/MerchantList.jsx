import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../components/PageHeader.jsx';
import StatusChip from '../components/StatusChip.jsx';
import { useMerchantsQuery } from '../hooks/useMerchants';
import { ROUTES } from '../utils/constants';

const EMPTY_FILTERS = {
  store_name: '',
  owner_name: '',
  mobile: '',
  city: '',
  referral_code: '',
};

const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest first' },
  { value: 'created_at:asc', label: 'Oldest first' },
  { value: 'updated_at:desc', label: 'Recently updated' },
  { value: 'updated_at:asc', label: 'Least recently updated' },
];

function formatDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString();
}

export default function MerchantList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0); // 0 = Active, 1 = Inactive
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [debouncedFilters, setDebouncedFilters] = useState(EMPTY_FILTERS);
  const [sortValue, setSortValue] = useState('created_at:desc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(t);
  }, [filters]);

  // Reset to page 0 when anything that changes the result set changes.
  useEffect(() => {
    setPage(0);
  }, [tab, debouncedFilters, sortValue, pageSize]);

  const [sortBy, sortDir] = sortValue.split(':');
  const status = tab === 0;

  const params = useMemo(
    () => ({ page, pageSize, filters: debouncedFilters, sortBy, sortDir, status }),
    [page, pageSize, debouncedFilters, sortBy, sortDir, status]
  );

  const { data, isLoading, isFetching, error } = useMerchantsQuery(params);
  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const handleFilter = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

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
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Active" />
          <Tab label="Inactive" />
        </Tabs>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(5, 1fr)',
            },
            gap: 1.5,
            mb: 2,
          }}
        >
          <TextField
            size="small"
            label="Store name"
            value={filters.store_name}
            onChange={handleFilter('store_name')}
          />
          <TextField
            size="small"
            label="Owner"
            value={filters.owner_name}
            onChange={handleFilter('owner_name')}
          />
          <TextField
            size="small"
            label="Mobile"
            value={filters.mobile}
            onChange={handleFilter('mobile')}
            inputProps={{ inputMode: 'numeric' }}
          />
          <TextField
            size="small"
            label="City"
            value={filters.city}
            onChange={handleFilter('city')}
          />
          <TextField
            size="small"
            label="Referral code"
            value={filters.referral_code}
            onChange={handleFilter('referral_code')}
          />
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ sm: 'center' }}
          sx={{ mb: 2 }}
        >
          <Typography variant="caption" color="text.secondary">
            {isFetching ? 'Loading…' : `${total} store${total === 1 ? '' : 's'}`}
          </Typography>
          <TextField
            select
            size="small"
            label="Sort"
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
            sx={{ minWidth: 220 }}
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

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
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No stores found.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {rows.map((m) => (
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
                  <TableCell>{formatDate(m.created_at)}</TableCell>
                  <TableCell>{formatDate(m.updated_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => setPageSize(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[20, 40, 60]}
        />
      </Card>
    </Box>
  );
}
