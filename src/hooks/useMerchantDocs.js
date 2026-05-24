import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DOC_KINDS,
  DOC_LABELS,
  getMerchantDocSignedUrl,
  removeMerchantDoc,
  uploadMerchantDoc,
} from '../services/storage';

export { DOC_KINDS, DOC_LABELS };

export function useUploadMerchantDoc(merchantId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kind, file }) => uploadMerchantDoc(merchantId, kind, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['merchants', merchantId] });
      qc.invalidateQueries({ queryKey: ['merchants'] });
    },
  });
}

export function useRemoveMerchantDoc(merchantId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kind, path }) => removeMerchantDoc(merchantId, kind, path),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['merchants', merchantId] });
      qc.invalidateQueries({ queryKey: ['merchants'] });
    },
  });
}

export function useDocSignedUrl(path) {
  return useQuery({
    queryKey: ['doc-signed-url', path],
    queryFn: () => getMerchantDocSignedUrl(path),
    enabled: !!path,
    // Signed URL is valid 60 min; refresh slightly before expiry.
    staleTime: 50 * 60 * 1000,
  });
}
