<template>
  <div class="space-y-4">
    <label class="block text-sm font-medium text-gray-300">{{ label }}</label>
    
    <!-- 上传区域 -->
    <div 
      class="relative border-2 border-dashed border-white/20 rounded-xl p-6 text-center transition-all hover:border-purple-500/50 cursor-pointer"
      :class="{ 'border-purple-500 bg-purple-500/5': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input 
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <div v-if="!previewUrl" class="space-y-3">
        <div class="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-300">点击上传或拖拽图片到此处</p>
          <p class="text-xs text-gray-500 mt-1">支持 JPG, PNG, WebP, GIF</p>
        </div>
      </div>
      
      <!-- 预览 -->
      <div v-else class="relative">
        <img :src="previewUrl" alt="Preview" class="max-h-40 mx-auto rounded-lg object-cover" />
        <button 
          @click.stop="clearImage"
          class="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
    
    <!-- URL 输入 -->
    <div class="flex gap-2">
      <input 
        v-model="urlInput"
        type="text"
        placeholder="或输入图片 URL"
        class="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none"
      />
      <button 
        @click="loadFromUrl"
        class="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/30 transition-colors"
        :disabled="!urlInput"
      >
        加载
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  label?: string
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  label: '上传图片'
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref(props.modelValue || '')
const urlInput = ref('')
const isDragging = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    previewUrl.value = result
    emit('update:modelValue', result)
  }
  reader.readAsDataURL(file)
}

const loadFromUrl = () => {
  if (urlInput.value) {
    previewUrl.value = urlInput.value
    emit('update:modelValue', urlInput.value)
    urlInput.value = ''
  }
}

const clearImage = () => {
  previewUrl.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
