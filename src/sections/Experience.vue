<template>
  <section
    id="experience"
    class="py-20 px-6 relative overflow-hidden"
  >
    <!-- 极光背景 -->
    <div class="absolute inset-0 bg-aurora opacity-30 animate-aurora"></div>
    <div class="absolute inset-0 bg-mesh-gradient opacity-20"></div>
    
    <!-- 浮动装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -right-32 w-80 h-80 bg-gradient-start/10 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/4 -left-32 w-96 h-96 bg-gradient-end/10 rounded-full blur-3xl animate-float-slower" style="animation-delay: 2s;"></div>
    </div>

    <div class="max-w-container mx-auto relative z-10">
      <SectionTitle
        title="Experience"
        subtitle="工作经历 · 专业成长与项目实践"
      />
      
      <!-- 发光时间轴装饰线 -->
      <div class="hidden lg:block absolute left-1/2 top-40 bottom-20 w-0.5 -ml-px">
        <div class="h-full bg-gradient-to-b from-gradient-start via-gradient-middle to-gradient-end opacity-50 rounded-full"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-gradient-start via-gradient-middle to-gradient-end blur-sm opacity-30 animate-glow-pulse"></div>
      </div>
      
      <Timeline>
        <TimelineItem
          v-for="exp in data.experiences"
          :key="exp.id"
          :title="`${exp.position} @ ${exp.company}`"
          :subtitle="exp.location || ''"
          :period="exp.period"
          :items="exp.responsibilities"
        />
      </Timeline>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resumeData } from '@/data/resume'
import Timeline from '@/components/Timeline.vue'
import TimelineItem from '@/components/TimelineItem.vue'
import SectionTitle from '@/components/SectionTitle.vue'

const data = resumeData
</script>
