<template>
  <AnimatedSection :delay="0">
    <BentoCard size="medium" gradient="blue" :title="$t('education.cardTitle')" icon="🎓" :show-gradient-bar="true">
      <div class="space-y-4">
        <!-- School Info -->
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl shrink-0">
            🏫
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">{{ data.education.school }}</h3>
            <p class="text-blue-400 text-sm font-medium">{{ data.education.major }}</p>
          </div>
        </div>
        
        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 rounded-xl bg-white/5">
            <p class="text-xs text-gray-500 mb-1">{{ $t('education.degree') }}</p>
            <p class="text-sm font-medium text-white">{{ data.education.degree }}</p>
          </div>
          <div class="p-3 rounded-xl bg-white/5">
            <p class="text-xs text-gray-500 mb-1">{{ $t('education.gpa') }}</p>
            <p class="text-sm font-medium text-white">{{ data.education.gpa }}</p>
          </div>
          <div class="p-3 rounded-xl bg-white/5">
            <p class="text-xs text-gray-500 mb-1">{{ $t('education.period') }}</p>
            <p class="text-sm font-medium text-white">{{ data.education.period }}</p>
          </div>
          <div class="p-3 rounded-xl bg-white/5">
            <p class="text-xs text-gray-500 mb-1">{{ $t('education.honors') }}</p>
            <p class="text-sm font-medium text-white">{{ data.education.highlights.join(' · ') }}</p>
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
</script>
