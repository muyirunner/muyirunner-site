<template>
  <BentoCard size="small" gradient="blue">
    <div class="h-full flex flex-col justify-center items-center text-center">
      <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
        <span class="text-xl">📍</span>
      </div>
      <p class="text-lg font-semibold text-white">{{ data.personalInfo.location }}</p>
      <p class="text-sm text-gray-400 mt-1">现居地</p>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { resumeData } from '@/data/resume'
import BentoCard from '@/components/BentoCard.vue'

const data = resumeData
</script>
