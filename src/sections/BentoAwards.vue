<template>
  <AnimatedSection :delay="100">
    <BentoCard size="medium" gradient="orange" :title="$t('awards.cardTitle')" icon="🏆" :show-gradient-bar="true">
      <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
        <div 
          v-for="award in data.awards" 
          :key="award.id"
          class="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-orange-500/5 border border-white/5 hover:border-orange-500/20 transition-all group"
        >
          <!-- Level icon -->
          <div 
            class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg"
            :class="getLevelClass(award.level)"
          >
            {{ getLevelIcon(award.level) }}
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white leading-snug group-hover:text-orange-400 transition-colors">
              {{ award.title }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span 
                class="px-2 py-0.5 text-xs rounded-full"
                :class="getLevelBadgeClass(award.level)"
              >
                {{ award.level }}
              </span>
              <span class="text-xs text-gray-500">{{ award.year }}</span>
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  </AnimatedSection>
</template>

<script setup lang="ts">
import { useResume } from '@/composables/useResume'
import BentoCard from '@/components/BentoCard.vue'
import AnimatedSection from '@/components/AnimatedSection.vue'

const { resume: data } = useResume()

function getLevelIcon(level: string) {
  if (level.includes('国家') || level.includes('National')) return '🥇'
  if (level.includes('省') || level.includes('Provincial')) return '🥈'
  return '🏅'
}

function getLevelClass(level: string) {
  if (level.includes('国家') || level.includes('National')) return 'bg-yellow-500/10'
  if (level.includes('省') || level.includes('Provincial')) return 'bg-gray-400/10'
  return 'bg-orange-500/10'
}

function getLevelBadgeClass(level: string) {
  if (level.includes('国家') || level.includes('National')) return 'bg-yellow-500/20 text-yellow-400'
  if (level.includes('省') || level.includes('Provincial')) return 'bg-gray-400/20 text-gray-300'
  return 'bg-orange-500/20 text-orange-400'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
