<template>
  <button
    @click="toggleLanguage"
    class="fixed top-5 right-5 z-[55] group hidden md:block"
    :title="isEn ? 'Switch to Chinese' : '切换到英文'"
  >
    <div class="relative w-11 h-11 rounded-xl glass border border-white/20 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-glow-blue hover:scale-110 hover:border-blue-500/50">
      <span class="text-sm font-bold gradient-text">{{ isEn ? 'EN' : '中' }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const isEn = computed(() => locale.value === 'en')

function toggleLanguage() {
  locale.value = isEn.value ? 'zh' : 'en'
  localStorage.setItem('locale', locale.value)
}
</script>
