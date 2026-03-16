<template>
  <div
    ref="cardRef"
    :class="[
      'bento-card group relative overflow-hidden rounded-3xl transition-all duration-500',
      sizeClasses,
      'bg-gradient-to-br from-white/[0.08] to-white/[0.02]',
      'border border-white/[0.08] hover:border-white/20',
      'backdrop-blur-xl'
    ]"
    :style="{ transform: cardTransform }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Gradient border glow -->
    <div 
      class="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      :style="{
        background: `linear-gradient(135deg, ${gradientColors.start}20, transparent, ${gradientColors.end}20)`,
        padding: '1px'
      }"
    ></div>

    <!-- Mouse-tracking glow -->
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      :style="{
        background: `radial-gradient(800px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 40%)`
      }"
    ></div>

    <!-- Top gradient bar -->
    <div 
      v-if="showGradientBar"
      class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80"
      :style="{ backgroundImage: `linear-gradient(to right, ${gradientColors.start}, ${gradientColors.end})` }"
    ></div>

    <!-- Card content -->
    <div class="relative z-10 p-6 h-full flex flex-col">
      <!-- Header -->
      <div v-if="title || icon" class="flex items-center gap-3 mb-4">
        <span v-if="icon" class="text-2xl">{{ icon }}</span>
        <h3 v-if="title" class="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          {{ title }}
        </h3>
      </div>

      <!-- Slot content -->
      <div class="flex-1">
        <slot />
      </div>
    </div>

    <!-- Corner decoration -->
    <div 
      class="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
      :style="{ background: `radial-gradient(circle, ${gradientColors.start}, transparent 70%)` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full'
  gradient?: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'cyan'
  title?: string
  icon?: string
  showGradientBar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  gradient: 'purple',
  showGradientBar: false
})

const cardRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const rotateX = ref(0)
const rotateY = ref(0)

// Size classes for grid spanning
const sizeClasses = computed(() => {
  const classes: Record<string, string> = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-1',
    large: 'col-span-1 md:col-span-2 row-span-2',
    wide: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-1',
    tall: 'col-span-1 row-span-2',
    full: 'col-span-1 md:col-span-2 lg:col-span-4 row-span-1'
  }
  return classes[props.size] || classes.medium
})

// Gradient colors based on variant
const gradientColors = computed(() => {
  const colors: Record<string, { start: string; end: string }> = {
    purple: { start: '#a855f7', end: '#ec4899' },
    blue: { start: '#3b82f6', end: '#06b6d4' },
    green: { start: '#22c55e', end: '#10b981' },
    orange: { start: '#f97316', end: '#eab308' },
    pink: { start: '#ec4899', end: '#f43f5e' },
    cyan: { start: '#06b6d4', end: '#3b82f6' }
  }
  return colors[props.gradient] || colors.purple
})

// Glow color
const glowColor = computed(() => {
  return `${gradientColors.value.start}15`
})

// 3D transform
const cardTransform = computed(() => {
  return `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`
})

// Mouse move handler for 3D effect
const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return
  
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  mouseX.value = x
  mouseY.value = y
  
  // Calculate rotation (subtle)
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  rotateY.value = ((x - centerX) / centerX) * 3
  rotateX.value = -((y - centerY) / centerY) * 3
}

const handleMouseLeave = () => {
  rotateX.value = 0
  rotateY.value = 0
}
</script>

<style scoped>
.bento-card {
  will-change: transform;
  transform-style: preserve-3d;
}
</style>
