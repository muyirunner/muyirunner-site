<template>
  <section
    id="skills"
    class="py-20 px-6 relative overflow-hidden"
  >
    <!-- 极光背景 -->
    <div class="absolute inset-0 bg-aurora opacity-30 animate-aurora"></div>
    <div class="absolute inset-0 bg-mesh-gradient opacity-20"></div>
    
    <!-- 浮动装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/3 -right-32 w-72 h-72 bg-gradient-end/15 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-1/4 -left-24 w-64 h-64 bg-gradient-start/15 rounded-full blur-3xl animate-float-slow" style="animation-delay: 1.5s;"></div>
      <div class="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-pink/10 rounded-full blur-3xl animate-float-slower" style="animation-delay: 3s;"></div>
    </div>

    <div class="max-w-container mx-auto relative z-10">
      <SectionTitle
        title="Skills"
        subtitle="专业技能 · 持续学习与实践积累"
      />

      <div class="grid md:grid-cols-2 gap-8">
        <SkillGroup
          v-for="skillGroup in data.skills"
          :key="skillGroup.category"
          :category="skillGroup.category"
          :skills="skillGroup.skills"
        />
      </div>

      <!-- 底部装饰徽章 -->
      <div class="mt-12 flex justify-center">
        <div class="flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-gradient-start/30 shadow-glow-purple/20">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-start opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-primary"></span>
          </span>
          <span class="text-sm font-medium gradient-text">不断精进中</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resumeData } from '@/data/resume'
import SkillGroup from '@/components/SkillGroup.vue'
import SectionTitle from '@/components/SectionTitle.vue'

const data = resumeData
</script>
