<template>
  <button
    @click="copy"
    :class="[
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm',
      'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-accent'
    ]"
    :title="`复制${label}`"
  >
    <span>{{ text }}</span>
    <svg
      v-if="!copied"
      class="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
    <svg
      v-else
      class="w-4 h-4 text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  text: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '内容'
})

const copied = ref(false)

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>
