<template>
  <section
    id="about"
    ref="targetRef"
    class="py-20 px-6 relative overflow-hidden"
  >
    <!-- 极光背景 -->
    <div class="absolute inset-0 bg-aurora opacity-30 animate-aurora"></div>
    <div class="absolute inset-0 bg-mesh-gradient opacity-20"></div>
    
    <!-- 浮动装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -right-32 w-72 h-72 bg-gradient-start/10 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/4 -left-32 w-80 h-80 bg-gradient-end/10 rounded-full blur-3xl animate-float-slower" style="animation-delay: 2s;"></div>
    </div>

    <div class="max-w-container mx-auto relative z-10">
      <SectionTitle title="About" subtitle="多领域技术储备，工程实践经验丰富" />

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="(item, index) in data.about"
          :key="index"
          class="group relative"
          :class="[
            'transition-all duration-600',
            { 'opacity-0 translate-y-4': !isVisible },
            { 'opacity-100 translate-y-0': isVisible }
          ]"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <!-- 卡片外层渐变边框 -->
          <div class="absolute -inset-0.5 bg-gradient-primary rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500"></div>
          
          <div class="relative glass-strong rounded-2xl p-6 border border-white/20 dark:border-white/10 hover:border-gradient-start/30 transition-all duration-300">
            <div class="flex gap-4">
              <!-- 图标装饰 -->
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-purple/30">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <!-- 文本内容 -->
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                {{ item.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resumeData } from '@/data/resume'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import SectionTitle from '@/components/SectionTitle.vue'

const data = resumeData
const { isVisible, targetRef } = useIntersectionObserver()
</script>
