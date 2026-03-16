<template>
  <div class="fixed inset-0 -z-10 overflow-hidden" :class="{ 'animations-paused': isPaused }">
    <!-- 基础背景层 -->
    <div 
      class="absolute inset-0"
      :class="{ 'animate-gradient': isAnimated }"
      :style="{ background: backgroundCSS }"
    />
    
    <!-- 颜色遮罩层 -->
    <div 
      v-if="config.effects.colorOverlay.enabled"
      class="absolute inset-0"
      :style="{ 
        backgroundColor: config.effects.colorOverlay.color,
        opacity: config.effects.colorOverlay.opacity
      }"
    />

    <!-- 网格层 -->
    <div 
      v-if="config.effects.grid.enabled"
      class="absolute inset-0 pointer-events-none"
      :style="{
        backgroundImage: `linear-gradient(rgba(120, 119, 198, ${config.effects.grid.opacity * 0.1}) 1px, transparent 1px), linear-gradient(90deg, rgba(120, 119, 198, ${config.effects.grid.opacity * 0.1}) 1px, transparent 1px)`,
        backgroundSize: `${config.effects.grid.size}px ${config.effects.grid.size}px`
      }"
    />

    <!-- 浮动光球 -->
    <div v-if="config.effects.orbs.enabled && !prefersReducedMotion" class="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        v-for="orb in orbs" 
        :key="orb.id"
        class="absolute rounded-full animate-float-orb"
        :style="{
          width: `${orb.size}px`,
          height: `${orb.size}px`,
          left: `${orb.x}%`,
          top: `${orb.y}%`,
          background: orb.gradient,
          filter: `blur(${config.effects.orbs.blur}px)`,
          animationDuration: `${orb.duration}s`,
          animationDelay: `${orb.delay}s`
        }"
      />
    </div>

    <!-- 粒子效果 -->
    <div v-if="config.effects.particles.enabled && !prefersReducedMotion" class="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        v-for="particle in particles" 
        :key="particle.id"
        class="absolute rounded-full animate-float-particle"
        :style="{
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          left: `${particle.x}%`,
          backgroundColor: config.effects.particles.color,
          opacity: particle.opacity,
          animationDuration: `${config.effects.particles.speed + particle.speedOffset}s`
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWallpaper } from '@/composables/useWallpaper'

const { config, backgroundCSS, initWallpaper } = useWallpaper()

// ========== 性能优化：智能动画暂停 ==========
// 当页面不可见（标签页切走、最小化）时暂停所有 CSS 动画，降低 GPU 占用
const isPaused = ref(false)
const prefersReducedMotion = ref(false)

function handleVisibilityChange() {
  isPaused.value = document.hidden
}

function checkReducedMotion() {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 判断是否动画背景
const isAnimated = computed(() => {
  if (prefersReducedMotion.value) return false
  if (config.value.base.type === 'preset') {
    const preset = config.value.base.value
    return preset === 'aurora'
  }
  return config.value.animation.gradientShift
})

// 生成浮动光球
const orbs = computed(() => {
  const count = config.value.effects.orbs.count
  const colors = [
    'radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent)',
    'radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent)',
    'radial-gradient(circle, rgba(236, 72, 153, 0.25), transparent)',
    'radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent)'
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 200 + Math.random() * 300,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    gradient: colors[i % colors.length],
    duration: 15 + Math.random() * 10,
    delay: i * 2
  }))
})

// 生成粒子
const particles = computed(() => {
  const count = config.value.effects.particles.count
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 4,
    x: Math.random() * 100,
    opacity: 0.1 + Math.random() * 0.5,
    speedOffset: Math.random() * 10 - 5
  }))
})

// 媒体查询监听器引用，用于卸载时清理
let motionQuery: MediaQueryList | null = null

onMounted(() => {
  initWallpaper()
  
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  // 监听用户动画偏好设置
  checkReducedMotion()
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener('change', checkReducedMotion)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  motionQuery?.removeEventListener('change', checkReducedMotion)
})
</script>

<style scoped>
/* 性能优化：页面不可见时暂停所有动画 */
.animations-paused,
.animations-paused * {
  animation-play-state: paused !important;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(20px, 30px) scale(1.05);
  }
}

.animate-float-orb {
  animation: float-orb ease-in-out infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-10vh) rotate(360deg);
    opacity: 0;
  }
}

.animate-float-particle {
  animation: float-particle linear infinite;
}
</style>
