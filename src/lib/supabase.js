import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  url &&
  key &&
  !url.includes('YOUR_PROJECT_ID') &&
  !url.includes('your_project_id') &&
  !key.includes('YOUR_SUPABASE') &&
  !key.includes('your_publishable_key_here') &&
  !key.includes('YOUR_PUBLISHABLE_KEY') &&
  key.trim().length > 10
);

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export async function testSupabaseConnection() {
  if (!url) {
    return {
      connected: false,
      reason: 'VITE_SUPABASE_URL is missing'
    };
  }

  if (!key || key.includes('your_publishable_key_here')) {
    return {
      connected: false,
      reason: 'VITE_SUPABASE_PUBLISHABLE_KEY is missing or contains placeholder value'
    };
  }

  if (!supabase) {
    return {
      connected: false,
      reason: 'Supabase client failed to initialize'
    };
  }

  try {
    // Try pinging a lightweight table or auth endpoint
    const { data, error } = await supabase.from('store_settings').select('id').limit(1);
    if (error) {
      return {
        connected: false,
        error: error.message,
        hint: error.hint || error.details,
        code: error.code
      };
    }
    return {
      connected: true,
      data
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message || 'Connection failed'
    };
  }
}
