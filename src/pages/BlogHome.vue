<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-bg">
    <!-- 顶部导航 -->
    <nav class="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2 sm:gap-3 group">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-glow-purple/30">
              杨
            </div>
            <span class="text-base sm:text-lg font-bold gradient-text hidden sm:block">杨汶川的博客</span>
          </router-link>

          <!-- 导航链接 -->
          <div class="flex items-center gap-3 sm:gap-6">
            <router-link 
              to="/"
              class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gradient-start transition-colors"
            >
              主页
            </router-link>
            <router-link 
              to="/blog"
              class="text-xs sm:text-sm font-medium text-gradient-start"
            >
              博客
            </router-link>
            <router-link 
              to="/admin"
              class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gradient-start transition-colors"
            >
              管理
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <!-- 页面标题 -->
      <div class="text-center mb-8 sm:mb-16">
        <h1 class="text-2xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2 sm:mb-4">技术博客</h1>
        <p class="text-sm sm:text-lg text-gray-600 dark:text-gray-400">分享技术心得，记录成长之路</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-12">
        <!-- 左侧：文章列表 -->
        <div class="flex-1">
          <!-- 搜索栏 -->
          <div class="relative mb-4 sm:mb-8">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              class="w-full px-4 sm:px-5 py-3 sm:py-4 pl-10 sm:pl-12 rounded-xl sm:rounded-2xl text-sm sm:text-base glass border border-white/10 bg-white/50 dark:bg-dark-card/50 outline-none focus:border-gradient-start/50 transition-all"
            />
            <svg class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- 分类标签 -->
          <div class="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              :class="[
                'px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                selectedCategory === cat
                  ? 'bg-gradient-primary text-white shadow-glow-purple/30'
                  : 'glass-subtle hover:bg-white/50 dark:hover:bg-dark-card/50'
              ]"
            >
              {{ cat }}
            </button>
          </div>

          <!-- 加载中 -->
          <div v-if="loading" class="text-center py-20">
            <div class="w-12 h-12 border-3 border-gradient-start/30 border-t-gradient-start rounded-full animate-spin mx-auto"></div>
            <p class="mt-4 text-gray-500">加载文章中...</p>
          </div>

          <!-- 文章列表 -->
          <div v-else-if="filteredPosts.length > 0" class="grid gap-4 sm:gap-8">
            <article
              v-for="post in filteredPosts"
              :key="post.id"
              class="group relative"
            >
              <div class="absolute -inset-1 bg-gradient-primary rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
              
              <router-link :to="`/blog/${post.id}`" class="block relative">
                <div class="glass rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-gradient-start/30 transition-all duration-300">
                  <!-- 封面图 -->
                  <div v-if="post.cover_image" class="aspect-video bg-gray-200 dark:bg-dark-card overflow-hidden">
                    <img :src="post.cover_image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div v-else class="aspect-video bg-gradient-primary/10 flex items-center justify-center">
                    <svg class="w-16 h-16 text-gradient-start/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>

                  <!-- 内容 -->
                  <div class="p-4 sm:p-6">
                    <div class="flex items-center gap-3 mb-3">
                      <span class="px-3 py-1 rounded-full text-xs font-medium bg-gradient-start/10 text-gradient-start">
                        {{ post.category }}
                      </span>
                      <span class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</span>
                    </div>

                    <h2 
                      class="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:gradient-text transition-all line-clamp-2"
                      v-html="highlightText(post.title)"
                    ></h2>

                    <p 
                      class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4"
                      v-html="highlightText(post.excerpt)"
                    ></p>

                    <div class="flex items-center justify-between">
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="tag in post.tags.slice(0, 3)"
                          :key="tag"
                          class="text-xs text-gray-500 dark:text-gray-500"
                        >
                          #{{ tag }}
                        </span>
                      </div>
                      <span class="text-sm font-medium text-gradient-start group-hover:underline">
                        阅读全文 →
                      </span>
                    </div>
                  </div>
                </div>
              </router-link>
            </article>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center py-20">
            <div class="text-6xl mb-4">📝</div>
            <p class="text-xl text-gray-500 mb-2">暂无文章</p>
            <p class="text-gray-400">敬请期待更多内容</p>
          </div>
        </div>

        <!-- 右侧边栏 - 移动端放到底部 -->
        <aside class="w-full lg:w-80 space-y-4 sm:space-y-8 order-first lg:order-last">
          <!-- 关于作者 -->
          <div class="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10">
            <h3 class="text-base sm:text-lg font-bold gradient-text mb-3 sm:mb-4">关于作者</h3>
            <div class="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-glow-purple/30">
                杨
              </div>
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white">杨汶川</h4>
                <p class="text-sm text-gray-500">全栈开发者</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              热爱技术，热爱分享。这里记录我的技术思考与成长历程。
            </p>
          </div>

          <!-- 标签云 -->
          <div class="glass rounded-3xl p-6 border border-white/10">
            <h3 class="text-lg font-bold gradient-text mb-4">热门标签</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in allTags"
                :key="tag"
                class="px-3 py-1 rounded-full text-xs font-medium glass-subtle hover:bg-gradient-start/10 hover:text-gradient-start cursor-pointer transition-all"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- 统计 -->
          <div class="glass rounded-3xl p-6 border border-white/10">
            <h3 class="text-lg font-bold gradient-text mb-4">博客统计</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold gradient-text">{{ posts.length }}</div>
                <div class="text-xs text-gray-500">篇文章</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold gradient-text">{{ allTags.length }}</div>
                <div class="text-xs text-gray-500">个标签</div>
              </div>
              <div class="text-center col-span-2 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-2">
                 <div class="text-center">
                    <div class="text-xl font-bold text-gray-700 dark:text-gray-200">
                      <span id="busuanzi_value_site_uv" class="gradient-text">...</span>
                    </div>
                    <div class="text-xs text-gray-500">访客数 (UV)</div>
                 </div>
                 <div class="text-center">
                    <div class="text-xl font-bold text-gray-700 dark:text-gray-200">
                      <span id="busuanzi_value_site_pv" class="gradient-text">...</span>
                    </div>
                    <div class="text-xs text-gray-500">总访问量 (PV)</div>
                 </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Footer -->
    <footer class="glass-strong border-t border-white/10 py-8 px-6 mt-20">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-sm text-gray-500">© {{ currentYear }} 杨汶川. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { blogApi, type BlogPost } from '@/lib/supabase'

const posts = ref<BlogPost[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('全部')

const categories = computed(() => {
  const cats = new Set(posts.value.map(p => p.category))
  return ['全部', ...Array.from(cats)]
})

const allTags = computed(() => {
  const tags = new Set<string>()
  posts.value.forEach(p => p.tags.forEach(t => tags.add(t)))
  return Array.from(tags).slice(0, 15)
})

const filteredPosts = computed(() => {
  let result = posts.value

  // 分类筛选
  if (selectedCategory.value !== '全部') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    )
  }

  return result
})

const currentYear = computed(() => new Date().getFullYear())

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 搜索高亮辅助函数
function highlightText(text: string) {
  if (!searchQuery.value.trim()) return text
  
  const regex = new RegExp(`(${searchQuery.value.trim()})`, 'gi')
  return text.replace(regex, '<span class="text-accent-glow font-bold bg-accent/10 rounded px-1">$1</span>')
}

async function loadPosts() {
  try {
    loading.value = true
    posts.value = await blogApi.getPosts()
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPosts()
  
  // 重新加载不蒜子统计脚本 (SPA 路由切换适配)
  // 因为不蒜子脚本只在首次加载时运行，路由切换后需要重新触发
  try {
    const scriptId = 'busuanzi-script-reload'
    const oldScript = document.getElementById(scriptId)
    if (oldScript) {
      oldScript.remove()
    }
    
    const script = document.createElement('script')
    script.id = scriptId
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    script.async = true
    document.body.appendChild(script)
  } catch (e) {
    console.warn('Busuanzi load failed', e)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
