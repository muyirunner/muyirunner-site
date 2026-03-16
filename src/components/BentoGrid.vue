<template>
  <div class="bento-grid">
    <slot />
  </div>
</template>

<script setup lang="ts">
// BentoGrid - 响应式网格容器
// 使用 CSS Grid 实现 Bento 布局
</script>

<style scoped>
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
}

/* 响应式：平板 */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 响应式：手机 */
@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}
</style>
