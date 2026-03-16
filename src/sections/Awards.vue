<template>
  <section
    id="awards"
    ref="sectionRef"
    class="py-20 px-6 relative overflow-hidden"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/3 -right-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-1/4 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style="animation-delay: 1.5s;"></div>
    </div>

    <div class="max-w-container mx-auto relative">
      <SectionTitle
        title="Awards & Honors"
        subtitle="竞赛获奖与荣誉认证"
      />

      <!-- 奖项网格 -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(award, index) in data.awards"
          :key="award.id"
          :class="[
            'group relative transition-all duration-700',
            { 'opacity-0 translate-y-8': !isVisible },
            { 'opacity-100 translate-y-0': isVisible }
          ]"
          :style="{ transitionDelay: `${index * 80}ms` }"
        >
          <!-- 背景光晕 -->
          <div
            :class="[
              'absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500',
              award.level === '国家级' ? 'bg-gradient-to-r from-red-500/30 to-orange-500/30' :
              award.level === '省级' ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30' :
              'bg-gradient-to-r from-accent/20 to-primary-500/20'
            ]"
          ></div>

          <!-- 主卡片 -->
          <div class="relative h-full bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-dark-border/50 overflow-hidden transition-all duration-500 hover:border-accent/50 hover:shadow-glow">
            <!-- 顶部装饰条 -->
            <div
              :class="[
                'h-1.5',
                award.level === '国家级' ? 'bg-gradient-to-r from-red-500 via-orange-500 to-red-500' :
                award.level === '省级' ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500' :
                'bg-gradient-to-r from-accent/50 via-primary-500/50 to-accent/50'
              ]"
            ></div>

            <!-- 背景装饰图案 -->
            <div class="absolute top-0 right-0 w-32 h-32 opacity-5">
              <svg class="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50,5 L61,36 L95,36 L68,57 L79,88 L50,67 L21,88 L32,57 L5,36 L39,36 Z" />
              </svg>
            </div>

            <div class="relative p-6 space-y-4">
              <!-- 等级标签 -->
              <div class="flex items-center justify-between gap-3">
                <div
                  :class="[
                    'relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border-2 transition-all duration-300 group-hover:scale-105',
                    award.level === '国家级'
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/50 text-red-600 dark:text-red-400 group-hover:border-red-500'
                      : award.level === '省级'
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-600 dark:text-blue-400 group-hover:border-blue-500'
                      : 'bg-gradient-to-r from-accent/10 to-primary-500/10 border-accent/30 text-accent group-hover:border-accent'
                  ]"
                >
                  <!-- 奖牌图标 -->
                  <svg class="w-4 h-4" :class="award.level === '国家级' ? 'animate-pulse-slow' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>{{ award.level }}</span>
                </div>

                <!-- 年份标签 -->
                <div v-if="award.year" class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="font-semibold">{{ award.year }}</span>
                </div>
              </div>

              <!-- 奖项标题 -->
              <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-relaxed min-h-[3.5rem] flex items-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-primary-500 transition-all duration-500">
                {{ award.title }}
              </h3>

              <!-- 装饰性底部渐变 -->
              <div
                :class="[
                  'h-0.5 w-0 group-hover:w-full transition-all duration-700',
                  award.level === '国家级' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                  award.level === '省级' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                  'bg-gradient-to-r from-accent to-primary-500'
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计装饰 -->
      <div class="mt-16 flex flex-wrap justify-center gap-6">
        <div
          v-for="(stat, index) in awardStats"
          :key="stat.label"
          :style="{ animationDelay: `${index * 150}ms` }"
          :class="[
            'flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-dark-card/80 dark:to-dark-bg/80 backdrop-blur-sm border border-gray-200/50 dark:border-dark-border/50 transition-all duration-600',
            { 'opacity-0 translate-y-4': !isVisible },
            { 'opacity-100 translate-y-0': isVisible }
          ]"
        >
          <div :class="[
            'w-3 h-3 rounded-full',
            stat.label === '国家级' ? 'bg-red-500 animate-pulse' :
            stat.label === '省级' ? 'bg-blue-500 animate-pulse' :
            'bg-accent animate-pulse'
          ]" style="animation-delay: 0.5s;"></div>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</span>
          <span class="text-xl font-bold text-gray-900 dark:text-white">{{ stat.count }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resumeData } from '@/data/resume'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import SectionTitle from '@/components/SectionTitle.vue'

const data = resumeData
const { isVisible, targetRef: sectionRef } = useIntersectionObserver()

// 统计各级别奖项数量
const awardStats = computed(() => {
  const stats = {
    '国家级': 0,
    '省级': 0,
    '校级': 0
  }

  data.awards.forEach(award => {
    if (award.level in stats) {
      stats[award.level as keyof typeof stats]++
    }
  })

  return Object.entries(stats)
    .filter(([_, count]) => count > 0)
    .map(([label, count]) => ({ label, count }))
})
</script>
