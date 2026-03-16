<template>
  <router-view />
  <!-- 全局虚拟宠物 / 看板娘 -->
  <VirtualPet />
  <!-- 全局主题切换按钮 -->
  <ThemeToggle />
  <!-- 全局语言切换按钮 -->
  <LanguageToggle />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { initPwaListener } from '@/composables/usePWA'

onMounted(() => {
  initPwaListener()
})

import VirtualPet from '@/components/VirtualPet.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageToggle from '@/components/LanguageToggle.vue'
// App.vue 现在只作为路由容器
// 所有页面内容由各自的页面组件处理
</script>
