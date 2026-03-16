<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- 登录卡片 -->
    <div class="relative w-full max-w-md">
      <div class="absolute -inset-1 bg-gradient-primary rounded-3xl blur opacity-30 animate-glow-pulse"></div>
      
      <div class="relative glass-strong rounded-3xl p-8 border border-white/20 dark:border-white/10">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-rainbow rounded-t-3xl"></div>
        
        <!-- 关闭按钮 -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 p-2 rounded-full glass-subtle hover:bg-red-500/10 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 头部 -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-purple">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold gradient-text">管理员登录</h2>
          <p class="text-sm text-gray-500 mt-2">登录后可发布和管理文章</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">邮箱</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="admin@example.com"
              class="w-full px-4 py-3 rounded-xl glass border-2 border-transparent focus:border-gradient-start/50 bg-white/50 dark:bg-dark-card/50 outline-none transition-all duration-300 input-glow"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">密码</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl glass border-2 border-transparent focus:border-gradient-start/50 bg-white/50 dark:bg-dark-card/50 outline-none transition-all duration-300 input-glow"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="error" class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-neon !rounded-xl !py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>{{ loading ? '登录中...' : '登录' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authApi } from '@/lib/supabase'

const emit = defineEmits(['close', 'success'])

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) return
  
  try {
    loading.value = true
    error.value = ''
    
    await authApi.signIn(email.value, password.value)
    emit('success')
    emit('close')
  } catch (err: any) {
    error.value = err.message || '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>
