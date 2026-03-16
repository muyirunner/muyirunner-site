-- Supabase 数据库初始化脚本
-- 在 Supabase SQL Editor 中运行此脚本
-- 用途：为全新环境提供“安全默认值”初始化。
-- 说明：线上生产库的当前真实状态另见：
-- database/supabase/supabase-production-baseline-2026-03-17.sql
-- 其中 comments / guestbook 的 RLS 状态与本初始化脚本不同。

-- 1. 创建博客文章表
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  category TEXT DEFAULT '技术',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id)
);

-- 2. 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved BOOLEAN DEFAULT false
);

-- 3. 创建留言板表
CREATE TABLE IF NOT EXISTS guestbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved BOOLEAN DEFAULT false
);

-- 4. 创建站点配置表
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS site_settings_key_key
  ON site_settings (key);

-- 5. 启用 RLS（行级安全）
-- 注意：这里保留“安全默认值”，即所有对外表默认启用 RLS。
-- 线上生产库当前仅对 blog_posts / site_settings 启用了 RLS，
-- comments / guestbook 的当前生产状态请参考 production baseline 文件。
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 6. 博客文章策略
-- 所有人可以读取已发布的文章
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (published = true);

-- 认证用户可以读取所有文章（包括未发布的）
CREATE POLICY "Authenticated users can read all posts" ON blog_posts
  FOR SELECT TO authenticated USING (true);

-- 认证用户可以创建、更新、删除文章
CREATE POLICY "Authenticated users can insert posts" ON blog_posts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts" ON blog_posts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete posts" ON blog_posts
  FOR DELETE TO authenticated USING (true);

-- 7. 评论策略
-- 所有人可以读取已审核的评论
CREATE POLICY "Public can read approved comments" ON comments
  FOR SELECT USING (approved = true);

-- 认证用户可以读取所有评论
CREATE POLICY "Authenticated users can read all comments" ON comments
  FOR SELECT TO authenticated USING (true);

-- 所有人可以发表评论
CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- 认证用户可以更新、删除评论
CREATE POLICY "Authenticated users can update comments" ON comments
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete comments" ON comments
  FOR DELETE TO authenticated USING (true);

-- 8. 留言板策略
-- 所有人可以读取已审核的留言
CREATE POLICY "Public can read approved guestbook" ON guestbook
  FOR SELECT USING (approved = true);

-- 认证用户可以读取所有留言
CREATE POLICY "Authenticated users can read all guestbook entries" ON guestbook
  FOR SELECT TO authenticated USING (true);

-- 所有人可以发表留言
CREATE POLICY "Anyone can insert guestbook" ON guestbook
  FOR INSERT WITH CHECK (true);

-- 认证用户可以更新、删除留言
CREATE POLICY "Authenticated users can update guestbook entries" ON guestbook
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete guestbook entries" ON guestbook
  FOR DELETE TO authenticated USING (true);

-- 9. 站点配置策略
-- 所有人可读取公开配置（例如壁纸配置）
CREATE POLICY "Allow public read" ON site_settings
  FOR SELECT TO public USING (true);

-- 已认证用户可维护配置
CREATE POLICY "Allow authenticated write" ON site_settings
  FOR ALL TO public
  USING (auth.role() = 'authenticated'::text)
  WITH CHECK (auth.role() = 'authenticated'::text);

-- 10. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
