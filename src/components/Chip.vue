<template>
  <span
    :class="[
      'group relative inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium',
      'bg-gradient-to-r from-blue-500/15 to-purple-500/10 dark:from-blue-500/25 dark:to-purple-500/15',
      'text-blue-700 dark:text-blue-300',
      'border border-blue-400/30 dark:border-blue-400/40',
      'transition-all duration-300',
      'hover:scale-105 hover:shadow-lg hover:border-blue-500/50',
      'cursor-default'
    ]"
  >
    <!-- 内容 -->
    <span class="relative z-10 flex items-center gap-1.5">
      <slot />
    </span>

    <!-- 光效 -->
    <span
      class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></span>
  </span>
</template>

<script setup lang="ts">
</script>
