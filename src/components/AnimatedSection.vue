<template>
  <div
    ref="elementRef"
    :class="[
      'animated-section',
      { 'is-visible': isVisible }
    ]"
    :style="{
      '--delay': `${delay}ms`,
      '--duration': `${duration}ms`
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right'
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animation: 'fade-up',
  delay: 0,
  duration: 600,
  threshold: 0.1,
  once: true
})

const elementRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!elementRef.value) return
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (props.once && observer) {
            observer.unobserve(entry.target)
          }
        } else if (!props.once) {
          isVisible.value = false
        }
      })
    },
    { threshold: props.threshold }
  )
  
  observer.observe(elementRef.value)
})

onUnmounted(() => {
  if (observer && elementRef.value) {
    observer.unobserve(elementRef.value)
    observer.disconnect()
  }
})
</script>

<style scoped>
.animated-section {
  opacity: 0;
  transition: 
    opacity var(--duration) cubic-bezier(0.16, 1, 0.3, 1) var(--delay),
    transform var(--duration) cubic-bezier(0.16, 1, 0.3, 1) var(--delay);
}

/* Fade Up */
.animated-section:not(.is-visible) {
  transform: translateY(30px);
}

.animated-section.is-visible {
  opacity: 1;
  transform: translateY(0) translateX(0) scale(1);
}

/* Override for different animations via parent class */
:deep(.animation-fade-in) .animated-section:not(.is-visible) {
  transform: none;
}

:deep(.animation-scale-in) .animated-section:not(.is-visible) {
  transform: scale(0.95);
}

:deep(.animation-slide-left) .animated-section:not(.is-visible) {
  transform: translateX(-30px);
}

:deep(.animation-slide-right) .animated-section:not(.is-visible) {
  transform: translateX(30px);
}
</style>
