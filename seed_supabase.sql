-- ============================================
-- FranklinTech Hub Portfolio - Seed Data
-- ============================================
-- Run this AFTER supabase_schema.sql
-- https://supabase.com/dashboard/project/fibkvgreggwigrslecjf/sql/new

-- PROJECTS
INSERT INTO projects (title, description, category, techs, status, featured, github_url, demo_url, date) VALUES
('ADEOTABLS Dashboard', 'Admin dashboard for managing tables and data with modern UI.', 'Web App', ARRAY['React','Node.js','MongoDB'], 'published', true, '#', '#', '2024-01-15'),
('Portfolio Website', 'Personal portfolio with dark mode, animations, and responsive design.', 'Website', ARRAY['HTML','CSS','JavaScript'], 'published', true, '#', '#', '2024-03-20'),
('E-Commerce Platform', 'Full-featured online store with payment integration and admin panel.', 'Web App', ARRAY['PHP','MySQL','Bootstrap'], 'draft', false, '#', '#', '2024-06-10');

-- SKILLS
INSERT INTO skills (name, proficiency, category) VALUES
('HTML & CSS', 90, 'Frontend'),
('JavaScript', 78, 'Frontend'),
('React', 70, 'Frontend'),
('Node.js', 72, 'Backend'),
('PHP', 65, 'Backend'),
('MySQL', 80, 'Backend'),
('Troubleshooting', 92, 'IT Support'),
('Networking', 80, 'IT Support');

-- EXPERIENCE
INSERT INTO experience (role, company, period, description, techs) VALUES
('IT Support Intern', 'Kings University College', '2023 – 2024', 'Provided first-line technical support. Managed network infrastructure.', ARRAY['Windows Server','Networking','Hardware']),
('Freelance Web Developer', 'Self-Employed', '2022 – Present', 'Built websites and web applications for local businesses.', ARRAY['React','Node.js','WordPress']);

-- SERVICES
INSERT INTO services (title, description, icon, price) VALUES
('Web Development', 'Custom websites and web applications built with modern technologies.', '🌐', 'From $500'),
('IT Support', 'Technical troubleshooting, system setup, and maintenance.', '🔧', 'From $50/hr'),
('Digital Marketing', 'SEO, social media management, and online advertising campaigns.', '📣', 'From $300/mo');

-- TESTIMONIALS
INSERT INTO testimonials (name, role, text, rating, approved) VALUES
('John Mensah', 'CEO, TechGh', 'Franklin built an amazing website for our company. Highly professional!', 5, true),
('Ama Serwaa', 'Marketing Director', 'Great digital marketing skills. Our online presence improved significantly.', 4, true);

-- MESSAGES
INSERT INTO messages (sender, email, subject, body, time, is_read) VALUES
('James Owusu', 'james@example.com', 'Project Inquiry', 'Hi Franklin, I need a website for my business. Can we discuss?', now() - interval '1 hour', false),
('Sarah Addo', 'sarah@example.com', 'Collaboration', 'I saw your portfolio and would love to collaborate on a project.', now() - interval '1 day', true);

-- BLOG POSTS
INSERT INTO blog_posts (title, content, category, status, tags, date) VALUES
('Getting Started with React', 'React is a powerful JavaScript library for building user interfaces...', 'Technology', 'published', ARRAY['react','javascript','frontend'], '2024-05-10');

-- SITE SETTINGS
INSERT INTO site_settings (key, value) VALUES
('hero', '{"title":"Franklin","subtitle":"Agamah","subtitle2":"Tornyeli","roles":["Software Developer","IT Specialist","Digital Marketer","Problem Solver"],"bio":"Computer Science graduate passionate about building innovative digital solutions.","stats":[{"label":"Years Exp","value":3},{"label":"Projects","value":12},{"label":"Clients","value":20}]}'),
('social', '{"github":"#","linkedin":"#","whatsapp":"#","twitter":"#","email":"franklinagamah@gmail.com","youtube":""}'),
('seo', '{"title":"Franklin Agamah Tornyeli | Software Developer","description":"Professional portfolio of Franklin Agamah Tornyeli.","keywords":"software developer, IT support, Ghana, portfolio"}'),
('about', '{"bio":"I''m a Computer Science graduate from Ghana with a deep passion for building elegant software solutions.","objective":"To leverage my skills in software development and IT support to drive digital innovation.","education":[{"degree":"BSc Computer Science","school":"Kings University College","year":"2020–2024"}],"certifications":["Google IT Support Professional Certificate"],"hobbies":["Reading","Football","Music","Open Source","Tech Innovation"]}'),
('appearance', '{"theme":"dark","accentColor":"#2563eb","font":"Inter"}');
