<template>
  <div class="hidden md:flex fixed top-20 right-5 z-[55] flex-col gap-3 items-center">
    <!-- 浮动主题切换按钮 -->
    <button
      @click="toggleTheme"
      class="group relative"
      :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
    >
      <div class="relative w-11 h-11 rounded-xl glass border border-white/20 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-glow-purple hover:scale-110 hover:border-purple-500/50">
        <!-- 太阳图标（亮色模式显示，点击切暗色） -->
        <svg
          class="w-5 h-5 absolute transition-all duration-500"
          :class="isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'"
          fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5" class="stroke-amber-400" />
          <path class="stroke-amber-400" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <!-- 月亮图标（暗色模式显示，点击切亮色） -->
        <svg
          class="w-5 h-5 absolute transition-all duration-500"
          :class="isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'"
          fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        >
          <path class="stroke-blue-300" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>

    <!-- 自动模式开关 -->
    <button
      @click="toggleAuto"
      class="w-8 h-8 rounded-lg glass border flex items-center justify-center transition-all duration-300 hover:scale-110"
      :class="isAuto ? 'border-purple-500 text-purple-500 bg-purple-500/10 shadow-glow-purple/30' : 'border-white/10 text-gray-400 hover:text-purple-400 hover:border-purple-500/30'"
      title="自动模式 (19:00-06:00 深色)"
    >
      <span class="text-[10px] font-bold">AUTO</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, isAuto, toggleTheme, toggleAuto } = useTheme()
</script>
