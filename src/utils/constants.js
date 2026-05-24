export const ROUTES = {
  LOGIN: '/login',
  MERCHANTS: '/merchants',
  ADD_MERCHANT: '/merchants/new',
  MERCHANT_DETAIL: (id = ':id') => `/merchants/${id}`,
  EDIT_MERCHANT: (id = ':id') => `/merchants/${id}/edit`,
};

export const MERCHANT_STATUS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];
