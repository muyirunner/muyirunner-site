export interface BlogPost {
  id: string
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  readTime: number  // 分钟
  cover?: string  // 封面图片
  content: string  // Markdown 内容或文件路径
  published: boolean
}

export interface BlogCategory {
  name: string
  count: number
  color?: string
}
