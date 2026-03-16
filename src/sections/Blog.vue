<template>
  <section id="blog" class="py-20 px-6 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
    </div>

    <div class="max-w-container mx-auto relative">
      <SectionTitle
        title="Blog"
        subtitle="技术文章与学习笔记 · 记录成长的每一步"
      />

      <!-- 分类过滤器 -->
      <div class="flex flex-wrap gap-3 mb-12 justify-center">
        <button
          @click="selectedCategory = null"
          :class="[
            'px-6 py-2 rounded-full font-medium transition-all duration-300',
            selectedCategory === null
              ? 'bg-accent text-white shadow-glow'
              : 'bg-white/80 dark:bg-dark-card/80 text-gray-700 dark:text-gray-300 hover:bg-accent/10'
          ]"
        >
          全部 ({{ blogPosts.length }})
        </button>
        <button
          v-for="category in blogCategories"
          :key="category.name"
          @click="selectedCategory = category.name"
          :class="[
            'px-6 py-2 rounded-full font-medium transition-all duration-300',
            selectedCategory === category.name
              ? 'bg-accent text-white shadow-glow'
              : 'bg-white/80 dark:bg-dark-card/80 text-gray-700 dark:text-gray-300 hover:bg-accent/10'
          ]"
        >
          {{ category.name }} ({{ category.count }})
        </button>
      </div>

      <!-- 加载中状态 -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
      </div>

      <!-- 博客文章列表 -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="(post, index) in filteredPosts"
          :key="post.id"
          class="group cursor-pointer"
          :style="{ animationDelay: `${index * 100}ms` }"
          @click="openPost(post)"
        >
          <!-- 文章卡片 -->
          <div class="relative h-full bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-dark-border/50 overflow-hidden transition-all duration-500 hover:border-accent/50 hover:shadow-glow hover:-translate-y-2">

            <!-- 封面图片 -->
            <div v-if="post.cover" class="relative h-48 overflow-hidden bg-gradient-to-br from-accent/20 to-primary-500/20">
              <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              <!-- 日期标签 -->
              <div class="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm">
                <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ formatDate(post.date) }}</span>
              </div>
            </div>

            <!-- 文章内容 -->
            <div class="p-6 space-y-4">
              <!-- 分类标签 -->
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-bold">
                  {{ post.category }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ post.readTime }} 分钟阅读
                </span>
              </div>

              <!-- 标题 -->
              <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors duration-300 line-clamp-2">
                {{ post.title }}
              </h3>

              <!-- 描述 -->
              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                {{ post.description }}
              </p>

              <!-- 标签 -->
              <div class="flex flex-wrap gap-2 pt-3 border-t border-gray-200/50 dark:border-dark-border/50">
                <span
                  v-for="tag in post.tags.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-1 rounded bg-gray-100 dark:bg-dark-bg text-xs text-gray-600 dark:text-gray-400"
                >
                  #{{ tag }}
                </span>
                <span v-if="post.tags.length > 3" class="px-2 py-1 text-xs text-gray-500">
                  +{{ post.tags.length - 3 }}
                </span>
              </div>

              <!-- 查看更多按钮 -->
              <div class="flex items-center gap-2 text-accent font-medium text-sm pt-2">
                <span class="group-hover:translate-x-1 transition-transform duration-300">阅读全文</span>
                <svg class="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <!-- 底部装饰条 -->
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredPosts.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-xl text-gray-600 dark:text-gray-400">该分类暂无文章</p>
      </div>
    </div>

    <!-- 博客详情弹窗 -->
    <Teleport to="body">
      <BlogDetail
        v-if="selectedPost"
        :post="selectedPost"
        @close="selectedPost = null"
      />
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAll, blogCategories } from '@/data/blog'
import type { BlogPost } from '@/api/blog'
import SectionTitle from '@/components/SectionTitle.vue'
import BlogDetail from '@/components/Blog/BlogDetail.vue'

const selectedCategory = ref<string | null>(null)
const selectedPost = ref<BlogPost | null>(null)
const blogPosts = ref<BlogPost[]>([])
const loading = ref(true)

// 加载博客文章
onMounted(async () => {
  try {
    blogPosts.value = await getAll()
  } catch (error) {
    console.error('加载博客文章失败:', error)
  } finally {
    loading.value = false
  }
})

// 过滤文章
const filteredPosts = computed(() => {
  if (!selectedCategory.value) {
    return blogPosts.value
  }
  return blogPosts.value.filter(
    post => post.category === selectedCategory.value
  )
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 打开文章详情
const openPost = async (post: BlogPost) => {
  // 先打开弹窗（显示加载中）
  selectedPost.value = post

  // 如果已经有内容，不需要重新加载
  if (post.content) {
    return
  }

  // 异步加载 Markdown 内容
  try {
    const response = await fetch(post.file)
    if (!response.ok) {
      throw new Error('加载文章失败')
    }
    const content = await response.text()

    // 更新 post 对象
    const postWithContent = { ...post, content }

    // 同时更新数组中的引用
    const index = blogPosts.value.findIndex(p => p.id === post.id)
    if (index !== -1) {
      blogPosts.value[index] = postWithContent
    }

    // 更新弹窗中显示的 post
    selectedPost.value = postWithContent
  } catch (error) {
    console.error('加载文章内容失败:', error)
    alert('加载文章失败，请稍后再试')
    selectedPost.value = null // 关闭弹窗
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
