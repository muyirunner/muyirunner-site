<template>
  <div class="giscus-wrapper mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
    <!-- 评论区标题 -->
    <div class="flex items-center gap-3 mb-6">
      <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
        评论交流
      </h3>
    </div>

    <!-- Giscus 评论区 -->
    <div
      ref="giscusContainer"
      class="giscus-container rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  repo: string  // 格式: "username/repo"
  repoId: string
  category: string
  categoryId: string
  mapping?: string
  theme?: string
}

const props = withDefaults(defineProps<Props>(), {
  mapping: 'pathname',
  theme: 'preferred_color_scheme'
})

const giscusContainer = ref<HTMLDivElement | null>(null)

// 加载 Giscus 脚本
const loadGiscus = () => {
  if (!giscusContainer.value) return

  // 清空容器
  giscusContainer.value.innerHTML = ''

  // 创建 script 标签
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', props.repo)
  script.setAttribute('data-repo-id', props.repoId)
  script.setAttribute('data-category', props.category)
  script.setAttribute('data-category-id', props.categoryId)
  script.setAttribute('data-mapping', props.mapping)
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', props.theme)
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')
  script.crossOrigin = 'anonymous'
  script.async = true

  giscusContainer.value.appendChild(script)
}

// 监听主题变化
const updateTheme = () => {
  const theme = document.documentElement.classList.contains('dark')
    ? 'dark'
    : 'light'

  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      'https://giscus.app'
    )
  }
}

onMounted(() => {
  loadGiscus()

  // 监听主题切换
  const observer = new MutationObserver(updateTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

// Props 变化时重新加载
watch(() => [props.repo, props.repoId], () => {
  loadGiscus()
})
</script>

<style scoped>
.giscus-container {
  min-height: 200px;
}

/* 优化 Giscus iframe 样式 */
.giscus-container :deep(iframe.giscus-frame) {
  border-radius: 0.75rem;
}
</style>
