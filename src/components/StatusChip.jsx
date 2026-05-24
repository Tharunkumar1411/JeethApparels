import { Chip } from '@mui/material';

export default function StatusChip({ status }) {
  const active = status === true;
  return (
    <Chip
      size="small"
      color={active ? 'success' : 'default'}
      label={active ? 'Active' : 'Inactive'}
    />
  );
}
