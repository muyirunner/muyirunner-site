// Supabase 客户端配置
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bioiuugzafoltdbwzpic.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpb2l1dWd6YWZvbHRkYnd6cGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNjA4MDAsImV4cCI6MjA4NTgzNjgwMH0.44-g0xXyWXGjdlaPs5YGCuJ1c-enwRViuMtz3uw_r2I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 类型定义
export interface BlogPost {
    id: string
    title: string
    content: string
    excerpt: string
    cover_image?: string
    category: string
    tags: string[]
    published: boolean
    likes?: number // 新增点赞数字段
    created_at: string
    updated_at: string
    author_id: string
}

export interface Comment {
    id: string
    post_id: string
    author_name: string
    author_email?: string
    content: string
    created_at: string
    approved: boolean
}

export interface GuestbookEntry {
    id: string
    author_name: string
    author_email?: string
    message: string
    created_at: string
    approved: boolean
}

// 博客文章 API
export const blogApi = {
    // 获取所有已发布文章
    async getPosts() {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as BlogPost[]
    },

    // 获取单篇文章
    async getPost(id: string) {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as BlogPost
    },

    // 创建文章（需要认证）
    async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('blog_posts')
            .insert(post)
            .select()
            .single()

        if (error) throw error
        return data as BlogPost
    },

    // 更新文章（需要认证）
    async updatePost(id: string, updates: Partial<BlogPost>) {
        const { data, error } = await supabase
            .from('blog_posts')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as BlogPost
    },

    // 删除文章（需要认证）
    async deletePost(id: string) {
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // 文章点赞
    async incrementLikes(id: string) {
        const { error } = await supabase.rpc('increment_likes', { post_id: id })
        if (error) throw error
    }
}

// 评论 API
export const commentApi = {
    // 获取文章评论
    async getComments(postId: string) {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .eq('approved', true)
            .order('created_at', { ascending: true })

        if (error) throw error
        return data as Comment[]
    },

    // 发表评论
    async createComment(comment: Omit<Comment, 'id' | 'created_at' | 'approved'>) {
        const { data, error } = await supabase
            .from('comments')
            .insert({ ...comment, approved: false })
            .select()
            .single()

        if (error) throw error
        return data as Comment
    },

    // 管理员：获取所有评论（包括未审核）
    async getAllComments() {
        const { data, error } = await supabase
            .from('comments')
            .select('*, blog_posts(title)')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as (Comment & { blog_posts: { title: string } })[]
    },

    // 管理员：更新评论状态
    async updateComment(id: string, updates: Partial<Comment>) {
        const { data, error } = await supabase
            .from('comments')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Comment
    },

    // 管理员：删除评论
    async deleteComment(id: string) {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}

// 留言板 API
export const guestbookApi = {
    // 获取留言
    async getEntries() {
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .eq('approved', true)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as GuestbookEntry[]
    },

    // 发表留言
    async createEntry(entry: Omit<GuestbookEntry, 'id' | 'created_at' | 'approved'>) {
        const { data, error } = await supabase
            .from('guestbook')
            .insert({ ...entry, approved: false })
            .select()
            .single()

        if (error) throw error
        return data as GuestbookEntry
    },

    // 管理员：获取所有留言（包括未审核）
    async getAllEntries() {
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as GuestbookEntry[]
    },

    // 管理员：更新留言状态
    async updateEntry(id: string, updates: Partial<GuestbookEntry>) {
        const { data, error } = await supabase
            .from('guestbook')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as GuestbookEntry
    },

    // 管理员：删除留言
    async deleteEntry(id: string) {
        const { error } = await supabase
            .from('guestbook')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}

// 认证 API
export const authApi = {
    // 登录
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error
        return data
    },

    // 登出
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // 获取当前用户
    async getUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },

    // 监听认证状态变化
    onAuthStateChange(callback: (event: string, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback)
    }
}

// 壁纸配置 API - 全局设置，所有用户可见
export const wallpaperApi = {
    // 获取全局壁纸配置
    async getConfig() {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'wallpaper_config')
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data?.value || null
    },

    // 保存全局壁纸配置 (需要管理员权限)
    async saveConfig(config: any) {
        const { data: existing } = await supabase
            .from('site_settings')
            .select('id')
            .eq('key', 'wallpaper_config')
            .single()

        if (existing) {
            // 更新现有配置
            const { error } = await supabase
                .from('site_settings')
                .update({ value: config, updated_at: new Date().toISOString() })
                .eq('key', 'wallpaper_config')

            if (error) throw error
        } else {
            // 创建新配置
            const { error } = await supabase
                .from('site_settings')
                .insert({ key: 'wallpaper_config', value: config })

            if (error) throw error
        }
    }
}

