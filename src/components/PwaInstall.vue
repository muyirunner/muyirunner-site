<template>
  <button
    v-if="deferredPrompt"
    @click="installPwa"
    class="flex items-center gap-3 px-4 py-3 text-left w-full hover:bg-white/5 transition-colors text-gray-300 hover:text-white group"
  >
    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all">
      <svg class="w-4 h-4 text-purple-400 group-hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </div>
    <div class="flex-1">
      <div class="text-sm font-medium">安装应用</div>
      <div class="text-xs text-gray-500 group-hover:text-gray-400">添加到桌面</div>
    </div>
  </button>
  <!-- Debug info for dev (optional) -->
  <!-- <div v-else class="text-xs text-gray-500 px-4 py-2 opacity-50">App Install Ready</div> -->
</template>

<script setup lang="ts">
import { usePWA } from '@/composables/usePWA'

const { deferredPrompt, installPwa } = usePWA()
</script>
