<template>
  <section id="experience">
    <AnimatedSection :delay="100">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">{{ $t('experience.title') }}</h2>
        <p class="text-gray-400">{{ $t('experience.subtitle') }}</p>
      </div>
    </AnimatedSection>
    
    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-transparent"></div>
      
      <!-- Experience items -->
      <div class="space-y-8">
        <AnimatedSection 
          v-for="(exp, index) in data.experiences" 
          :key="exp.id"
          :delay="200 + index * 150"
        >
          <div class="relative pl-12 md:pl-20">
            <!-- Timeline dot -->
            <div 
              class="absolute left-0 md:left-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
              :class="index === 0 ? 'bg-purple-500 shadow-lg shadow-purple-500/50' : 'bg-gray-700 border-2 border-gray-600'"
            >
              <span class="text-sm">{{ index === 0 ? '💼' : '📋' }}</span>
            </div>
            
            <!-- Content card -->
            <div 
              class="group p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] hover:border-white/20 backdrop-blur-xl transition-all duration-300"
            >
              <!-- Header -->
              <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 class="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {{ exp.position }}
                  </h3>
                  <p class="text-purple-400 font-medium">{{ exp.company }}</p>
                </div>
                
                <div class="flex items-center gap-2 text-sm text-gray-400">
                  <span>📍 {{ exp.location }}</span>
                  <span>·</span>
                  <span>{{ exp.period }}</span>
                </div>
              </div>
              
              <!-- Responsibilities -->
              <ul class="space-y-3">
                <li 
                  v-for="(resp, rIndex) in exp.responsibilities" 
                  :key="rIndex"
                  class="flex items-start gap-3 text-gray-300"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></span>
                  <span class="text-sm leading-relaxed">{{ resp }}</span>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useResume } from '@/composables/useResume'
import AnimatedSection from '@/components/AnimatedSection.vue'

const { resume: data } = useResume()
</script>
