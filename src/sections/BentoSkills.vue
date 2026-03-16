<template>
  <section id="skills">
    <AnimatedSection :delay="100">
      <BentoCard size="full" gradient="purple" :title="$t('skills.cardTitle')" icon="💡" :show-gradient-bar="true">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(group, index) in data.skills" 
            :key="group.category"
            class="space-y-4"
          >
            <h4 class="text-sm font-semibold text-white flex items-center gap-2">
              <span class="text-lg">{{ categoryIcons[index] }}</span>
              {{ group.category }}
            </h4>
            
            <div class="space-y-3">
              <div 
                v-for="skill in group.skills" 
                :key="skill"
                class="group"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm text-gray-300">{{ getCleanSkillName(skill) }}</span>
                  <span class="text-xs text-gray-500">{{ getSkillLevel(skill) }}</span>
                </div>
                <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-1000 ease-out"
                    :class="getProgressBarClass(index)"
                    :style="{ width: isVisible ? `${getSkillPercent(skill)}%` : '0%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BentoCard>
    </AnimatedSection>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useResume } from '@/composables/useResume'
import BentoCard from '@/components/BentoCard.vue'
import AnimatedSection from '@/components/AnimatedSection.vue'

const { resume: data } = useResume()
const isVisible = ref(false)

const categoryIcons = ['💻', '🎨', '🗄️', '🎮']

const progressBarClasses = [
  'bg-gradient-to-r from-purple-500 to-pink-500',
  'bg-gradient-to-r from-blue-500 to-cyan-500',
  'bg-gradient-to-r from-green-500 to-emerald-500',
  'bg-gradient-to-r from-orange-500 to-yellow-500'
]

function getCleanSkillName(skill: string) {
  return skill.replace(/\s*\([^)]*\)/g, '').trim()
}

function getSkillLevel(skill: string) {
  if (skill.includes('熟练') || skill.includes('Proficient')) return skill.includes('Proficient') ? 'Proficient' : '熟练'
  if (skill.includes('良好') || skill.includes('Good')) return skill.includes('Good') ? 'Good' : '良好'
  return ''
}

function getSkillPercent(skill: string) {
  if (skill.includes('熟练') || skill.includes('Proficient')) return 90
  if (skill.includes('良好') || skill.includes('Good')) return 75
  return 80 + Math.random() * 15
}

function getProgressBarClass(index: number) {
  return progressBarClasses[index % progressBarClasses.length]
}

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 500)
})
</script>
