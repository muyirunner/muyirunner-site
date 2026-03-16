<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-white">壁纸设置</h3>
      <button 
        @click="resetToDefault"
        class="text-sm text-gray-400 hover:text-white transition-colors"
      >
        恢复默认
      </button>
    </div>

    <!-- 壁纸预览网格 -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <button
        v-for="wallpaper in availableWallpapers"
        :key="wallpaper.id"
        @click="setWallpaper(wallpaper.id)"
        :class="[
          'relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 group',
          currentWallpaperId === wallpaper.id 
            ? 'border-purple-500 ring-2 ring-purple-500/30' 
            : 'border-white/10 hover:border-white/30'
        ]"
      >
        <!-- 预览背景 -->
        <div 
          class="absolute inset-0"
          :style="{ background: wallpaper.preview }"
        />
        
        <!-- 选中标记 -->
        <div 
          v-if="currentWallpaperId === wallpaper.id"
          class="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <!-- 壁纸名称 -->
        <div class="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <p class="text-xs text-white text-center font-medium">
            {{ wallpaper.name }}
          </p>
        </div>

        <!-- 动画标记 -->
        <div 
          v-if="wallpaper.type === 'animated'"
          class="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs bg-purple-500/80 text-white"
        >
          动画
        </div>
      </button>
    </div>

    <!-- 当前选择提示 -->
    <p class="text-sm text-gray-400 text-center">
      当前壁纸: <span class="text-purple-400">{{ currentWallpaper.name }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useWallpaper } from '@/composables/useWallpaper'

const { 
  currentWallpaper, 
  currentWallpaperId, 
  availableWallpapers, 
  setWallpaper, 
  resetToDefault 
} = useWallpaper()
</script>
