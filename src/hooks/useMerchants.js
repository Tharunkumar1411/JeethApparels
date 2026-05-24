import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMerchant,
  deleteMerchant,
  getMerchant,
  listMerchants,
  updateMerchant,
} from '../services/merchants';

const KEYS = {
  all: ['merchants'],
  detail: (id) => ['merchants', id],
};

export function useMerchantsQuery() {
  return useQuery({ queryKey: KEYS.all, queryFn: listMerchants });
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
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateMerchant(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates) => updateMerchant(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      qc.invalidateQueries({ queryKey: KEYS.detail(id) });
    },
  });
}

export function useDeleteMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMerchant,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
