// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = 'https://fibkvgreggwigrslecjf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jqafAyz4A5S5TdSZUoY5sg_-7Euic7t';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
