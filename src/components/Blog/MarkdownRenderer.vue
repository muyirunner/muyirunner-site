<template>
  <div
    class="markdown-body prose prose-lg dark:prose-invert max-w-none"
    v-html="renderedHtml"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

interface Props {
  content: string
}

const props = defineProps<Props>()

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true,
  highlight: function(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('代码高亮失败:', err)
      }
    }
    return hljs.highlightAuto(code).value
  }
})

// 渲染 Markdown
const renderedHtml = computed(() => {
  if (!props.content) {
    return '<p class="text-gray-500">暂无内容</p>'
  }

  try {
    // marked.parse 返回 string 或 Promise<string>
    const result = marked.parse(props.content, { async: false })
    return result as string
  } catch (error) {
    console.error('Markdown 渲染失败:', error)
    console.error('内容长度:', props.content?.length)
    return `<div class="text-red-500">
      <p>内容渲染失败</p>
      <pre class="text-xs mt-2">${error}</pre>
    </div>`
  }
})
</script>

<style scoped>
/* Markdown 内容样式 */
.markdown-body {
  @apply text-gray-800 dark:text-gray-200;
}

/* 标题样式 */
.markdown-body :deep(h1) {
  @apply text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b-2 border-accent/20 pb-3;
}

.markdown-body :deep(h2) {
  @apply text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-white;
}

.markdown-body :deep(h3) {
  @apply text-2xl font-semibold mt-5 mb-2 text-gray-800 dark:text-gray-100;
}

.markdown-body :deep(h4) {
  @apply text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100;
}

/* 段落样式 */
.markdown-body :deep(p) {
  @apply my-4 leading-relaxed;
}

/* 链接样式 */
.markdown-body :deep(a) {
  @apply text-accent hover:text-accent-dark underline transition-colors;
}

/* 列表样式 */
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  @apply my-4 pl-6;
}

.markdown-body :deep(li) {
  @apply my-2;
}

.markdown-body :deep(ul li) {
  @apply list-disc;
}

.markdown-body :deep(ol li) {
  @apply list-decimal;
}

/* 引用样式 */
.markdown-body :deep(blockquote) {
  @apply border-l-4 border-accent pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800/50 italic;
}

/* 行内代码 */
.markdown-body :deep(code:not(.hljs)) {
  @apply bg-gray-100 dark:bg-gray-800 text-accent px-1.5 py-0.5 rounded text-sm font-mono;
}

/* 代码块 */
.markdown-body :deep(pre) {
  @apply my-6 p-4 rounded-lg overflow-x-auto bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700;
}

.markdown-body :deep(pre code) {
  @apply text-sm leading-relaxed font-mono bg-transparent p-0;
}

/* 表格样式 */
.markdown-body :deep(table) {
  @apply w-full my-6 border-collapse;
}

.markdown-body :deep(thead) {
  @apply bg-gray-100 dark:bg-gray-800;
}

.markdown-body :deep(th) {
  @apply px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-600;
}

.markdown-body :deep(td) {
  @apply px-4 py-2 border border-gray-300 dark:border-gray-600;
}

.markdown-body :deep(tbody tr:nth-child(even)) {
  @apply bg-gray-50 dark:bg-gray-800/30;
}

/* 水平线 */
.markdown-body :deep(hr) {
  @apply my-8 border-t-2 border-gray-200 dark:border-gray-700;
}

/* 图片样式 */
.markdown-body :deep(img) {
  @apply max-w-full h-auto rounded-lg my-4;
}

/* 强调 */
.markdown-body :deep(strong) {
  @apply font-bold text-gray-900 dark:text-white;
}

.markdown-body :deep(em) {
  @apply italic;
}
</style>
