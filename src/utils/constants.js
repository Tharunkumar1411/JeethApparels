export const ROUTES = {
  LOGIN: '/login',
  MERCHANTS: '/stores',
  ADD_MERCHANT: '/stores/new',
  MERCHANT_DETAIL: (id = ':id') => `/stores/${id}`,
  EDIT_MERCHANT: (id = ':id') => `/stores/${id}/edit`,
};

export const MERCHANT_STATUS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];
