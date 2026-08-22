import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  (import.meta.env.MODE === 'test' ? 'https://mock.supabase.co' : undefined)
const SUPABASE_ANON =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (import.meta.env.MODE === 'test' ? 'mock-anon-key' : undefined)

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env and fill in your Supabase project credentials.',
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
