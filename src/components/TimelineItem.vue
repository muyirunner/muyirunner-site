<template>
  <div
    ref="targetRef"
    :class="[
      'relative pl-8 pb-8 transition-all duration-600',
      { 'opacity-0 translate-y-4': !isVisible },
      { 'opacity-100 translate-y-0': isVisible }
    ]"
  >
    <div
      class="absolute left-0 top-2 w-3 h-3 rounded-full bg-accent border-2 border-white dark:border-gray-900"
    ></div>
    <div class="space-y-2">
      <div class="flex flex-wrap items-center gap-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <span
          class="text-sm text-gray-500 dark:text-gray-400 font-medium"
        >
          {{ period }}
        </span>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        {{ subtitle }}
      </p>
      <ul
        v-if="items && items.length > 0"
        class="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300"
      >
        <li
          v-for="(item, index) in items"
          :key="index"
          class="flex gap-2"
        >
          <span class="text-accent mt-1">•</span>
          <span class="flex-1">{{ item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

interface Props {
  title: string
  subtitle: string
  period: string
  items?: string[]
}

defineProps<Props>()

const { isVisible, targetRef } = useIntersectionObserver()
</script>
