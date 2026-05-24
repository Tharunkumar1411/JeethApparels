import { supabase } from './supabase';
import { generateReferralCode } from '../utils/referralCode';

const TABLE = 'merchants';

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
    mobile: payload.mobile,
    city: payload.city,
    state: payload.state,
    email: payload.email ? payload.email : null,
    description: payload.description ? payload.description : null,
    referral_code:
      payload.referralCode || generateReferralCode(payload.storeName),
    status: typeof payload.status === 'boolean' ? payload.status : true,
  };
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMerchant(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMerchant(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
