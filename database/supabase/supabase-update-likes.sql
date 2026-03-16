-- Add 'likes' column to blog_posts
alter table blog_posts 
add column if not exists likes integer default 0;

-- Function to increment likes atomically
create or replace function increment_likes(post_id uuid)
returns void as $$
begin
  update blog_posts
  set likes = likes + 1
  where id = post_id;
end;
$$ language plpgsql;
