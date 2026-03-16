<template>
  <section
    id="projects"
    class="py-20 px-6 relative overflow-hidden"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
    </div>

    <div class="max-w-container mx-auto relative">
      <SectionTitle
        title="Projects"
        subtitle="项目经历与技术实践 · 创新思维与工程实践的结合"
      />

      <!-- 时间线装饰 -->
      <div class="hidden lg:block absolute left-1/2 top-32 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 via-accent/20 to-transparent -ml-px"></div>

      <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
        <ProjectCard
          v-for="(project, index) in data.projects"
          :key="project.id"
          :index="index"
          :title="project.title"
          :period="project.period"
          :description="project.description"
          :highlights="project.highlights"
          :technologies="project.technologies"
          :role="project.role"
        />
      </div>

      <!-- 底部装饰 -->
      <div class="mt-16 flex justify-center">
        <div class="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-accent/10 via-primary-500/10 to-accent/10 border border-accent/20 backdrop-blur-sm">
          <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">共 {{ data.projects.length }} 个项目</span>
          <div class="w-2 h-2 rounded-full bg-primary-500 animate-pulse" style="animation-delay: 0.5s;"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resumeData } from '@/data/resume'
import ProjectCard from '@/components/ProjectCard.vue'
import SectionTitle from '@/components/SectionTitle.vue'

const data = resumeData
</script>
