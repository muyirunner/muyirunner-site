<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-bg">
    <!-- 顶部导航 -->
    <nav class="sticky top-0 z-50 glass-strong border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow-purple/30">
              杨
            </div>
            <span class="text-lg font-bold gradient-text">管理后台</span>
          </router-link>

          <div class="flex items-center gap-4">
            <template v-if="user">
              <span class="text-sm text-gray-500">{{ user.email }}</span>
              <button @click="handleLogout" class="text-sm text-red-500 hover:text-red-600">退出</button>
            </template>
            <template v-else>
              <button @click="showLoginModal = true" class="btn-neon !rounded-xl !px-4 !py-2 text-sm">登录</button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- 未登录状态 -->
    <div v-if="!user" class="flex items-center justify-center py-32">
      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-purple">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">需要登录</h2>
        <p class="text-gray-500 mb-6">请先登录管理员账号</p>
        <button @click="showLoginModal = true" class="btn-neon !rounded-xl">登录管理</button>
      </div>
    </div>

    <!-- 已登录 - 管理界面 -->
    <div v-else class="max-w-7xl mx-auto px-6 py-12">
      <!-- 标签页切换 -->
      <div class="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-gradient-primary text-white'
              : 'text-gray-500 hover:text-white hover:bg-white/5'
          ]"
        >
          {{ tab.icon }} {{ tab.name }}
        </button>
      </div>

      <!-- 博客管理标签页 -->
      <div v-if="activeTab === 'blog'">
        <!-- 顶部操作栏 -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold gradient-text">博客管理</h1>
          <button @click="showEditor = true; editingPost = null" class="btn-neon !rounded-xl flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            写新文章
          </button>
        </div>

        <!-- 统计卡片 -->
        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <div class="glass rounded-2xl p-6 border border-white/10">
            <div class="text-3xl font-bold gradient-text mb-1">{{ posts.length }}</div>
            <div class="text-sm text-gray-500">篇文章</div>
          </div>
          <div class="glass rounded-2xl p-6 border border-white/10">
            <div class="text-3xl font-bold gradient-text mb-1">{{ publishedCount }}</div>
            <div class="text-sm text-gray-500">已发布</div>
          </div>
          <div class="glass rounded-2xl p-6 border border-white/10">
            <div class="text-3xl font-bold gradient-text mb-1">{{ draftCount }}</div>
            <div class="text-sm text-gray-500">草稿</div>
          </div>
        </div>

        <!-- 文章列表 -->
        <div class="glass rounded-3xl border border-white/10 overflow-hidden">
          <div class="p-6 border-b border-white/10">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">文章列表</h2>
          </div>

          <div v-if="loading" class="p-12 text-center">
            <div class="w-10 h-10 border-3 border-gradient-start/30 border-t-gradient-start rounded-full animate-spin mx-auto"></div>
          </div>

          <div v-else-if="posts.length === 0" class="p-12 text-center">
            <div class="text-4xl mb-4">📝</div>
            <p class="text-gray-500">还没有文章，点击上方按钮开始写作</p>
          </div>

          <div v-else class="divide-y divide-white/10">
            <div
              v-for="post in posts"
              :key="post.id"
              class="p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div class="flex-1 min-w-0 mr-4">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="font-bold text-gray-900 dark:text-white truncate">{{ post.title }}</h3>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      post.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    ]"
                  >
                    {{ post.published ? '已发布' : '草稿' }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>{{ post.category }}</span>
                  <span>{{ formatDate(post.created_at) }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="editPost(post)"
                  class="p-2 rounded-lg glass-subtle hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deletePost(post.id)"
                  class="p-2 rounded-lg glass-subtle hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- 评论管理标签页 -->
      <div v-else-if="activeTab === 'comments'">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold gradient-text mb-2">评论审核</h1>
            <p class="text-gray-500">管理所有文章评论，审核通过后才会公开显示</p>
          </div>
          <button @click="loadAllComments" class="btn-neon !rounded-xl !px-4 !py-2 text-sm flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            刷新
          </button>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div class="w-10 h-10 border-3 border-gradient-start/30 border-t-gradient-start rounded-full animate-spin mx-auto"></div>
        </div>

        <div v-else-if="allComments.length === 0" class="glass rounded-3xl p-12 text-center border border-white/10">
          <p class="text-gray-500">暂无评论</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="comment in allComments"
            :key="comment.id"
            class="glass rounded-2xl p-6 border border-white/10 hover:bg-white/5 transition-colors"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="font-bold text-gray-900 dark:text-white">{{ comment.author_name }}</span>
                  <span class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      comment.approved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    ]"
                  >
                    {{ comment.approved ? '已通过' : '待审核' }}
                  </span>
                </div>
                
                <div class="text-sm text-gray-500 mb-3 flex items-center gap-2">
                  <span>评论于文章：</span>
                  <router-link :to="`/blog/${comment.post_id}`" class="text-gradient-start hover:underline">
                    {{ comment.blog_posts?.title || '未知文章' }}
                  </router-link>
                </div>

                <p class="text-gray-700 dark:text-gray-300 bg-white/5 p-3 rounded-xl whitespace-pre-line">
                  {{ comment.content }}
                </p>

                <div v-if="comment.author_email" class="mt-2 text-xs text-gray-400">
                  Email: {{ comment.author_email }}
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <button
                  v-if="!comment.approved"
                  @click="handleApprove(comment)"
                  class="p-2 rounded-lg glass-subtle hover:bg-green-500/10 text-gray-500 hover:text-green-500 transition-colors"
                  title="通过审核"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  @click="handleDeleteComment(comment.id)"
                  class="p-2 rounded-lg glass-subtle hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"
                  title="删除评论"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 留言管理标签页 -->
      <div v-else-if="activeTab === 'guestbook'">
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold gradient-text mb-2">留言板管理</h1>
            <p class="text-gray-500">审核主页留言板内容</p>
          </div>
          <button @click="loadAllGuestbookEntries" class="btn-neon !rounded-xl !px-4 !py-2 text-sm flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            刷新
          </button>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div class="w-10 h-10 border-3 border-gradient-start/30 border-t-gradient-start rounded-full animate-spin mx-auto"></div>
        </div>

        <div v-else-if="allGuestbookEntries.length === 0" class="glass rounded-3xl p-12 text-center border border-white/10">
          <p class="text-gray-500">暂无留言</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="entry in allGuestbookEntries"
            :key="entry.id"
            class="glass rounded-2xl p-6 border border-white/10 hover:bg-white/5 transition-colors"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="font-bold text-gray-900 dark:text-white">{{ entry.author_name }}</span>
                  <span class="text-xs text-gray-400">{{ formatDate(entry.created_at) }}</span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      entry.approved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    ]"
                  >
                    {{ entry.approved ? '已通过' : '待审核' }}
                  </span>
                </div>

                <p class="text-gray-700 dark:text-gray-300 bg-white/5 p-3 rounded-xl whitespace-pre-line">
                  {{ entry.message }}
                </p>

                <div v-if="entry.author_email" class="mt-2 text-xs text-gray-400">
                  Email: {{ entry.author_email }}
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <button
                  v-if="!entry.approved"
                  @click="handleApproveEntry(entry)"
                  class="p-2 rounded-lg glass-subtle hover:bg-green-500/10 text-gray-500 hover:text-green-500 transition-colors"
                  title="通过审核"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  @click="handleDeleteEntry(entry.id)"
                  class="p-2 rounded-lg glass-subtle hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"
                  title="删除留言"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 壁纸设置标签页 -->
      <div v-else-if="activeTab === 'wallpaper'">
        <div class="mb-8">
          <h1 class="text-3xl font-bold gradient-text mb-2">🎨 高级壁纸编辑器</h1>
          <p class="text-gray-500">自定义网站背景：上传图片、编辑渐变、调整效果叠加</p>
        </div>

        <div class="glass rounded-3xl border border-white/10 p-6">
          <WallpaperEditor />
        </div>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <AdminLogin
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />

    <!-- 文章编辑器 -->
    <BlogEditor
      v-if="showEditor"
      :edit-post="editingPost"
      @close="showEditor = false"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { blogApi, authApi, type BlogPost } from '@/lib/supabase'
import AdminLogin from '@/components/AdminLogin.vue'
import BlogEditor from '@/components/BlogEditor.vue'
import WallpaperEditor from '@/components/WallpaperEditor.vue'

// 标签页配置
const tabs = [
  { id: 'blog', name: '博客管理', icon: '📝' },
  { id: 'comments', name: '评论审核', icon: '💬' },
  { id: 'guestbook', name: '留言板管理', icon: '📨' },
  { id: 'wallpaper', name: '壁纸设置', icon: '🎨' }
]
const activeTab = ref('blog')

const user = ref<any>(null)
const posts = ref<BlogPost[]>([])
const allComments = ref<any[]>([])
const allGuestbookEntries = ref<any[]>([])
const loading = ref(false)
const showLoginModal = ref(false)
const showEditor = ref(false)
const editingPost = ref<BlogPost | null>(null)

const publishedCount = computed(() => posts.value.filter(p => p.published).length)
const draftCount = computed(() => posts.value.filter(p => !p.published).length)

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function checkAuth() {
  user.value = await authApi.getUser()
  if (user.value) {
    loadPosts()
  }
}

async function loadPosts() {
  try {
    loading.value = true
    const { data, error } = await (await import('@/lib/supabase')).supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    posts.value = data as BlogPost[]
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

function handleLoginSuccess() {
  checkAuth()
}

async function handleLogout() {
  await authApi.signOut()
  user.value = null
  posts.value = []
}

function editPost(post: BlogPost) {
  editingPost.value = post
  showEditor.value = true
}

async function deletePost(id: string) {
  if (!confirm('确定要删除这篇文章吗？')) return
  
  try {
    await blogApi.deletePost(id)
    posts.value = posts.value.filter(p => p.id !== id)
  } catch (error: any) {
    alert('删除失败: ' + (error?.message || '未知错误'))
  }
}

function handleSaved() {
  loadPosts()
}

// 评论管理相关逻辑
async function loadAllComments() {
  try {
    loading.value = true
    // @ts-ignore
    allComments.value = await (await import('@/lib/supabase')).commentApi.getAllComments()
  } catch (error) {
    console.error('加载评论失败:', error)
  } finally {
    loading.value = false
  }
}

async function handleApprove(comment: any) {
  try {
    await (await import('@/lib/supabase')).commentApi.updateComment(comment.id, { approved: true })
    comment.approved = true
  } catch (error) {
    console.error('审核失败:', error)
    alert('操作失败')
  }
}

async function handleDeleteComment(id: string) {
  if (!confirm('确定要删除这条评论吗？')) return
  try {
    await (await import('@/lib/supabase')).commentApi.deleteComment(id)
    allComments.value = allComments.value.filter(c => c.id !== id)
  } catch (error) {
    console.error('删除失败:', error)
    alert('操作失败')
  }
}

// 留言管理相关逻辑
async function loadAllGuestbookEntries() {
  try {
    loading.value = true
    // @ts-ignore
    allGuestbookEntries.value = await (await import('@/lib/supabase')).guestbookApi.getAllEntries()
  } catch (error) {
    console.error('加载留言失败:', error)
  } finally {
    loading.value = false
  }
}

async function handleApproveEntry(entry: any) {
  try {
    await (await import('@/lib/supabase')).guestbookApi.updateEntry(entry.id, { approved: true })
    entry.approved = true
  } catch (error) {
    console.error('审核失败:', error)
    alert('操作失败')
  }
}

async function handleDeleteEntry(id: string) {
  if (!confirm('确定要删除这条留言吗？')) return
  try {
    await (await import('@/lib/supabase')).guestbookApi.deleteEntry(id)
    allGuestbookEntries.value = allGuestbookEntries.value.filter(e => e.id !== id)
  } catch (error) {
    console.error('删除失败:', error)
    alert('操作失败')
  }
}

// 监听 Tab 切换
import { watch } from 'vue'
watch(activeTab, (newTab) => {
  if (newTab === 'comments') {
    loadAllComments()
  } else if (newTab === 'guestbook') {
    loadAllGuestbookEntries()
  }
})

onMounted(() => {
  checkAuth()
  
  authApi.onAuthStateChange((event, session) => {
    user.value = session?.user || null
    if (user.value) {
      loadPosts()
    }
  })
})
</script>
