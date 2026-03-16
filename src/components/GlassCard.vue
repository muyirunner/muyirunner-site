<template>
  <div
    :class="[
      'relative rounded-2xl backdrop-blur-sm border transition-all duration-300 group',
      'bg-white/80 dark:bg-dark-card/80',
      'border-gray-200/50 dark:border-dark-border/50',
      'hover:shadow-card-hover hover:border-accent/30',
      'hover:-translate-y-1',
      paddingClasses
    ]"
  >
    <!-- 发光边框效果 -->
    <div
      class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), transparent 50%)"
    ></div>

    <!-- 内容 -->
    <div class="relative z-10">
      <slot />
    </div>

    <!-- 底部光效 -->
    <div
      class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md'
})

const paddingClasses = computed(() => {
  switch (props.padding) {
    case 'none':
      return 'p-0'
    case 'sm':
      return 'p-4'
    case 'md':
      return 'p-6'
    case 'lg':
      return 'p-8'
    default:
      return 'p-6'
  }
})
</script>
