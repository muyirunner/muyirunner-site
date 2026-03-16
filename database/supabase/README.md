# Supabase SQL 说明

这份目录现在区分了两类内容：

- `supabase-init.sql`
  用于全新环境初始化，采用更安全的默认值。
- `supabase-production-baseline-2026-03-17.sql`
  用于记录线上生产环境在 2026-03-17 审计到的真实状态。
- `supabase-update-likes.sql`
  旧环境补 `likes` 字段时可单独执行的补丁。

## 已确认的线上生产状态

当前线上 production 已确认包含：

- `public.blog_posts`
- `public.comments`
- `public.guestbook`
- `public.site_settings`
- `public.increment_likes(post_id uuid)`
- `public.update_updated_at_column()`
- `blog_posts` 上的 `update_blog_posts_updated_at` 触发器
- `site_settings.key` 的唯一索引

当前线上 `site_settings` 中已存在：

- `wallpaper_config`

Storage 当前至少包含 1 个 bucket。

## 当前最重要的漂移点

### 1. `site_settings` 曾在线上存在，但仓库初始化脚本未覆盖

这个问题现在已经补进 `supabase-init.sql`。

### 2. comments / guestbook 的 RLS 状态与仓库初始化脚本不同

线上 production 当前状态：

- `blog_posts`: RLS 已启用
- `site_settings`: RLS 已启用
- `comments`: RLS 未启用
- `guestbook`: RLS 未启用

仓库初始化脚本当前状态：

- 四张表都默认启用 RLS

这是一个刻意保留的区分：

- `supabase-init.sql` 代表全新环境的“安全默认值”
- `supabase-production-baseline-2026-03-17.sql` 代表“线上当前真实值”

不要把这两者混为一谈。

## 风险说明

线上 production 中，`comments` 和 `guestbook` 的 policy 虽然存在，但由于 RLS 关闭，策略本身并不生效。

这意味着：

- 前端代码层面的 `approved = true` 过滤仍在工作
- 但从数据库安全边界上看，生产环境比仓库中的安全默认值更宽松

后续如果要做安全收敛，应该单独做一次“启用 comments / guestbook RLS”的迁移，而不是在常规功能升级时顺手修改。

## 以后升级的推荐顺序

1. 先核对线上 schema 与本目录的 production baseline 是否一致。
2. 如果是全新环境，用 `supabase-init.sql`。
3. 如果是已有环境升级，先写增量 migration，不要直接拿 init 覆盖线上。
4. 涉及 RLS 的变更必须单独说明并单独验证。
