<template>
  <div class="relative mb-12">
    <div class="flex items-center gap-4">
      <!-- 装饰线 -->
      <div class="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent flex-1"></div>

      <!-- 标题 -->
      <h2
        ref="titleRef"
        :class="[
          'text-3xl md:text-4xl font-bold text-gray-900 dark:text-white relative',
          'transition-all duration-600',
          { 'opacity-0 translate-y-4': !isVisible },
          { 'opacity-100 translate-y-0': isVisible }
        ]"
      >
        <span class="relative z-10">{{ title }}</span>

        <!-- 发光效果 -->
        <span
          class="absolute inset-0 blur-xl text-accent/20 dark:text-accent/30 -z-10"
          aria-hidden="true"
        >
          {{ title }}
        </span>
      </h2>

      <!-- 装饰线 -->
      <div class="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent flex-1"></div>
    </div>

    <!-- 副标题（可选） -->
    <p
      v-if="subtitle"
      :class="[
        'text-center text-gray-600 dark:text-gray-400 mt-4 text-lg',
        'transition-all duration-600 delay-100',
        { 'opacity-0': !isVisible },
        { 'opacity-100': isVisible }
      ]"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()

const { isVisible, targetRef: titleRef } = useIntersectionObserver()
</script>
