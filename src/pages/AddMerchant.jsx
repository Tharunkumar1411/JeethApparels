import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import MerchantForm from '../components/MerchantForm.jsx';
import { useCreateMerchant } from '../hooks/useMerchants';
import { ROUTES } from '../utils/constants';

export default function AddMerchant() {
  const navigate = useNavigate();
  const createMerchant = useCreateMerchant();

  const handleSubmit = async (values) => {
    const created = await createMerchant.mutateAsync(values);
    navigate(ROUTES.MERCHANT_DETAIL(created.id));
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(ROUTES.MERCHANTS)}
        sx={{ mb: 1, ml: -1 }}
      >
        Back to stores
      </Button>

      <PageHeader
        title="Add Store"
        subtitle="Create the store record. Upload documents and view the referral code on the next screen."
      />

      <MerchantForm
        submitLabel="Create store"
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.MERCHANTS)}
      />
    </Box>
  );
}
