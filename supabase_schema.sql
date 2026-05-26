-- ============================================
-- FranklinTech Hub Portfolio - Supabase Schema
-- ============================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fibkvgreggwigrslecjf/sql/new

-- 1. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT '',
  techs TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  github_url TEXT DEFAULT '',
  demo_url TEXT DEFAULT '',
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  category TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  tags TEXT[] DEFAULT '{}',
  date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  proficiency INT DEFAULT 50,
  category TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. EXPERIENCE
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT DEFAULT '',
  period TEXT DEFAULT '',
  description TEXT DEFAULT '',
  techs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '🛠️',
  price TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  text TEXT DEFAULT '',
  rating INT DEFAULT 5,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender TEXT NOT NULL,
  email TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  body TEXT DEFAULT '',
  time TIMESTAMPTZ DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SITE SETTINGS (key-value store for hero, social, seo, appearance, about)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. MEDIA
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  size INT DEFAULT 0,
  type TEXT DEFAULT '',
  data TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (portfolio is public)
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read media" ON media FOR SELECT USING (true);

-- Authenticated insert/update/delete access (requires Supabase Auth session)
CREATE POLICY "Anon insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anon update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anon delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anon insert blog_posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anon update blog_posts" ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anon delete blog_posts" ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anon insert skills" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anon update skills" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anon delete skills" ON skills FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anon insert experience" ON experience FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anon update experience" ON experience FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anon delete experience" ON experience FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anon insert services" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anon update services" ON services FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anon delete services" ON services FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anon insert testimonials" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anon update testimonials" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anon delete testimonials" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anon insert messages" ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anon update messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anon delete messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anon insert site_settings" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anon update site_settings" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anon delete site_settings" ON site_settings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Anon insert media" ON media FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Anon update media" ON media FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anon delete media" ON media FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
