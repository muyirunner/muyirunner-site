<template>
  <section id="education" class="py-20 px-6 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-mesh-gradient opacity-10"></div>
    <div class="absolute -left-20 top-40 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute right-0 bottom-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"></div>

    <div class="max-w-container mx-auto relative z-10">
      <SectionTitle title="Education" subtitle="教育背景 · 扎实的理论基础" />

      <div class="max-w-3xl mx-auto">
        <div class="group relative">
          <!-- 卡片外发光 -->
          <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 via-accent to-primary-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          
          <div class="relative glass-strong rounded-2xl p-8 border border-white/20 dark:border-white/10 overflow-hidden">
            <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
              
              <!-- 学校图标/Logo占位 -->
              <div class="flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-100 to-white dark:from-dark-bg dark:to-dark-card flex items-center justify-center shadow-inner border border-gray-200 dark:border-gray-700">
                <span class="text-4xl">🎓</span>
              </div>

              <div class="flex-grow space-y-4">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h3 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary">
                      {{ data.education.school }}
                    </h3>
                    <p class="text-lg text-gray-700 dark:text-gray-300 font-medium mt-1">
                      {{ data.education.major }}
                    </p>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold border border-primary-500/20">
                      {{ data.education.period }}
                    </span>
                  </div>
                </div>

                <!-- 详情网格 -->
                <div class="grid grid-cols-2 gap-4 pt-2">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500">GPA</div>
                      <div class="font-bold text-gray-900 dark:text-white">{{ data.education.gpa }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500">学位</div>
                      <div class="font-bold text-gray-900 dark:text-white">{{ data.education.degree }}</div>
                    </div>
                  </div>
                </div>

                <!-- 标签 -->
                <div class="flex flex-wrap gap-2 pt-2">
                  <span v-for="tag in data.education.highlights" :key="tag" class="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resumeData } from '@/data/resume'
import SectionTitle from '@/components/SectionTitle.vue'

const data = resumeData
</script>
