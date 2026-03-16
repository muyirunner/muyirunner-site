<template>
  <button
    :class="[
      'group relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-bg',
      'overflow-hidden',
      variantClasses,
      sizeClasses,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <!-- 悬停光效 -->
    <span
      v-if="variant === 'primary'"
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
    ></span>

    <!-- 按钮内容 -->
    <span class="relative z-10 flex items-center gap-2">
      <slot />
    </span>

    <!-- Ripple效果背景 -->
    <span
      v-if="variant === 'outline'"
      class="absolute inset-0 bg-accent/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl"
    ></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-r from-accent to-accent-dark text-white hover:shadow-glow hover:scale-105 focus:ring-accent rounded-xl'
    case 'secondary':
      return 'bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-card/80 border border-gray-200 dark:border-dark-border focus:ring-gray-400 rounded-xl'
    case 'outline':
      return 'border-2 border-accent/50 text-accent hover:border-accent hover:text-white hover:shadow-glow focus:ring-accent rounded-xl relative'
    case 'ghost':
      return 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card/50 rounded-xl'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-sm px-4 py-2'
    case 'md':
      return 'text-base px-6 py-3'
    case 'lg':
      return 'text-lg px-8 py-4'
    default:
      return ''
  }
})
</script>
