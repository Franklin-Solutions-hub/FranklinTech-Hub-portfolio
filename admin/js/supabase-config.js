// ===== SUPABASE CONFIGURATION =====
let supabase;

window.initSupabase = async function() {
  if (supabase) return;
  const res = await fetch('/api/config');
  if (!res.ok) throw new Error('Failed to fetch config: ' + res.status);
  const config = await res.json();
  if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase credentials in server config. Check your .env file.');
  }
  supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
};

// Table name mapping from old localStorage keys to Supabase tables
const TABLE_MAP = {
  projects: 'projects',
  blog: 'blog_posts',
  skills: 'skills',
  experience: 'experience',
  services: 'services',
  testimonials: 'testimonials',
  messages: 'messages',
  media: 'media'
};

// Settings stored as key-value pairs in site_settings table
const SETTINGS_KEYS = ['hero', 'social', 'seo', 'appearance', 'about'];
