<template>
  <BentoCard size="small" gradient="pink" title="SOCIAL" icon="🔗">
    <div class="space-y-2">
      <a 
        v-for="link in data.socialLinks" 
        :key="link.name"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-pink-500/10 hover:border-pink-500/30 transition-all group"
      >
        <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
          <span class="text-sm">{{ getLinkIcon(link.name) }}</span>
        </div>
        <span class="text-sm text-gray-300 group-hover:text-white transition-colors">
          {{ link.name }}
        </span>
        <svg class="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  </BentoCard>
</template>

<script setup lang="ts">
import { resumeData } from '@/data/resume'
import BentoCard from '@/components/BentoCard.vue'

const data = resumeData

const getLinkIcon = (name: string) => {
  const icons: Record<string, string> = {
    'GitHub': '👨‍💻',
    'Email': '📧',
    'LinkedIn': '💼',
    'Twitter': '🐦',
    'Blog': '📝'
  }
  return icons[name] || '🔗'
}
</script>
