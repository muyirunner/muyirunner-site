// 使用静态 Markdown 文件的博客系统
// 文章存储在 /public/blog/posts/ 目录
// 元数据存储在 /public/blog/posts.json

import { getBlogPosts } from '@/api/blog'
import type { BlogPost } from '@/api/blog'

// 导出博客文章数据（异步加载）
export async function getAll(): Promise<BlogPost[]> {
  return await getBlogPosts()
}

// 导出分类统计
export const blogCategories = [
  { name: '技术', count: 1, color: '#3B82F6' },
  { name: '跑步', count: 1, color: '#10B981' },
  { name: '随笔', count: 1, color: '#F59E0B' }
]

// 为了兼容旧代码，保留同步导出（使用默认数据）
export const blogPosts: BlogPost[] = []
