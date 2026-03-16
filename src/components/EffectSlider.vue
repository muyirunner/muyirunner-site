<template>
  <div class="space-y-3">
    <!-- 标题行 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-lg">{{ icon }}</span>
        <span class="text-sm font-medium text-white">{{ label }}</span>
      </div>
      
      <!-- 开关 -->
      <button 
        @click="toggleEnabled"
        :class="[
          'relative w-10 h-5 rounded-full transition-colors',
          enabled ? 'bg-purple-500' : 'bg-white/10'
        ]"
      >
        <span 
          :class="[
            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
            enabled ? 'left-5' : 'left-0.5'
          ]"
        ></span>
      </button>
    </div>
    
    <!-- 滑块控制区 -->
    <div v-if="enabled" class="space-y-3 pl-8">
      <div v-for="control in controls" :key="control.key" class="flex items-center gap-4">
        <span class="text-xs text-gray-400 w-16">{{ control.label }}</span>
        
        <!-- 颜色选择器 -->
        <template v-if="control.type === 'color'">
          <input 
            type="color"
            :value="(modelValue as any)[control.key]"
            @input="updateValue(control.key, ($event.target as HTMLInputElement).value)"
            class="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
          />
          <span class="text-xs text-gray-500">{{ (modelValue as any)[control.key] }}</span>
        </template>
        
        <!-- 数值滑块 -->
        <template v-else-if="control.type === 'range'">
          <input 
            type="range"
            :value="(modelValue as any)[control.key]"
            @input="updateValue(control.key, parseFloat(($event.target as HTMLInputElement).value))"
            :min="control.min"
            :max="control.max"
            :step="control.step || 1"
            class="flex-1 accent-purple-500"
          />
          <span class="text-xs text-gray-400 w-12 text-right">
            {{ (modelValue as any)[control.key] }}{{ control.unit || '' }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Control {
  key: string
  label: string
  type: 'range' | 'color'
  min?: number
  max?: number
  step?: number
  unit?: string
}

interface Props {
  label: string
  icon: string
  enabled: boolean
  modelValue: Record<string, any>
  controls: Control[]
}

interface Emits {
  (e: 'update:enabled', value: boolean): void
  (e: 'update:modelValue', value: Record<string, any>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toggleEnabled = () => {
  emit('update:enabled', !props.enabled)
}

const updateValue = (key: string, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>
