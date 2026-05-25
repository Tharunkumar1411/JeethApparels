import {
  Alert,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import MerchantForm from '../components/MerchantForm.jsx';
import { useMerchantQuery, useUpdateMerchant } from '../hooks/useMerchants';
import { ROUTES } from '../utils/constants';

export default function EditMerchant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: merchant, isLoading, error } = useMerchantQuery(id);
  const updateMerchant = useUpdateMerchant(id);

  const handleSubmit = async (values) => {
    await updateMerchant.mutateAsync({
      store_name: values.storeName,
      owner_name: values.ownerName,
      mobile: values.mobile,
      address: values.address,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      email: values.email || null,
      description: values.description || null,
      status: values.status,
    });
    navigate(ROUTES.MERCHANT_DETAIL(id));
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
    return <Alert severity="warning">Store not found.</Alert>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(ROUTES.MERCHANT_DETAIL(id))}
        sx={{ mb: 1, ml: -1 }}
      >
        Back to store
      </Button>

      <PageHeader
        title={`Edit ${merchant.store_name}`}
        subtitle="Update the store's profile. Documents and referral code are managed on the detail page."
      />

      <MerchantForm
        merchant={merchant}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.MERCHANT_DETAIL(id))}
      />
    </Box>
  );
}
