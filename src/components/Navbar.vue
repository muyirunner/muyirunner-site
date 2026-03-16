<template>
  <nav
    ref="navRef"
    :class="[
      'fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500',
      isVisible 
        ? 'top-4 opacity-100' 
        : '-top-20 opacity-0',
      scrolled
        ? 'backdrop-blur-xl bg-white/10 dark:bg-black/30 shadow-lg shadow-black/5 border border-white/10'
        : 'bg-transparent'
    ]"
    :style="{
      borderRadius: '9999px',
      padding: scrolled ? '0.5rem 1rem' : '0.75rem 1.5rem'
    }"
  >
    <div class="flex items-center gap-1">
      <!-- Logo -->
      <router-link 
        to="/" 
        class="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
          杨
        </div>
      </router-link>

      <!-- Divider -->
      <div class="w-px h-4 bg-white/20 mx-1"></div>

      <!-- Nav Links -->
      <div class="flex items-center gap-1 relative">
        <!-- Sliding indicator -->
        <div 
          v-if="activeIndex >= 0"
          class="absolute h-8 bg-white/10 rounded-full transition-all duration-300 ease-out"
          :style="{
            width: `${indicatorWidth}px`,
            left: `${indicatorLeft}px`
          }"
        ></div>
        
        <a
          v-for="(item, index) in navItems"
          :key="item.id"
          :ref="el => setItemRef(el, index)"
          :href="item.href"
          :class="[
            'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap',
            activeIndex === index
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          ]"
          @click.prevent="handleNavClick(item, index)"
        >
          {{ item.label }}
        </a>
      </div>

      <!-- Divider -->
      <div class="w-px h-4 bg-white/20 mx-1"></div>

      <!-- Language Toggle -->
      <button
        @click="toggleLanguage"
        class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        :title="locale === 'zh' ? 'Switch to English' : '切换到中文'"
      >
        {{ locale === 'zh' ? 'EN' : '中' }}
      </button>

      <!-- CTA Button -->
      <router-link
        to="/blog"
        class="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
      >
        {{ t('nav.blog') }}
      </router-link>
    </div>
  </nav>

  <!-- ========== 移动端 Speed Dial FAB ========== -->

  <!-- Speed Dial 容器 (包含主按钮 + 展开的子按钮) -->
  <div class="md:hidden fixed z-[60] flex flex-col-reverse items-center gap-3" :style="{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))', right: 'calc(4rem + env(safe-area-inset-right, 0px))' }">
    
    <!-- 主 FAB 按钮 -->
    <button
      class="speed-dial-main w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-95"
      :class="fabOpen 
        ? 'bg-white/20 backdrop-blur-xl border border-white/20 shadow-white/10' 
        : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30'"
      @click="fabOpen = !fabOpen"
    >
      <svg class="w-6 h-6 text-white transition-transform duration-300" :class="fabOpen ? 'rotate-45' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- 展开的子按钮 (从下往上排列) -->
    <Transition name="speed-item-1">
      <button
        v-if="fabOpen"
        class="speed-dial-item w-11 h-11 rounded-full flex items-center justify-center shadow-md backdrop-blur-xl bg-white/15 border border-white/20 transition-all duration-200 hover:bg-white/25 active:scale-90"
        @click="toggleLanguage"
        :title="locale === 'zh' ? 'English' : '中文'"
      >
        <span class="text-sm font-bold text-white">{{ locale === 'zh' ? 'EN' : '中' }}</span>
      </button>
    </Transition>

    <Transition name="speed-item-2">
      <button
        v-if="fabOpen"
        class="speed-dial-item w-11 h-11 rounded-full flex items-center justify-center shadow-md backdrop-blur-xl bg-white/15 border border-white/20 transition-all duration-200 hover:bg-white/25 active:scale-90"
        @click="toggleTheme"
        :title="isDark ? 'Light' : 'Dark'"
      >
        <span class="text-lg">{{ isDark ? '☀️' : '🌙' }}</span>
      </button>
    </Transition>

    <Transition name="speed-item-3">
      <button
        v-if="fabOpen"
        class="speed-dial-item w-11 h-11 rounded-full flex items-center justify-center shadow-md backdrop-blur-xl bg-white/15 border border-white/20 transition-all duration-200 hover:bg-white/25 active:scale-90"
        @click="openNavPanel"
        title="Navigation"
      >
        <span class="text-lg">📋</span>
      </button>
    </Transition>

    <Transition name="speed-item-4">
      <button
        v-if="fabOpen && showBackToTop"
        class="speed-dial-item w-11 h-11 rounded-full flex items-center justify-center shadow-md backdrop-blur-xl bg-white/15 border border-white/20 transition-all duration-200 hover:bg-white/25 active:scale-90"
        @click="scrollToTop"
        title="Back to top"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </Transition>
  </div>

  <!-- Speed Dial 背景遮罩 (点击收起) -->
  <Transition name="overlay-fade">
    <div 
      v-if="fabOpen"
      class="md:hidden fixed inset-0 z-[55] bg-black/30"
      @click="fabOpen = false"
    ></div>
  </Transition>

  <!-- 导航面板 (底部抽屉式) -->
  <Transition name="nav-sheet">
    <div 
      v-if="navPanelOpen"
      class="md:hidden fixed bottom-0 left-0 right-0 z-[65] rounded-t-3xl overflow-hidden"
      style="background: linear-gradient(180deg, rgba(20,12,40,0.98) 0%, rgba(10,5,25,0.98) 100%); backdrop-filter: blur(24px); border-top: 1px solid rgba(255,255,255,0.1);"
    >
      <!-- 拖拽手柄 -->
      <div class="flex justify-center pt-3 pb-2">
        <div class="w-10 h-1 rounded-full bg-white/20"></div>
      </div>

      <!-- 导航链接网格 -->
      <div class="px-5 pb-5">
        <div class="grid grid-cols-3 gap-3">
          <a
            v-for="item in sidebarNavItems"
            :key="item.id"
            :href="item.href"
            class="nav-sheet-item flex flex-col items-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
            @click.prevent="handleSheetNavClick(item)"
          >
            <span class="text-2xl">{{ item.icon }}</span>
            <span class="text-xs font-medium">{{ item.label }}</span>
          </a>
          
          <!-- 博客 (路由链接) -->
          <router-link
            to="/blog"
            class="nav-sheet-item flex flex-col items-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
            :class="{ 'bg-purple-500/15 border-purple-500/30 text-purple-300': $route.path === '/blog' }"
            @click="closeAll"
          >
            <span class="text-2xl">📝</span>
            <span class="text-xs font-medium">{{ t('nav.blog') }}</span>
          </router-link>
        </div>
      </div>

      <div class="px-5 pb-2">
        <PwaInstall />
      </div>

      <!-- 安全区间距 -->
      <div :style="{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }"></div>
    </div>
  </Transition>

  <!-- 导航面板遮罩 -->
  <Transition name="overlay-fade">
    <div 
      v-if="navPanelOpen"
      class="md:hidden fixed inset-0 z-[62] bg-black/50 backdrop-blur-sm"
      @click="navPanelOpen = false"
    ></div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import PwaInstall from './PwaInstall.vue'

const { t, locale } = useI18n()
const { isDark, toggleTheme } = useTheme()

// ========== 桌面导航项 ==========
const navItems = computed(() => [
  { id: 'hero', label: t('nav.home'), href: '#hero' },
  { id: 'experience', label: t('nav.experience'), href: '#experience' },
  { id: 'projects', label: t('nav.projects'), href: '#projects' },
  { id: 'skills', label: t('nav.skills'), href: '#skills' },
  { id: 'contact', label: t('hero.contactMe'), href: '#contact' }
])

// ========== 移动端导航面板项目（含图标+文字标签）==========
const sidebarNavItems = computed(() => [
  { id: 'hero', icon: '🏠', label: t('nav.home'), href: '#hero' },
  { id: 'experience', icon: '💼', label: t('nav.experience'), href: '#experience' },
  { id: 'projects', icon: '📂', label: t('nav.projects'), href: '#projects' },
  { id: 'skills', icon: '💡', label: t('nav.skills'), href: '#skills' },
  { id: 'contact', icon: '📧', label: t('hero.contactMe'), href: '#contact' }
])

// ========== Speed Dial 状态 ==========
const fabOpen = ref(false)
const navPanelOpen = ref(false)
const showBackToTop = ref(false)

// 返回顶部
const scrollToTop = () => {
  fabOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 打开导航面板时先关闭 Speed Dial
const openNavPanel = () => {
  fabOpen.value = false
  setTimeout(() => {
    navPanelOpen.value = true
  }, 150)
}

const closeAll = () => {
  fabOpen.value = false
  navPanelOpen.value = false
}

// 导航面板内点击导航后：关闭面板 + 滚动到锚点
const handleSheetNavClick = (item: { id: string; href: string }) => {
  closeAll()
  setTimeout(() => {
    const element = document.getElementById(item.id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      })
    }
  }, 350)
}

// 禁止背景滚动
watch([fabOpen, navPanelOpen], ([fab, nav]) => {
  document.body.style.overflow = (fab || nav) ? 'hidden' : ''
})

const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('language', locale.value)
}

const navRef = ref<HTMLElement | null>(null)
const scrolled = ref(false)
const isVisible = ref(true)
const lastScrollY = ref(0)
const activeIndex = ref(0)
const itemRefs = ref<(HTMLElement | null)[]>([])

// Indicator position
const indicatorWidth = ref(0)
const indicatorLeft = ref(0)

const setItemRef = (el: any, index: number) => {
  itemRefs.value[index] = el as HTMLElement
}

const updateIndicator = () => {
  nextTick(() => {
    const activeEl = itemRefs.value[activeIndex.value]
    if (activeEl) {
      const parent = activeEl.parentElement
      if (parent) {
        const parentRect = parent.getBoundingClientRect()
        const elRect = activeEl.getBoundingClientRect()
        indicatorWidth.value = elRect.width
        indicatorLeft.value = elRect.left - parentRect.left
      }
    }
  })
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // 返回顶部按钮：滚动超过 300px 才显示
  showBackToTop.value = currentScrollY > 300

  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    isVisible.value = false
  } else {
    isVisible.value = true
  }
  
  lastScrollY.value = currentScrollY
  scrolled.value = currentScrollY > 20
  
  const sections = navItems.value.map(item => document.getElementById(item.id))
  const scrollPosition = currentScrollY + window.innerHeight / 3
  
  sections.forEach((section, index) => {
    if (section) {
      const sectionTop = section.offsetTop
      const sectionBottom = sectionTop + section.offsetHeight
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        if (activeIndex.value !== index) {
          activeIndex.value = index
          updateIndicator()
        }
      }
    }
  })
}

type NavItem = { id: string; href: string }

const handleNavClick = (item: NavItem, index: number) => {
  const element = document.getElementById(item.id)
  if (element) {
    activeIndex.value = index
    updateIndicator()
    window.scrollTo({
      top: element.offsetTop - 100,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  updateIndicator()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
@media (max-width: 768px) {
  nav:first-of-type {
    display: none;
  }
}

/* ========== Speed Dial 子按钮动画 (逐个弹出) ========== */
.speed-item-1-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s; }
.speed-item-1-leave-active { transition: all 0.2s ease 0s; }
.speed-item-2-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s; }
.speed-item-2-leave-active { transition: all 0.2s ease 0.03s; }
.speed-item-3-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s; }
.speed-item-3-leave-active { transition: all 0.2s ease 0.06s; }
.speed-item-4-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s; }
.speed-item-4-leave-active { transition: all 0.2s ease 0.09s; }

.speed-item-1-enter-from, .speed-item-1-leave-to,
.speed-item-2-enter-from, .speed-item-2-leave-to,
.speed-item-3-enter-from, .speed-item-3-leave-to,
.speed-item-4-enter-from, .speed-item-4-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(20px);
}

/* ========== 导航面板 (底部抽屉) ========== */
.nav-sheet-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.nav-sheet-leave-active {
  transition: transform 0.25s ease-in;
}
.nav-sheet-enter-from,
.nav-sheet-leave-to {
  transform: translateY(100%);
}

/* 遮罩层 */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* 导航面板网格项 */
.nav-sheet-item {
  min-height: 72px;
}
</style>
