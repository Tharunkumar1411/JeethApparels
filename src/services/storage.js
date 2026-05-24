import { supabase } from './supabase';

const BUCKET = 'merchant-docs';
const TABLE = 'merchants';

// Column names on the merchants table that hold a storage path.
export const DOC_KINDS = {
  STORE_IMAGE_1: 'store_image_1',
  STORE_IMAGE_2: 'store_image_2',
  PAN: 'pan_doc',
  AADHAAR: 'aadhaar_doc',
  GST: 'gst_doc',
};

export const DOC_LABELS = {
  store_image_1: 'Store image 1',
  store_image_2: 'Store image 2',
  pan_doc: 'PAN',
  aadhaar_doc: 'Aadhaar',
  gst_doc: 'GST certificate',
};

export async function uploadMerchantDoc(merchantId, kind, file) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${merchantId}/${kind}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (uploadError) throw uploadError;

  const { data, error: updateError } = await supabase
    .from(TABLE)
    .update({ [kind]: path })
    .eq('id', merchantId)
    .select()
    .single();
  if (updateError) throw updateError;
  return data;
}

export async function removeMerchantDoc(merchantId, kind, path) {
  if (path) {
    await supabase.storage.from(BUCKET).remove([path]);
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update({ [kind]: null })
    .eq('id', merchantId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMerchantDocSignedUrl(path, expiresIn = 3600) {
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
