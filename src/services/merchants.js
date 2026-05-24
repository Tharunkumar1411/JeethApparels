import { supabase } from './supabase';

const TABLE = 'merchants';

function translateError(error) {
  if (error?.code === '23505') {
    return new Error('That referral code is already in use. Try another.');
  }
  return error;
}

export async function listMerchants() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMerchant(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createMerchant(payload) {
  const row = {
    store_name: payload.storeName,
    owner_name: payload.ownerName,
    mobile: payload.mobile,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    pincode: payload.pincode,
    email: payload.email ? payload.email : null,
    description: payload.description ? payload.description : null,
    referral_code: payload.referralCode,
    status: typeof payload.status === 'boolean' ? payload.status : true,
  };
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select()
    .single();
  if (error) throw translateError(error);
  return data;
}

export async function updateMerchant(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw translateError(error);
  return data;
}

export async function deleteMerchant(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
