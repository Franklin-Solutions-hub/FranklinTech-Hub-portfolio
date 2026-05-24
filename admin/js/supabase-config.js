// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = 'https://fibkvgreggwigrslecjf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpYmt2Z3JlZ2d3aWdyc2xlY2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjY1MzAsImV4cCI6MjA5NTE0MjUzMH0.4kt83lTVVR7lG0GZXu4ThU0-QpFIeOg_nkshaAPwLZw';

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
