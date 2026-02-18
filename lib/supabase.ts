import { createClient } from '@supabase/supabase-js';

// Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check of Supabase correct is geconfigureerd
export const isConfigured = (): boolean => {
  const configured = !!supabaseUrl && !!supabaseKey;
  if (!configured) {
    console.warn('⚠️ Supabase NOT configured - using localStorage fallback');
  }
  return configured;
};

// Supabase client aanmaken als er env vars zijn
export const supabase = isConfigured()
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : null;



// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// // Debug
// if (import.meta.env.DEV) {
//   console.log('🔍 URL:', supabaseUrl || '❌ NOT SET');
//   console.log('🔍 Key:', supabaseKey ? '✅ SET' : '❌ NOT SET');
// }

// const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
// const finalKey = supabaseKey || 'placeholder-key-placeholder-key-placeholder';

// export const supabase = createClient(finalUrl, finalKey, {
//   auth: { persistSession: false },
// });

// export const isSupabaseConfigured = (): boolean => {
//   const configured = !!(supabaseUrl && supabaseKey && supabaseKey.length > 100);
  
//   if (!configured) {
//     console.warn('⚠️ Supabase NOT configured - using localStorage');
//   } else {
//     console.log('✅ Supabase configured');
//   }
  
//   return configured;
// };




// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// export const supabase = createClient(supabaseUrl, supabaseKey);

// export const isConfigured = () => Boolean(supabaseUrl && supabaseKey);