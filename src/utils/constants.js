export const ROUTES = {
  LOGIN: '/login',
  MERCHANTS: '/merchants',
  ADD_MERCHANT: '/merchants/new',
  MERCHANT_DETAIL: (id = ':id') => `/merchants/${id}`,
};

export const MERCHANT_STATUS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];
