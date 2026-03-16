<template>
  <section id="projects">
    <AnimatedSection :delay="100">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">{{ $t('projects.title') }}</h2>
        <p class="text-gray-400">{{ $t('projects.subtitle') }}</p>
      </div>
    </AnimatedSection>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatedSection 
        v-for="(project, index) in data.projects" 
        :key="project.id"
        :delay="200 + index * 100"
      >
        <div 
          class="group relative h-full p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] hover:border-white/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1"
        >
          <!-- Top gradient bar -->
          <div 
            class="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r"
            :class="projectGradients[index % projectGradients.length]"
          ></div>
          
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                {{ project.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ project.role }} · {{ project.period }}
              </p>
            </div>
            
            <!-- Project type icon -->
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              :class="projectIconBg[index % projectIconBg.length]"
            >
              <span class="text-lg">{{ getProjectIcon(project.title) }}</span>
            </div>
          </div>
          
          <!-- Description -->
          <p class="text-sm text-gray-400 mb-4 line-clamp-2">
            {{ project.description }}
          </p>
          
          <!-- Highlights -->
          <ul class="space-y-2 mb-4">
            <li 
              v-for="(highlight, hIndex) in project.highlights.slice(0, 2)" 
              :key="hIndex"
              class="flex items-start gap-2 text-sm text-gray-300"
            >
              <span class="text-purple-400 mt-0.5">→</span>
              <span class="line-clamp-1">{{ highlight }}</span>
            </li>
          </ul>
          
          <!-- Tech stack -->
          <div class="flex flex-wrap gap-2 mt-auto">
            <span 
              v-for="tech in project.technologies.slice(0, 4)"
              :key="tech"
              class="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-gray-400 border border-white/5"
            >
              {{ tech }}
            </span>
            <span 
              v-if="project.technologies.length > 4"
              class="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-gray-500"
            >
              +{{ project.technologies.length - 4 }}
            </span>
          </div>
          
          <!-- Hover glow -->
          <div 
            class="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
            :class="projectGlowColors[index % projectGlowColors.length]"
          ></div>
        </div>
      </AnimatedSection>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useResume } from '@/composables/useResume'
import AnimatedSection from '@/components/AnimatedSection.vue'

const { resume: data } = useResume()

const projectGradients = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-yellow-500'
]

const projectIconBg = [
  'bg-purple-500/10',
  'bg-blue-500/10',
  'bg-green-500/10',
  'bg-orange-500/10'
]

const projectGlowColors = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500'
]

function getProjectIcon(title: string) {
  if (/游戏|UE5|Game/.test(title)) return '🎮'
  if (/小程序|Mini Program|WeChat/.test(title)) return '📱'
  if (/隐私|联邦|Privacy|Federated/.test(title)) return '🔐'
  return '📂'
}
</script>
