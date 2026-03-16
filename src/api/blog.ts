// 博客文章类型定义
export interface BlogPost {
  id: string
  title: string
  description: string
  author: string
  date: string
  category: string
  tags: string[]
  readTime: number
  cover?: string
  file: string
  content?: string // Markdown 内容
}

export interface BlogIndex {
  posts: BlogPost[]
}

/**
 * 获取所有博客文章列表
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/blog-static/posts.json')
    const data: BlogIndex = await response.json()

    // 按日期降序排序
    return data.posts.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  } catch (error) {
    console.error('加载博客文章列表失败:', error)
    return []
  }
}

/**
 * 根据 ID 获取单篇文章
 */
export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts()
    const post = posts.find(p => p.id === id)

    if (!post) {
      return null
    }

    // 加载 Markdown 内容
    const response = await fetch(post.file)
    const content = await response.text()

    return {
      ...post,
      content
    }
  } catch (error) {
    console.error(`加载文章 ${id} 失败:`, error)
    return null
  }
}

/**
 * 按分类筛选文章
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts.filter(post => post.category === category)
}

/**
 * 按标签筛选文章
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts.filter(post => post.tags.includes(tag))
}

/**
 * 搜索文章
 */
export async function searchBlogPosts(keyword: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  const lowerKeyword = keyword.toLowerCase()

  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerKeyword) ||
    post.description.toLowerCase().includes(lowerKeyword) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  )
}

/**
 * 获取所有分类
 */
export async function getCategories(): Promise<string[]> {
  const posts = await getBlogPosts()
  const categories = [...new Set(posts.map(post => post.category))]
  return categories
}

/**
 * 获取所有标签
 */
export async function getTags(): Promise<string[]> {
  const posts = await getBlogPosts()
  const tags = [...new Set(posts.flatMap(post => post.tags))]
  return tags
}
