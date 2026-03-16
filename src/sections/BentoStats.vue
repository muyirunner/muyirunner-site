<template>
  <section id="stats" class="relative">
    <AnimatedSection :delay="100">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(stat, index) in stats" 
          :key="stat.label"
          class="relative group p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] hover:border-white/20 backdrop-blur-xl transition-all duration-300"
        >
          <!-- Icon -->
          <div 
            class="w-12 h-12 mb-4 rounded-xl flex items-center justify-center text-2xl"
            :class="stat.bgClass"
          >
            {{ stat.icon }}
          </div>
          
          <!-- Number with animation -->
          <div class="text-3xl md:text-4xl font-bold text-white mb-1">
            <span ref="numberRefs" :data-target="stat.value">0</span>
            <span class="text-xl ml-1" :class="stat.textClass">{{ stat.suffix }}</span>
          </div>
          
          <!-- Label -->
          <p class="text-sm text-gray-400">{{ stat.label }}</p>
          
          <!-- Decorative corner -->
          <div 
            class="absolute -bottom-10 -right-10 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
            :style="{ background: `radial-gradient(circle, ${stat.color}, transparent 70%)` }"
          ></div>
        </div>
      </div>
    </AnimatedSection>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResume } from '@/composables/useResume'
import AnimatedSection from '@/components/AnimatedSection.vue'

const { t } = useI18n()
const { resume: data } = useResume()

const stats = computed(() => [
  {
    icon: '📂',
    value: data.value.projects.length,
    suffix: t('stats.projects').includes('Project') ? '' : '个', // 简单的处理单位
    label: t('stats.projects'),
    color: '#a855f7',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400'
  },
  {
    icon: '💼',
    value: data.value.experiences.length,
    suffix: t('stats.projects').includes('Project') ? '' : '段',
    label: t('stats.experience'),
    color: '#3b82f6',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400'
  },
  {
    icon: '🏆',
    value: data.value.awards.length,
    suffix: t('stats.projects').includes('Project') ? '' : '项',
    label: t('stats.awards'),
    color: '#f97316',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-400'
  },
  {
    icon: '💡',
    value: data.value.skills.reduce((acc, g) => acc + g.skills.length, 0),
    suffix: '+',
    label: t('stats.skills'),
    color: '#22c55e',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-400'
  }
])

const numberRefs = ref<HTMLElement[]>([]) // Keeping for future use or remove if strict
// Actually I'll keep it but fix v-for index warning
/*
const stats = computed(() => [
...
])
*/
// Re-writing template v-for to remove index


// Animate numbers on mount
onMounted(() => {
  const elements = document.querySelectorAll('[data-target]')
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement
        const target = parseInt(el.dataset.target || '0')
        animateNumber(el, target)
        observer.unobserve(el)
      }
    })
  }, { threshold: 0.5 })
  
  elements.forEach(el => observer.observe(el))
})

function animateNumber(el: HTMLElement, target: number) {
  const duration = 1500
  const start = performance.now()
  
  function update(currentTime: number) {
    const elapsed = currentTime - start
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(easeOut * target)
    
    el.textContent = current.toString()
    
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      el.textContent = target.toString()
    }
  }
  
  requestAnimationFrame(update)
}
</script>
