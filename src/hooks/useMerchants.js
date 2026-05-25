import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMerchant,
  deleteMerchant,
  getMerchant,
  listMerchants,
  updateMerchant,
} from '../services/merchants';

const KEYS = {
  list: (params) => ['merchants', 'list', params],
  detail: (id) => ['merchants', id],
};

export function useMerchantsQuery(params) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => listMerchants(params),
    keepPreviousData: true,
  });
}

export function useMerchantQuery(id) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => getMerchant(id),
    enabled: !!id,
  });
}

export function useCreateMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createMerchant,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['merchants'] }),
  });
}

export function useUpdateMerchant(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates) => updateMerchant(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['merchants'] });
      qc.invalidateQueries({ queryKey: KEYS.detail(id) });
    },
  });
}

export function useDeleteMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMerchant,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['merchants'] }),
  });
}
