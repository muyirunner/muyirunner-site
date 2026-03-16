<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-bg">
    <!-- 阅读进度条 -->
    <div class="fixed top-0 left-0 right-0 z-[60] h-1">
      <div
        class="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-150 ease-out"
        :style="{ width: `${readingProgress}%` }"
      ></div>
    </div>

    <!-- 顶部导航 -->
    <nav class="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/blog" class="flex items-center gap-3 group">
            <svg class="w-5 h-5 text-gray-500 group-hover:text-gradient-start transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gradient-start transition-colors">返回博客</span>
          </router-link>

          <div class="flex items-center gap-6">
            <router-link to="/" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gradient-start transition-colors">主页</router-link>
            <router-link to="/blog" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gradient-start transition-colors">博客</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 加载中 -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <div class="text-center">
        <div class="w-12 h-12 border-3 border-gradient-start/30 border-t-gradient-start rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-gray-500">加载文章中...</p>
      </div>
    </div>

    <!-- 文章不存在 -->
    <div v-else-if="!post" class="flex items-center justify-center py-32">
      <div class="text-center">
        <div class="text-6xl mb-4">📄</div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">文章不存在</h2>
        <p class="text-gray-500 mb-6">这篇文章可能已被删除或链接错误</p>
        <router-link to="/blog" class="btn-neon !rounded-xl">返回博客</router-link>
      </div>
    </div>

    <!-- 文章内容 (带 TOC) -->
    <div v-else class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex gap-8">
        <!-- 主内容区 -->
        <article class="flex-1 min-w-0 max-w-4xl">
          <!-- 封面图 -->
          <div v-if="post.cover_image" class="aspect-video rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <img :src="post.cover_image" :alt="post.title" class="w-full h-full object-cover" loading="lazy" />
          </div>

          <!-- 文章头部 -->
          <header class="mb-12">
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <span class="px-4 py-1 rounded-full text-sm font-medium bg-gradient-primary text-white">
                {{ post.category }}
              </span>
              <span class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</span>
            </div>

            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {{ post.title }}
            </h1>

            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="px-3 py-1 rounded-full text-sm glass-subtle text-gray-600 dark:text-gray-400"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- 作者信息 + 阅读时间 -->
            <div class="flex items-center gap-4 p-4 glass rounded-2xl border border-white/10">
              <div class="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow-purple/30">
                杨
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 dark:text-white">杨汶川</h4>
                <p class="text-sm text-gray-500">全栈开发者 · 技术博主</p>
              </div>
              <div class="text-sm text-gray-400 flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                约 {{ estimatedReadTime }} 分钟
              </div>
            </div>
          </header>

          <!-- 文章正文 -->
          <div class="prose prose-lg dark:prose-invert max-w-none mb-16">
            <div v-html="renderedContent" class="article-content"></div>
          </div>



          <!-- 点赞按钮 -->
          <div class="flex justify-center mb-16">
            <button
              @click="handleClap"
              :disabled="clapped"
              class="group relative px-8 py-4 rounded-full bg-white dark:bg-white/5 border border-purple-500/30 hover:border-purple-500 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-80 disabled:cursor-default"
            >
              <div class="flex items-center gap-3">
                <span class="text-3xl transform group-hover:scale-110 transition-transform duration-300">👏</span>
                <span class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                  {{ likes }}
                </span>
              </div>
              
              <!-- 粒子动画效果 -->
              <div v-if="showClapAnimation" class="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none">
                <span class="text-2xl font-bold text-purple-500 animate-float-up">+1</span>
              </div>
            </button>
          </div>

          <!-- 分隔线 -->
          <div class="h-px bg-gradient-to-r from-transparent via-gradient-start to-transparent mb-16"></div>

          <!-- 评论区 -->
          <section id="comments">
            <h2 class="text-2xl font-bold gradient-text mb-8 flex items-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              评论交流
            </h2>

            <!-- 评论表单 -->
            <div class="glass rounded-2xl p-6 border border-white/10 mb-8">
              <form @submit.prevent="submitComment" class="space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                  <input
                    v-model="newComment.author_name"
                    type="text"
                    required
                    placeholder="你的昵称 *"
                    class="px-4 py-3 rounded-xl glass border border-white/10 bg-transparent outline-none focus:border-gradient-start/50 transition-all"
                  />
                  <input
                    v-model="newComment.author_email"
                    type="email"
                    placeholder="邮箱（可选）"
                    class="px-4 py-3 rounded-xl glass border border-white/10 bg-transparent outline-none focus:border-gradient-start/50 transition-all"
                  />
                </div>
                
                <div class="relative">
                  <div class="flex justify-between items-center mb-2 px-1">
                     <span class="text-sm text-gray-500"></span>
                     <button 
                        type="button"
                        @click="handleGenerateComment"
                        :disabled="generatingComment"
                        class="text-xs font-medium text-purple-500 hover:text-purple-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-500/10"
                    >
                        <span v-if="generatingComment" class="animate-spin">⏳</span>
                        <span v-else>✨</span>
                        AI 帮我写
                    </button>
                  </div>
                  <textarea
                    v-model="newComment.content"
                    required
                    rows="4"
                    placeholder="分享你的想法..."
                    class="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-transparent outline-none focus:border-gradient-start/50 transition-all resize-none"
                  ></textarea>
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="submittingComment"
                    class="btn-neon !rounded-xl !px-6 flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg v-if="!submittingComment" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    发表评论
                  </button>
                </div>
              </form>

              <div v-if="commentSuccess" class="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 text-sm">
                评论提交成功！审核通过后将会显示。
              </div>
            </div>

            <!-- 评论列表 -->
            <div v-if="comments.length > 0" class="space-y-4">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="glass rounded-2xl p-5 border border-white/10"
              >
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                    {{ comment.author_name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="font-semibold text-gray-900 dark:text-white">{{ comment.author_name }}</span>
                      <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-gray-500">
              暂无评论，来抢沙发吧！
            </div>
          </section>
        </article>

        <!-- TOC 侧边目录 (桌面端) -->
        <aside v-if="tocItems.length > 0" class="hidden xl:block w-64 flex-shrink-0">
          <div class="sticky top-20">
            <div class="glass rounded-2xl p-5 border border-white/10">
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                目录
              </h3>
              <nav class="space-y-1 max-h-[60vh] overflow-y-auto" style="scrollbar-width: thin;">
                <a
                  v-for="item in tocItems"
                  :key="item.id"
                  :href="`#${item.id}`"
                  @click.prevent="scrollToHeading(item.id)"
                  :class="[
                    'block py-1.5 text-sm transition-all duration-200 border-l-2 hover:text-purple-400',
                    item.level === 3 ? 'pl-6' : 'pl-3',
                    activeHeading === item.id
                      ? 'border-purple-500 text-purple-400 font-medium'
                      : 'border-transparent text-gray-500 hover:border-gray-500/50'
                  ]"
                >
                  {{ item.text }}
                </a>
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Footer -->
    <footer class="glass-strong border-t border-white/10 py-8 px-6 mt-20">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-sm text-gray-500">© {{ currentYear }} 杨汶川. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi, commentApi, type BlogPost, type Comment } from '@/lib/supabase'
import { generateComment } from '@/services/deepSeekService'
import { marked } from 'marked'
// ========== 性能优化：按需加载 highlight.js 语言包 ==========
// 使用 core + 手动注册常用语言，避免打包全部 190+ 语言（节省约 600KB）
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'
import python from 'highlight.js/lib/languages/python'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import java from 'highlight.js/lib/languages/java'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'

hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c', cpp)           // C 复用 C++ 语法
hljs.registerLanguage('python', python)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)

const route = useRoute()
const post = ref<BlogPost | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(true)
const submittingComment = ref(false)
const commentSuccess = ref(false)
const readingProgress = ref(0)
const activeHeading = ref('')
const likes = ref(0)
const clapped = ref(false)
const showClapAnimation = ref(false)

const newComment = ref({
  author_name: '',
  author_email: '',
  content: ''
})

async function handleClap() {
  if (!post.value || clapped.value) return

  try {
    // Optimistic update
    likes.value++
    clapped.value = true
    showClapAnimation.value = true

    // Play animation
    setTimeout(() => { showClapAnimation.value = false }, 1000)

    // Update local storage
    const clappedPosts = JSON.parse(localStorage.getItem('clapped_posts') || '[]')
    clappedPosts.push(post.value.id)
    localStorage.setItem('clapped_posts', JSON.stringify(clappedPosts))

    // Call API
    await blogApi.incrementLikes(post.value.id)
  } catch (error) {
    console.error('点赞失败:', error)
    // Rollback on error
    likes.value--
    clapped.value = false
  }
}

const generatingComment = ref(false)

async function handleGenerateComment() {
  if (!post.value) return
  
  try {
    generatingComment.value = true
    // Use excerpt or first 800 chars of content (to save tokens but provide enough context)
    const context = post.value.excerpt || post.value.content.substring(0, 800)
    const comment = await generateComment(context)
    
    // Remove quotes if AI returns them
    const cleanComment = comment ? comment.replace(/^["']|["']$/g, '') : ''
    
    if (cleanComment) {
      newComment.value.content = cleanComment
    }
  } catch (error) {
    console.error('AI生成失败:', error)
    alert('AI 暂时累了，请稍后再试')
  } finally {
    generatingComment.value = false
  }
}


const currentYear = computed(() => new Date().getFullYear())

// ========== Markdown 渲染 (marked + highlight.js) ==========
// 配置 marked 使用 highlight.js 做代码语法高亮
marked.setOptions({
  breaks: true,
  gfm: true
})

// 自定义 renderer 为标题添加 id（用于 TOC 锚点跳转）
const renderer = new marked.Renderer()
renderer.heading = function (text: string, level: number) {
  // 生成标题 ID：将中文和特殊字符转为拼音风格 slug
  const id = `heading-${text.replace(/[^\w\u4e00-\u9fa5]/g, '-').replace(/-+/g, '-').substring(0, 40)}`
  return `<h${level} id="${id}">${text}</h${level}>`
}

renderer.code = function (code: string, language: string | undefined) {
  // 使用 highlight.js 高亮代码块
  let highlighted: string
  if (language && hljs.getLanguage(language)) {
    highlighted = hljs.highlight(code, { language }).value
  } else {
    highlighted = hljs.highlightAuto(code).value
  }
  return `<pre class="hljs-code-block"><code class="hljs language-${language || 'plaintext'}">${highlighted}</code></pre>`
}

const renderedContent = computed(() => {
  if (!post.value) return ''
  return marked(post.value.content, { renderer }) as string
})

// ========== TOC 目录生成 ==========
interface TocItem {
  id: string
  text: string
  level: number
}

const tocItems = computed<TocItem[]>(() => {
  if (!renderedContent.value) return []
  
  const items: TocItem[] = []
  // 正则匹配渲染后 HTML 中的 h2, h3 标题
  const headingRegex = /<h([23])\s+id="([^"]*)">(.*?)<\/h\1>/g
  let match
  
  while ((match = headingRegex.exec(renderedContent.value)) !== null) {
    items.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, '') // 移除标题内的 HTML 标签
    })
  }
  
  return items
})

// ========== 预计阅读时间 ==========
const estimatedReadTime = computed(() => {
  if (!post.value) return 0
  // 中文阅读速度约 400 字/分钟
  const wordCount = post.value.content.length
  return Math.max(1, Math.ceil(wordCount / 400))
})

// ========== 阅读进度条 ==========
function updateReadingProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
}

// ========== TOC 活跃标题追踪 ==========
function updateActiveHeading() {
  const headings = tocItems.value.map(item => document.getElementById(item.id)).filter(Boolean)
  
  // 找到当前可见的标题
  let currentHeading = ''
  for (const heading of headings) {
    if (heading && heading.getBoundingClientRect().top <= 120) {
      currentHeading = heading.id
    }
  }
  activeHeading.value = currentHeading
}

// 合并滚动处理函数
function handleScroll() {
  updateReadingProgress()
  updateActiveHeading()
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 100,
      behavior: 'smooth'
    })
    activeHeading.value = id
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function loadPost() {
  try {
    loading.value = true
    const id = route.params.id as string
    post.value = await blogApi.getPost(id)
    
    if (post.value) {
      comments.value = await commentApi.getComments(id)
      likes.value = post.value.likes || 0
      
      // Check local storage for clapped state
      const clappedPosts = JSON.parse(localStorage.getItem('clapped_posts') || '[]')
      clapped.value = clappedPosts.includes(id)

      // 动态更新页面标题为文章标题
      document.title = `${post.value.title} - 杨汶川的博客`
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    post.value = null
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  if (!newComment.value.author_name.trim() || !newComment.value.content.trim() || !post.value) return

  try {
    submittingComment.value = true
    await commentApi.createComment({
      post_id: post.value.id,
      author_name: newComment.value.author_name.trim(),
      author_email: newComment.value.author_email.trim() || undefined,
      content: newComment.value.content.trim()
    })

    newComment.value = { author_name: '', author_email: '', content: '' }
    commentSuccess.value = true
    setTimeout(() => { commentSuccess.value = false }, 3000)
  } catch (error: any) {
    console.error('提交评论失败:', error)
    alert('提交失败: ' + (error?.message || '未知错误'))
  } finally {
    submittingComment.value = false
  }
}

onMounted(() => {
  loadPost()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 文章标题样式 */
.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3) {
  @apply font-bold text-gray-900 dark:text-white mt-8 mb-4;
}
.article-content :deep(h1) { @apply text-3xl; }
.article-content :deep(h2) { @apply text-2xl border-b border-white/10 pb-2; }
.article-content :deep(h3) { @apply text-xl; }

/* 代码块样式 — 赛博风 */
.article-content :deep(.hljs-code-block) {
  @apply rounded-xl my-6 overflow-hidden border border-white/10;
  background: #0d1117 !important;
}

.article-content :deep(.hljs-code-block code) {
  @apply block p-5 text-sm leading-relaxed overflow-x-auto;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}

/* 行内代码 */
.article-content :deep(code:not(.hljs)) {
  @apply bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded text-sm;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* 引用块 */
.article-content :deep(blockquote) {
  @apply border-l-4 border-purple-500/50 pl-4 my-4 text-gray-400 italic;
}

/* 链接 */
.article-content :deep(a) {
  @apply text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/30 hover:decoration-purple-500 transition-colors;
}

/* 列表 */
.article-content :deep(ul) {
  @apply list-disc list-inside space-y-2 my-4;
}
.article-content :deep(ol) {
  @apply list-decimal list-inside space-y-2 my-4;
}

/* 图片 */
.article-content :deep(img) {
  @apply rounded-xl my-4 shadow-lg;
}

/* 表格 */
.article-content :deep(table) {
  @apply w-full my-4 border-collapse;
}
.article-content :deep(th) {
  @apply bg-purple-500/10 text-left p-3 border border-white/10 font-semibold;
}
.article-content :deep(td) {
  @apply p-3 border border-white/10;
}

/* 水平线 */
.article-content :deep(hr) {
  @apply my-8 border-none h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent;
}

@keyframes float-up {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
}

.animate-float-up {
  animation: float-up 0.8s ease-out forwards;
}
</style>

