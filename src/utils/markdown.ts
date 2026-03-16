import { marked } from 'marked'
import hljs from 'highlight.js'

// 配置 marked
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('代码高亮失败:', err)
      }
    }
    return hljs.highlightAuto(code).value
  },
  langPrefix: 'hljs language-',
  breaks: true, // 支持 GitHub Flavored Markdown 的换行
  gfm: true
})

/**
 * 将 Markdown 转换为 HTML
 */
export function renderMarkdown(markdown: string): string {
  try {
    return marked(markdown) as string
  } catch (error) {
    console.error('Markdown 渲染失败:', error)
    return '<p>内容加载失败</p>'
  }
}

/**
 * 从 Markdown 中提取标题列表（用于目录）
 */
export interface Heading {
  level: number
  text: string
  id: string
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')

    headings.push({ level, text, id })
  }

  return headings
}

/**
 * 为 Markdown 的标题添加 ID（用于锚点跳转）
 */
export function addHeadingIds(html: string): string {
  return html.replace(
    /<h([1-6])>(.+?)<\/h\1>/g,
    (match, level, text) => {
      const id = text
        .toLowerCase()
        .replace(/<[^>]+>/g, '') // 移除 HTML 标签
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')

      return `<h${level} id="${id}">${text}</h${level}>`
    }
  )
}

/**
 * 估算阅读时间（分钟）
 */
export function estimateReadTime(markdown: string): number {
  // 移除代码块
  const textOnly = markdown.replace(/```[\s\S]*?```/g, '')

  // 中文字符数
  const chineseChars = (textOnly.match(/[\u4e00-\u9fa5]/g) || []).length

  // 英文单词数
  const englishWords = textOnly
    .replace(/[\u4e00-\u9fa5]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0).length

  // 中文阅读速度: 400字/分钟
  // 英文阅读速度: 200词/分钟
  const readTime = Math.ceil(chineseChars / 400 + englishWords / 200)

  return Math.max(1, readTime) // 最少 1 分钟
}
