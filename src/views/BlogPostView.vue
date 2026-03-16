<template>
  <div class="blog-post-container max-w-4xl mx-auto px-4 py-8">
    <!-- 加载中状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-500 text-lg">{{ error }}</p>
      <button
        @click="$router.back()"
        class="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        返回
      </button>
    </div>

    <!-- 文章内容 -->
    <article v-else-if="post" class="prose prose-lg dark:prose-invert max-w-none">
      <!-- 文章头部 -->
      <header class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>✍️ {{ post.author }}</span>
          <span>📅 {{ post.date }}</span>
          <span>⏱️ {{ post.readTime }} 分钟阅读</span>
          <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full">
            {{ post.category }}
          </span>
        </div>
        <div class="flex flex-wrap gap-2 mt-4">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
          >
            #{{ tag }}
          </span>
        </div>
      </header>

      <!-- Markdown 内容 -->
      <div
        class="markdown-body"
        v-html="renderedContent"
      ></div>

      <!-- 文章底部 -->
      <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$router.back()"
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ← 返回博客列表
        </button>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBlogPost } from '@/api/blog'
import type { BlogPost } from '@/api/blog'
import { renderMarkdown, addHeadingIds } from '@/utils/markdown'
import 'highlight.js/styles/github-dark.css'

const route = useRoute()
const router = useRouter()

const post = ref<BlogPost | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// 渲染后的 HTML
const renderedContent = computed(() => {
  if (!post.value?.content) return ''

  const html = renderMarkdown(post.value.content)
  return addHeadingIds(html)
})

onMounted(async () => {
  const postId = route.params.id as string

  try {
    loading.value = true
    post.value = await getBlogPost(postId)

    if (!post.value) {
      error.value = '文章不存在'
    }
  } catch (err) {
    console.error('加载文章失败:', err)
    error.value = '加载文章失败，请稍后再试'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Markdown 样式 */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  scroll-margin-top: 2rem;
}

.markdown-body :deep(h1) {
  font-size: 2.25rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.markdown-body :deep(h2) {
  font-size: 1.875rem;
}

.markdown-body :deep(h3) {
  font-size: 1.5rem;
}

.markdown-body :deep(p) {
  margin: 1rem 0;
  line-height: 1.75;
}

.markdown-body :deep(code) {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: 'Fira Code', 'Courier New', monospace;
}

.markdown-body :deep(pre) {
  background: #1f2937;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #e5e7eb;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid #4f46e5;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.markdown-body :deep(th) {
  background: #f3f4f6;
  font-weight: 600;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.markdown-body :deep(li) {
  margin: 0.5rem 0;
}

.markdown-body :deep(a) {
  color: #4f46e5;
  text-decoration: underline;
}

.markdown-body :deep(a:hover) {
  color: #4338ca;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .markdown-body :deep(code) {
    background: #374151;
    color: #e5e7eb;
  }

  .markdown-body :deep(blockquote) {
    color: #9ca3af;
  }

  .markdown-body :deep(th) {
    background: #374151;
  }

  .markdown-body :deep(th),
  .markdown-body :deep(td) {
    border-color: #4b5563;
  }
}
</style>
