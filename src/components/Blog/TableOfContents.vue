<template>
  <aside class="sticky top-24 hidden lg:block">
    <div class="bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-dark-border/50 p-6">
      <!-- 标题 -->
      <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200/50 dark:border-dark-border/50">
        <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">目录</h3>
      </div>

      <!-- 目录列表 -->
      <nav class="space-y-1">
        <a
          v-for="heading in headings"
          :key="heading.id"
          :href="`#${heading.id}`"
          :class="[
            'block py-2 text-sm transition-all duration-200 border-l-2',
            activeId === heading.id
              ? 'border-accent text-accent font-semibold translate-x-1'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white'
          ]"
          :style="{ paddingLeft: `${(heading.level - 1) * 12}px` }"
          @click.prevent="scrollToHeading(heading.id)"
        >
          {{ heading.text }}
        </a>
      </nav>

      <!-- 阅读进度 -->
      <div class="mt-6 pt-4 border-t border-gray-200/50 dark:border-dark-border/50">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">阅读进度</span>
          <span class="text-xs font-bold text-accent">{{ Math.round(readProgress) }}%</span>
        </div>
        <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-accent to-accent-dark transition-all duration-300"
            :style="{ width: `${readProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Heading {
  id: string
  text: string
  level: number
}

interface Props {
  content: string
}

const props = defineProps<Props>()

const headings = ref<Heading[]>([])
const activeId = ref<string>('')
const readProgress = ref(0)

// 解析 Markdown 中的标题
const parseHeadings = () => {
  const lines = props.content.split('\n')
  const result: Heading[] = []

  lines.forEach(line => {
    const match = line.match(/^(#{1,4})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2]
      const id = text.toLowerCase().replace(/[^\w]+/g, '-')
      result.push({ id, text, level })
    }
  })

  headings.value = result
}

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

// 监听滚动，更新当前激活的标题和阅读进度
const handleScroll = () => {
  // 更新阅读进度
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY
  const trackLength = documentHeight - windowHeight
  readProgress.value = (scrollTop / trackLength) * 100

  // 更新激活的标题
  const headingElements = headings.value.map(h => ({
    id: h.id,
    element: document.getElementById(h.id)
  })).filter(h => h.element !== null)

  let currentHeading = ''
  for (const heading of headingElements) {
    if (heading.element) {
      const rect = heading.element.getBoundingClientRect()
      if (rect.top <= 150) {
        currentHeading = heading.id
      }
    }
  }

  activeId.value = currentHeading
}

onMounted(() => {
  parseHeadings()
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
