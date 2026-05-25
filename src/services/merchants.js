import { supabase } from './supabase';
import { generateReferralCode } from '../utils/referralCode';

const TABLE = 'merchants';
const MAX_REFERRAL_RETRIES = 5;

// Columns that admins can filter on in the list view.
const FILTERABLE_COLUMNS = new Set([
  'store_name',
  'owner_name',
  'mobile',
  'city',
  'referral_code',
]);

const SORTABLE_COLUMNS = new Set(['created_at', 'updated_at']);

function translateError(error) {
  if (error?.code === '23505') {
    const msg = error.message || '';
    if (/referral_code/i.test(msg)) {
      return new Error(
        'A referral code collided. Try again — the next attempt will generate a new one.'
      );
    }
    if (/mobile/i.test(msg)) {
      return new Error(
        'That mobile number is already used by another active store.'
      );
    }
    return new Error('A unique field collided. Try different inputs.');
  }
  return error;
}

export async function listMerchants({
  page = 0,
  pageSize = 20,
  filters = {},
  sortBy = 'created_at',
  sortDir = 'desc',
  status, // true | false | undefined (all)
} = {}) {
  const safeSortBy = SORTABLE_COLUMNS.has(sortBy) ? sortBy : 'created_at';
  const safeSortDir = sortDir === 'asc' ? 'asc' : 'desc';

  let query = supabase.from(TABLE).select('*', { count: 'exact' });

  if (typeof status === 'boolean') {
    query = query.eq('status', status);
  }

  for (const [col, raw] of Object.entries(filters)) {
    const val = (raw ?? '').toString().trim();
    if (!val || !FILTERABLE_COLUMNS.has(col)) continue;
    query = query.ilike(col, `%${val}%`);
  }

  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.order(safeSortBy, { ascending: safeSortDir === 'asc' }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0 };
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
  const baseRow = {
    store_name: payload.storeName,
    owner_name: payload.ownerName,
    mobile: payload.mobile,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    pincode: payload.pincode,
    email: payload.email ? payload.email : null,
    description: payload.description ? payload.description : null,
    status: typeof payload.status === 'boolean' ? payload.status : true,
  };

  for (let attempt = 0; attempt < MAX_REFERRAL_RETRIES; attempt++) {
    const row = {
      ...baseRow,
      referral_code: generateReferralCode(payload.storeName),
    };
    const { data, error } = await supabase
      .from(TABLE)
      .insert(row)
      .select()
      .single();

    if (!error) return data;
    // 23505 with referral_code → retry; with any other unique constraint → translate.
    if (error.code === '23505' && /referral_code/i.test(error.message)) continue;
    throw translateError(error);
  }

  throw new Error(
    'Could not generate a unique referral code after several attempts'
  );
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
  // Remove all uploaded documents for this merchant from storage first.
  // If listing/removing fails we still try the row delete — orphaned files
  // are a smaller problem than a half-deleted record.
  const { data: files } = await supabase.storage
    .from('merchant-docs')
    .list(id);
  if (files && files.length > 0) {
    const paths = files.map((f) => `${id}/${f.name}`);
    await supabase.storage.from('merchant-docs').remove(paths);
  }

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
