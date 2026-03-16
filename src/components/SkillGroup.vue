<template>
  <div
    ref="targetRef"
    :class="[
      'transition-all duration-600',
      { 'opacity-0 translate-y-4': !isVisible },
      { 'opacity-100 translate-y-0': isVisible }
    ]"
  >
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
      {{ category }}
    </h3>
    <div class="flex flex-wrap gap-2">
      <Chip v-for="skill in skills" :key="skill">
        {{ skill }}
      </Chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import Chip from './Chip.vue'

interface Props {
  category: string
  skills: string[]
}

defineProps<Props>()

const { isVisible, targetRef } = useIntersectionObserver()
</script>
