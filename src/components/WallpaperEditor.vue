<template>
  <div class="flex h-full gap-6">
    <!-- 左侧控制面板 -->
    <div class="w-80 shrink-0 space-y-6 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
      <!-- 壁纸类型选择 -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-white flex items-center gap-2">
          <span>🖼️</span> 壁纸类型
        </h3>
        
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="t in baseTypes"
            :key="t.value"
            @click="handleTypeChange(t.value)"
            :class="[
              'p-3 rounded-xl text-sm text-left transition-all border',
              config.base.type === t.value 
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            ]"
          >
            <span class="text-lg block mb-1">{{ t.icon }}</span>
            <span>{{ t.label }}</span>
          </button>
        </div>
      </div>

      <!-- 预设选择 -->
      <div v-if="config.base.type === 'preset'" class="space-y-3">
        <h3 class="text-sm font-semibold text-white">预设壁纸</h3>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="wp in availableWallpapers"
            :key="wp.id"
            @click="setPreset(wp.id)"
            :class="[
              'p-2 rounded-xl border transition-all',
              config.base.value === wp.id 
                ? 'border-purple-500 ring-2 ring-purple-500/30' 
                : 'border-white/10 hover:border-white/30'
            ]"
          >
            <div 
              class="h-12 rounded-lg mb-2"
              :style="{ background: wp.preview }"
            ></div>
            <span class="text-xs text-gray-300">{{ wp.name }}</span>
          </button>
        </div>
      </div>

      <!-- 图片上传 -->
      <div v-if="config.base.type === 'image'">
        <ImageUploader 
          v-model="imageUrl"
          label="自定义图片"
          @update:model-value="handleImageChange"
        />
      </div>

      <!-- 渐变编辑器 -->
      <div v-if="config.base.type === 'gradient'">
        <GradientPicker 
          v-model="gradientCss"
          label="自定义渐变"
          @update:model-value="handleGradientChange"
        />
      </div>

      <!-- 纯色选择 -->
      <div v-if="config.base.type === 'solid'" class="space-y-3">
        <h3 class="text-sm font-semibold text-white">纯色背景</h3>
        <div class="flex items-center gap-4">
          <input 
            type="color"
            :value="solidColor"
            @input="handleSolidChange(($event.target as HTMLInputElement).value)"
            class="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
          />
          <span class="text-sm text-gray-400">{{ solidColor }}</span>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="border-t border-white/10 pt-4">
        <h3 class="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <span>✨</span> 效果叠加
        </h3>

        <!-- 颜色遮罩 -->
        <EffectSlider
          label="颜色遮罩"
          icon="🎨"
          :enabled="config.effects.colorOverlay.enabled"
          :model-value="config.effects.colorOverlay"
          :controls="[
            { key: 'color', label: '颜色', type: 'color' },
            { key: 'opacity', label: '透明度', type: 'range', min: 0, max: 1, step: 0.05 }
          ]"
          @update:enabled="toggleEffect('colorOverlay')"
          @update:model-value="v => updateEffect('colorOverlay', v)"
        />

        <!-- 粒子效果 -->
        <div class="mt-4">
          <EffectSlider
            label="粒子效果"
            icon="✨"
            :enabled="config.effects.particles.enabled"
            :model-value="config.effects.particles"
            :controls="[
              { key: 'count', label: '数量', type: 'range', min: 5, max: 100, unit: '个' },
              { key: 'speed', label: '速度', type: 'range', min: 5, max: 50, unit: 's' },
              { key: 'color', label: '颜色', type: 'color' }
            ]"
            @update:enabled="toggleEffect('particles')"
            @update:model-value="v => updateEffect('particles', v)"
          />
        </div>

        <!-- 网格效果 -->
        <div class="mt-4">
          <EffectSlider
            label="网格效果"
            icon="🔲"
            :enabled="config.effects.grid.enabled"
            :model-value="config.effects.grid"
            :controls="[
              { key: 'opacity', label: '透明度', type: 'range', min: 0, max: 1, step: 0.05 },
              { key: 'size', label: '尺寸', type: 'range', min: 20, max: 120, unit: 'px' }
            ]"
            @update:enabled="toggleEffect('grid')"
            @update:model-value="v => updateEffect('grid', v)"
          />
        </div>

        <!-- 光球效果 -->
        <div class="mt-4">
          <EffectSlider
            label="光球效果"
            icon="💫"
            :enabled="config.effects.orbs.enabled"
            :model-value="config.effects.orbs"
            :controls="[
              { key: 'count', label: '数量', type: 'range', min: 1, max: 8, unit: '个' },
              { key: 'blur', label: '模糊', type: 'range', min: 40, max: 150, unit: 'px' }
            ]"
            @update:enabled="toggleEffect('orbs')"
            @update:model-value="v => updateEffect('orbs', v)"
          />
        </div>
      </div>

      <!-- 动作按钮 -->
      <div class="flex gap-3 pt-4 border-t border-white/10">
        <button 
          @click="handleReset"
          class="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-colors"
        >
          重置默认
        </button>
        <button 
          @click="handleSave"
          :disabled="isSaving"
          :class="[
            'flex-1 py-2.5 rounded-xl text-white text-sm transition-all',
            isSaving 
              ? 'bg-purple-500/50 cursor-wait' 
              : saveSuccess
                ? 'bg-green-500'
                : 'bg-purple-500 hover:bg-purple-600'
          ]"
        >
          {{ isSaving ? '保存中...' : saveSuccess ? '✓ 已保存' : '保存并应用' }}
        </button>
      </div>

      <!-- 保存提示 -->
      <div v-if="saveMessage" :class="['text-xs text-center py-2', saveSuccess ? 'text-green-400' : 'text-red-400']">
        {{ saveMessage }}
      </div>
    </div>

    <!-- 右侧预览区域 -->
    <div class="flex-1 rounded-2xl overflow-hidden border border-white/10 relative min-h-[400px]">
      <!-- 预览背景 -->
      <div 
        class="absolute inset-0"
        :style="{ background: backgroundCSS }"
      ></div>
      
      <!-- 颜色遮罩预览 -->
      <div 
        v-if="config.effects.colorOverlay.enabled"
        class="absolute inset-0"
        :style="{ 
          backgroundColor: config.effects.colorOverlay.color,
          opacity: config.effects.colorOverlay.opacity
        }"
      ></div>
      
      <!-- 网格预览 -->
      <div 
        v-if="config.effects.grid.enabled"
        class="absolute inset-0 pointer-events-none"
        :style="{
          backgroundImage: `linear-gradient(rgba(120, 119, 198, ${config.effects.grid.opacity * 0.1}) 1px, transparent 1px), linear-gradient(90deg, rgba(120, 119, 198, ${config.effects.grid.opacity * 0.1}) 1px, transparent 1px)`,
          backgroundSize: `${config.effects.grid.size}px ${config.effects.grid.size}px`
        }"
      ></div>
      
      <!-- 粒子预览指示 -->
      <div 
        v-if="config.effects.particles.enabled"
        class="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-xs text-gray-300"
      >
        ✨ 粒子效果已开启 ({{ config.effects.particles.count }} 个)
      </div>
      
      <!-- 光球预览指示 -->
      <div 
        v-if="config.effects.orbs.enabled"
        class="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 text-xs text-gray-300"
      >
        💫 光球效果已开启 ({{ config.effects.orbs.count }} 个)
      </div>

      <!-- 预览标签 -->
      <div class="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-xs text-white">
        实时预览
      </div>

      <!-- 当前类型标签 -->
      <div class="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-purple-500/50 text-xs text-white">
        {{ currentTypeLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useWallpaper } from '@/composables/useWallpaper'
import ImageUploader from '@/components/ImageUploader.vue'
import GradientPicker from '@/components/GradientPicker.vue'
import EffectSlider from '@/components/EffectSlider.vue'
import type { WallpaperConfig } from '@/data/wallpaper'

const {
  config,
  availableWallpapers,
  backgroundCSS,
  setBaseType,
  setPreset,
  setImage,
  setGradient,
  setSolid,
  updateEffect,
  toggleEffect,
  resetToDefault,
  saveToServer
} = useWallpaper()

// 本地状态
const imageUrl = ref('')
const gradientCss = ref('linear-gradient(135deg, #a855f7 0%, #ec4899 100%)')
const solidColor = ref('#0f0f23')
const isSaving = ref(false)
const saveSuccess = ref(false)
const saveMessage = ref('')

const baseTypes = [
  { value: 'preset' as const, label: '预设壁纸', icon: '🎨' },
  { value: 'image' as const, label: '自定义图片', icon: '🖼️' },
  { value: 'gradient' as const, label: '自定义渐变', icon: '🌈' },
  { value: 'solid' as const, label: '纯色背景', icon: '🔳' }
]

// 当前类型标签
const currentTypeLabel = computed(() => {
  const type = baseTypes.find(t => t.value === config.value.base.type)
  return type?.label || '预设壁纸'
})

// 监听配置变化，同步本地状态
watch(() => config.value.base, (newBase) => {
  if (newBase.type === 'image') {
    imageUrl.value = newBase.value
  } else if (newBase.type === 'gradient') {
    gradientCss.value = newBase.value || 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
  } else if (newBase.type === 'solid') {
    solidColor.value = newBase.value || '#0f0f23'
  }
}, { immediate: true, deep: true })

// 类型切换
const handleTypeChange = (type: WallpaperConfig['base']['type']) => {
  setBaseType(type)
  saveSuccess.value = false
  saveMessage.value = ''
}

// 图片变更
const handleImageChange = (url: string) => {
  imageUrl.value = url
  setImage(url)
}

// 渐变变更
const handleGradientChange = (css: string) => {
  gradientCss.value = css
  setGradient(css)
}

// 纯色变更
const handleSolidChange = (color: string) => {
  solidColor.value = color
  setSolid(color)
}

// 重置
const handleReset = () => {
  resetToDefault()
  imageUrl.value = ''
  gradientCss.value = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
  solidColor.value = '#0f0f23'
  saveSuccess.value = false
  saveMessage.value = '已重置为默认设置'
  setTimeout(() => { saveMessage.value = '' }, 2000)
}

// 保存到服务器
const handleSave = async () => {
  isSaving.value = true
  saveSuccess.value = false
  saveMessage.value = ''
  
  try {
    const success = await saveToServer()
    if (success) {
      saveSuccess.value = true
      saveMessage.value = '✓ 已保存到服务器，所有用户将看到新壁纸'
      setTimeout(() => {
        saveSuccess.value = false
        saveMessage.value = ''
      }, 3000)
    } else {
      saveMessage.value = '保存失败，请检查网络或登录状态'
    }
  } catch (e) {
    saveMessage.value = '保存失败: ' + (e as Error).message
  } finally {
    isSaving.value = false
  }
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
</style>
