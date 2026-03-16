<template>
  <div
    ref="targetRef"
    :class="[
      'group relative transition-all duration-700',
      { 'opacity-0 translate-y-8': !isVisible },
      { 'opacity-100 translate-y-0': isVisible }
    ]"
  >
    <!-- 装饰性背景光晕 -->
    <div class="absolute -inset-1 bg-gradient-to-r from-accent/20 via-primary-500/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

    <!-- 主卡片 -->
    <div class="relative h-full bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-dark-border/50 overflow-hidden transition-all duration-500 hover:border-accent/50 hover:shadow-glow">
      <!-- 顶部渐变装饰条 -->
      <div class="h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>

      <!-- 动态背景网格 -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0); background-size: 32px 32px;"></div>
      </div>

      <!-- 角标装饰 -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/5 to-transparent rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-700"></div>

      <div class="relative p-8 space-y-6">
        <!-- 头部：项目编号和时间 -->
        <div class="flex items-start justify-between gap-4">
          <!-- 项目编号装饰 -->
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary-500/20 flex items-center justify-center font-bold text-accent group-hover:scale-110 transition-transform duration-500">
                <span class="text-xl">{{ projectNumber }}</span>
              </div>
              <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-accent to-primary-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
            </div>
          </div>

          <!-- 时间标签 -->
          <div class="relative">
            <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-primary-500/10 border border-accent/20 backdrop-blur-sm group-hover:border-accent/50 transition-colors duration-500">
              <svg class="w-4 h-4 text-accent animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ period }}</span>
            </div>
          </div>
        </div>

        <!-- 项目标题 -->
        <div class="space-y-3">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-primary-500 transition-all duration-500">
            {{ title }}
          </h3>

          <!-- 装饰性下划线 -->
          <div class="h-0.5 bg-gradient-to-r from-accent/50 via-primary-500/50 to-transparent w-0 group-hover:w-full transition-all duration-700"></div>
        </div>

        <!-- 项目描述 -->
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
          {{ description }}
        </p>

        <!-- 角色标签 -->
        <div v-if="role" class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
          <span class="text-sm font-medium text-accent">{{ role }}</span>
        </div>

        <!-- 项目亮点 -->
        <div v-if="highlights && highlights.length > 0" class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="w-6 h-0.5 bg-gradient-to-r from-accent to-transparent"></div>
            <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">核心亮点</h4>
          </div>

          <ul class="space-y-3">
            <li
              v-for="(highlight, index) in highlights"
              :key="index"
              :style="{ animationDelay: `${index * 100}ms` }"
              class="flex gap-3 group/item animate-fade-in-up opacity-0"
            >
              <!-- 动态序号 -->
              <div class="flex-shrink-0 mt-0.5">
                <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-accent/20 to-primary-500/20 flex items-center justify-center text-xs font-bold text-accent group-hover/item:scale-110 group-hover/item:rotate-12 transition-transform duration-300">
                  {{ index + 1 }}
                </div>
              </div>

              <!-- 亮点内容 -->
              <span class="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-300">
                {{ highlight }}
              </span>
            </li>
          </ul>
        </div>

        <!-- 技术栈 -->
        <div v-if="technologies && technologies.length > 0" class="space-y-4 pt-4 border-t border-gray-200/50 dark:border-dark-border/50">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">技术栈</h4>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="(tech, index) in technologies"
              :key="tech"
              :style="{ animationDelay: `${index * 50}ms` }"
              class="relative px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-dark-bg dark:to-dark-card border border-gray-200 dark:border-dark-border text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent hover:scale-105 transition-all duration-300 cursor-default animate-fade-in opacity-0 overflow-hidden group/tech"
            >
              <!-- 悬停光效 -->
              <span class="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent translate-x-[-100%] group-hover/tech:translate-x-[100%] transition-transform duration-700"></span>
              <span class="relative">{{ tech }}</span>
            </span>
          </div>
        </div>

        <!-- 底部装饰 -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

interface Props {
  title: string
  period: string
  description: string
  highlights?: string[]
  technologies?: string[]
  role?: string
  index?: number
}

const props = defineProps<Props>()

const { isVisible, targetRef } = useIntersectionObserver()

// 项目编号（从1开始）
const projectNumber = computed(() => {
  return props.index !== undefined ? String(props.index + 1).padStart(2, '0') : '01'
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}
</style>
