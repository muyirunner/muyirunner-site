-- Supabase 生产基线对账脚本
-- 项目 ref: bioiuugzafoltdbwzpic
-- 审计时间: 2026-03-17
--
-- 用途：
-- 1. 记录当前线上生产库的真实结构和权限形态
-- 2. 给后续升级提供“生产基线”
--
-- 注意：
-- - 这份脚本以“当前线上真实状态”为准，而不是“安全默认值”
-- - 当前线上 production 中，comments / guestbook 的 RLS 是关闭的
-- - 如果你是初始化一个全新环境，优先使用 supabase-init.sql
-- - 如果你是核对已有环境是否漂移，再参考本文件

-- ========== 线上已存在的额外结构 ==========
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL,
  value jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS site_settings_key_key
  ON public.site_settings USING btree (key);

ALTER TABLE IF EXISTS public.blog_posts
  ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0;

-- ========== 触发器 / 函数 ==========
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.increment_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET likes = likes + 1
  WHERE id = post_id;
END;
$$ language 'plpgsql';

-- ========== RLS：当前生产真实状态 ==========
ALTER TABLE IF EXISTS public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.guestbook DISABLE ROW LEVEL SECURITY;

-- ========== blog_posts policies ==========
DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
CREATE POLICY "Public can read published posts" ON public.blog_posts
  FOR SELECT TO public USING (published = true);

DROP POLICY IF EXISTS "Authenticated users can read all posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can read all posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can insert posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can update posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can delete posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can manage posts" ON public.blog_posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========== comments policies ==========
-- 注意：这些策略在线上存在，但由于当前 RLS 关闭，实际不生效。
DROP POLICY IF EXISTS "Public can read approved comments" ON public.comments;
CREATE POLICY "Public can read approved comments" ON public.comments
  FOR SELECT TO public USING (approved = true);

DROP POLICY IF EXISTS "Authenticated users can read all comments" ON public.comments;
CREATE POLICY "Authenticated users can read all comments" ON public.comments
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;
CREATE POLICY "Anyone can insert comments" ON public.comments
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update comments" ON public.comments;
CREATE POLICY "Authenticated users can update comments" ON public.comments
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete comments" ON public.comments;
CREATE POLICY "Authenticated users can delete comments" ON public.comments
  FOR DELETE TO authenticated USING (true);

-- ========== guestbook policies ==========
-- 注意：这些策略在线上存在，但由于当前 RLS 关闭，实际不生效。
DROP POLICY IF EXISTS "Public can read approved guestbook" ON public.guestbook;
CREATE POLICY "Public can read approved guestbook" ON public.guestbook
  FOR SELECT TO public USING (approved = true);

DROP POLICY IF EXISTS "Authenticated users can read all guestbook entries" ON public.guestbook;
CREATE POLICY "Authenticated users can read all guestbook entries" ON public.guestbook
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can insert guestbook" ON public.guestbook;
CREATE POLICY "Anyone can insert guestbook" ON public.guestbook
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update guestbook entries" ON public.guestbook;
CREATE POLICY "Authenticated users can update guestbook entries" ON public.guestbook
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete guestbook entries" ON public.guestbook;
CREATE POLICY "Authenticated users can delete guestbook entries" ON public.guestbook
  FOR DELETE TO authenticated USING (true);

-- ========== site_settings policies ==========
DROP POLICY IF EXISTS "Allow public read" ON public.site_settings;
CREATE POLICY "Allow public read" ON public.site_settings
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow authenticated write" ON public.site_settings;
CREATE POLICY "Allow authenticated write" ON public.site_settings
  FOR ALL TO public
  USING (auth.role() = 'authenticated'::text)
  WITH CHECK (auth.role() = 'authenticated'::text);
