<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-300">{{ label }}</label>
    
    <!-- 渐变预览 -->
    <div 
      class="h-20 rounded-xl border border-white/10 overflow-hidden"
      :style="{ background: gradientCSS }"
    ></div>
    
    <!-- 颜色节点 -->
    <div class="space-y-3">
      <div 
        v-for="(stop, index) in stops" 
        :key="index"
        class="flex items-center gap-3"
      >
        <!-- 颜色选择器 -->
        <div class="relative">
          <input 
            type="color"
            :value="stop.color"
            @input="updateStop(index, 'color', ($event.target as HTMLInputElement).value)"
            class="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
          />
        </div>
        
        <!-- 位置滑块 -->
        <div class="flex-1">
          <input 
            type="range"
            :value="stop.position"
            @input="updateStop(index, 'position', parseInt(($event.target as HTMLInputElement).value))"
            min="0"
            max="100"
            class="w-full accent-purple-500"
          />
        </div>
        
        <!-- 位置数值 -->
        <span class="text-xs text-gray-400 w-10 text-right">{{ stop.position }}%</span>
        
        <!-- 删除按钮 -->
        <button 
          v-if="stops.length > 2"
          @click="removeStop(index)"
          class="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
    
    <!-- 添加颜色 -->
    <button 
      @click="addStop"
      class="w-full py-2 rounded-lg border border-dashed border-white/20 text-gray-400 text-sm hover:border-purple-500/50 hover:text-purple-400 transition-colors"
    >
      + 添加颜色节点
    </button>
    
    <!-- 角度控制 -->
    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-400">角度</span>
      <input 
        type="range"
        v-model.number="angle"
        min="0"
        max="360"
        class="flex-1 accent-purple-500"
        @input="emitGradient"
      />
      <span class="text-xs text-gray-400 w-10 text-right">{{ angle }}°</span>
    </div>
    
    <!-- 类型切换 -->
    <div class="flex gap-2">
      <button 
        v-for="t in types"
        :key="t.value"
        @click="type = t.value; emitGradient()"
        :class="[
          'flex-1 py-2 rounded-lg text-sm transition-colors',
          type === t.value 
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
        ]"
      >
        {{ t.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  label?: string
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

interface ColorStop {
  color: string
  position: number
}

const props = withDefaults(defineProps<Props>(), {
  label: '渐变编辑器'
})

const emit = defineEmits<Emits>()

// 渐变类型
const types = [
  { value: 'linear', label: '线性' },
  { value: 'radial', label: '径向' }
]

const type = ref<'linear' | 'radial'>('linear')
const angle = ref(135)
const stops = ref<ColorStop[]>([
  { color: '#a855f7', position: 0 },
  { color: '#ec4899', position: 100 }
])

// 生成渐变 CSS
const gradientCSS = computed(() => {
  const sortedStops = [...stops.value].sort((a, b) => a.position - b.position)
  const colorStops = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')
  
  if (type.value === 'linear') {
    return `linear-gradient(${angle.value}deg, ${colorStops})`
  } else {
    return `radial-gradient(circle, ${colorStops})`
  }
})

const updateStop = (index: number, key: 'color' | 'position', value: string | number) => {
  stops.value[index][key] = value as never
  emitGradient()
}

const addStop = () => {
  const midPosition = Math.round((stops.value[0].position + stops.value[stops.value.length - 1].position) / 2)
  stops.value.push({ color: '#6366f1', position: midPosition })
  emitGradient()
}

const removeStop = (index: number) => {
  stops.value.splice(index, 1)
  emitGradient()
}

const emitGradient = () => {
  emit('update:modelValue', gradientCSS.value)
}

// 初始化时发射
emitGradient()
</script>
