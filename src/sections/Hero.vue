<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center pt-20 pb-16 px-6 overflow-hidden"
  >
    <!-- 极光背景 -->
    <div class="absolute inset-0 bg-aurora opacity-40 animate-aurora"></div>
    
    <!-- 网格背景 -->
    <div class="absolute inset-0 bg-mesh-gradient opacity-25"></div>
    
    <!-- 浮动装饰元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[10%] right-[15%] w-72 h-72 bg-gradient-start/20 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-[20%] left-[10%] w-96 h-96 bg-gradient-end/15 rounded-full blur-3xl animate-float-slower" style="animation-delay: 2s;"></div>
      <div class="absolute top-[40%] right-[5%] w-48 h-48 bg-gradient-pink/10 rounded-full blur-3xl animate-float" style="animation-delay: 4s;"></div>
      <!-- 几何装饰 -->
      <div class="absolute top-[20%] left-[20%] w-4 h-4 bg-gradient-start/40 rounded-full animate-float" style="animation-delay: 1s;"></div>
      <div class="absolute top-[60%] right-[25%] w-3 h-3 bg-gradient-end/40 rounded-full animate-float-slow" style="animation-delay: 3s;"></div>
      <div class="absolute bottom-[30%] left-[30%] w-2 h-2 bg-gradient-pink/40 rounded-full animate-float-slower"></div>
    </div>

    <div class="max-w-container mx-auto w-full relative z-10">
      <div class="flex flex-col items-center text-center space-y-8">
        <!-- 标题区域 -->
        <div class="space-y-6 animate-fade-in-up">
          <!-- 问候语徽章 -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-gradient-start/30 shadow-glow-purple/20">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-start opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-primary"></span>
            </span>
            <span class="text-sm font-medium gradient-text">欢迎来到我的主页</span>
          </div>

          <!-- 姓名 - 动态渐变 -->
          <h1 class="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
            <span class="gradient-text-animated" style="background-size: 200% 200%;">
              {{ data.personalInfo.name }}
            </span>
          </h1>

          <!-- 职位 - 渐变文字 -->
          <div class="flex items-center justify-center gap-4">
            <div class="h-1 w-12 bg-gradient-primary rounded-full"></div>
            <p class="text-3xl md:text-4xl font-semibold gradient-text-glow">
              {{ data.personalInfo.targetPosition }}
            </p>
            <div class="h-1 w-12 bg-gradient-primary rounded-full"></div>
          </div>
        </div>

        <!-- 关键词标签 -->
        <div class="flex flex-wrap justify-center gap-3 animate-fade-in-up" style="animation-delay: 0.2s">
          <Chip v-for="keyword in data.keywords" :key="keyword">
            {{ keyword }}
          </Chip>
        </div>

        <!-- 操作按钮 -->
        <div class="flex flex-wrap justify-center gap-4 animate-fade-in-up" style="animation-delay: 0.3s">
          <button @click="scrollToContact" class="btn-primary-glow flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white bg-gradient-primary hover:scale-105 transition-transform duration-300 shadow-glow">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            联系我
          </button>
          
          <button @click="downloadResume" class="btn-outline-glow flex items-center gap-2 px-8 py-3 rounded-full font-medium glass border border-white/20 text-gray-800 dark:text-white hover:bg-white/20 transition-all duration-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            下载简历 PDF
          </button>
        </div>

        <!-- 社交链接 -->
        <div v-if="data.socialLinks.length > 0" class="flex gap-6 animate-fade-in-up pt-4" style="animation-delay: 0.4s">
          <a
            v-for="link in data.socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative p-3 rounded-xl glass-subtle hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
          >
            <!-- Github Icon 等待替换为具体的 Icon 组件或 SVG，这里暂时用文字首字母 -->
            <span class="text-sm font-bold gradient-text">{{ link.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resumeData } from '@/data/resume'
import Chip from '@/components/Chip.vue'

const data = resumeData

const downloadResume = () => {
  // 移动端友好的 PDF 下载/打开方案
  const isMobile = /iPhone|iPad|iPod|Android|WeChat|MicroMessenger/i.test(navigator.userAgent)

  if (isMobile) {
    // 移动端：直接在新标签页打开 PDF（用户可以自行选择保存）
    window.open('/resume.pdf', '_blank')
  } else {
    // 桌面端：使用 download 属性直接下载
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = `${data.personalInfo.name}_简历.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const scrollToContact = () => {
  const element = document.getElementById('contact')
  if (element) {
    const offset = 80
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}
</script>
