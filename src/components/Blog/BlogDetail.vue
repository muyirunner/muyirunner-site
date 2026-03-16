<template>
  <div class="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm" @click.self="closeModal">
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-bg rounded-2xl shadow-2xl"
        @click.stop
      >
        <!-- 关闭按钮 -->
        <button
          @click="closeModal"
          class="fixed top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 文章头部 -->
        <div class="relative">
          <!-- 封面图片 -->
          <div v-if="post.cover" class="relative h-64 md:h-96 overflow-hidden">
            <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            <!-- 标题覆盖在封面上 -->
            <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div class="max-w-4xl mx-auto">
                <!-- 分类标签 -->
                <span class="inline-block px-4 py-1.5 rounded-full bg-accent text-white text-sm font-bold mb-4">
                  {{ post.category }}
                </span>

                <!-- 标题 -->
                <h1 class="text-3xl md:text-5xl font-bold text-white mb-4">
                  {{ post.title }}
                </h1>

                <!-- 元信息 -->
                <div class="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{{ post.author }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDate(post.date) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ post.readTime }} 分钟阅读</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 无封面时的头部 -->
          <div v-else class="bg-gradient-to-br from-accent/10 via-primary-500/10 to-accent/10 p-8 md:p-12">
            <div class="max-w-4xl mx-auto">
              <span class="inline-block px-4 py-1.5 rounded-full bg-accent text-white text-sm font-bold mb-4">
                {{ post.category }}
              </span>
              <h1 class="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {{ post.title }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
                <span>{{ post.author }}</span>
                <span>•</span>
                <span>{{ formatDate(post.date) }}</span>
                <span>•</span>
                <span>{{ post.readTime }} 分钟阅读</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章内容区域 -->
        <div class="p-8 md:p-12">
          <div class="max-w-6xl mx-auto">
            <div class="grid lg:grid-cols-[1fr_250px] gap-12">
              <!-- 左侧：文章内容 -->
              <div class="min-w-0">
                <!-- 描述 -->
                <div class="mb-8 p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-l-4 border-accent">
                  <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {{ post.description }}
                  </p>
                </div>

                <!-- Markdown 内容 -->
                <div v-if="post.content">
                  <MarkdownRenderer :content="post.content" />
                </div>
                <div v-else class="text-center py-12">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
                  <p class="text-gray-600 dark:text-gray-400">加载内容中...</p>
                </div>

                <!-- 标签 -->
                <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">标签</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in post.tags"
                      :key="tag"
                      class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-accent/10 hover:text-accent transition-colors cursor-default"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <!-- 底部操作 -->
                <div class="mt-8 flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
                  <button
                    @click="closeModal"
                    class="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>返回列表</span>
                  </button>

                  <button
                    @click="shareArticle"
                    class="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white hover:bg-accent-dark transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>分享文章</span>
                  </button>
                </div>
              </div>

              <!-- 右侧：目录导航 -->
              <TableOfContents v-if="post.content" :content="post.content" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { BlogPost } from '@/types/blog'
import MarkdownRenderer from './MarkdownRenderer.vue'
import TableOfContents from './TableOfContents.vue'

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 分享文章
const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: props.post.title,
      text: props.post.description,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    alert('文章链接已复制到剪贴板！')
  }
}

// 禁止背景滚动
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

// ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
