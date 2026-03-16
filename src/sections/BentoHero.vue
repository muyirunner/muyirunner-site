<template>
  <div id="hero" class="min-h-screen flex flex-col justify-center items-center px-6 py-20 relative">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Gradient orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 text-center max-w-4xl mx-auto">
      <!-- Greeting -->
      <AnimatedSection :delay="0">
        <p class="text-sm font-medium text-gray-400 mb-4 tracking-widest uppercase">
          {{ greeting }}
        </p>
      </AnimatedSection>

      <!-- Name - Large Typography -->
      <AnimatedSection :delay="100">
        <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span class="text-white">{{ $t('hero.im') }}</span>
          <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            {{ data.personalInfo.name }}
          </span>
        </h1>
      </AnimatedSection>

      <!-- Position tagline -->
      <AnimatedSection :delay="200">
        <p class="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light mb-8">
          {{ data.personalInfo.targetPosition }}
        </p>
      </AnimatedSection>

      <!-- Description -->
      <AnimatedSection :delay="300">
        <p class="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {{ data.about[0].text + data.about[1].text }}
        </p>
      </AnimatedSection>

      <!-- Skill Tags Cloud -->
      <AnimatedSection :delay="400">
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <span
            v-for="(skill, index) in displaySkills"
            :key="skill"
            :class="[
              'px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-default',
              skillStyles[index % skillStyles.length]
            ]"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            {{ skill }}
          </span>
        </div>
      </AnimatedSection>

      <!-- CTA Buttons -->
      <AnimatedSection :delay="500">
        <div class="flex flex-wrap justify-center gap-4">
          <a
            href="#projects"
            class="group relative px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-base sm:text-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            @click.prevent="scrollTo('projects')"
          >
            <span class="relative z-10">{{ $t('hero.viewProjects') }}</span>
            <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </a>
          
          <router-link
            to="/resume-print"
            class="px-6 py-3 sm:px-8 sm:py-4 rounded-full border border-white/20 text-white font-medium text-base sm:text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ $t('hero.downloadResume') }}
          </router-link>
        </div>
      </AnimatedSection>
    </div>

    <!-- Scroll indicator -->
    <AnimatedSection :delay="800" class="absolute bottom-8 left-1/2 -translate-x-1/2">
      <div class="flex flex-col items-center gap-2 text-gray-500">
        <span class="text-xs tracking-wider">{{ $t('hero.scroll') }}</span>
        <div class="w-5 h-8 rounded-full border-2 border-gray-500/50 flex justify-center pt-2">
          <div class="w-1 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </AnimatedSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResume } from '@/composables/useResume'
import AnimatedSection from '@/components/AnimatedSection.vue'

const { t } = useI18n()
const { resume: data } = useResume()

// Greeting based on time
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return t('hero.greeting.night')
  if (hour < 12) return t('hero.greeting.morning')
  if (hour < 18) return t('hero.greeting.afternoon')
  return t('hero.greeting.evening')
})

// Extract skills for display
const displaySkills = computed(() => {
  const allSkills: string[] = []
  if (!data.value) return []
  
  data.value.skills.forEach(group => {
    group.skills.slice(0, 2).forEach(skill => {
      // Clean up skill name
      const cleanSkill = skill.replace(/\s*\([^)]*\)/g, '').trim()
      if (!allSkills.includes(cleanSkill) && allSkills.length < 8) {
        allSkills.push(cleanSkill)
      }
    })
  })
  return allSkills
})

// Skill tag styles
const skillStyles = [
  'bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20',
  'bg-pink-500/10 text-pink-300 border border-pink-500/20 hover:bg-pink-500/20',
  'bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20',
  'bg-green-500/10 text-green-300 border border-green-500/20 hover:bg-green-500/20',
  'bg-orange-500/10 text-orange-300 border border-orange-500/20 hover:bg-orange-500/20',
  'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20'
]

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 100,
      behavior: 'smooth'
    })
  }
}
</script>
