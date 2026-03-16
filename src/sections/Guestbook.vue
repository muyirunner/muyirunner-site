<template>
  <section id="guestbook" class="py-20 px-6 relative overflow-hidden">
    <!-- 极光背景 -->
    <div class="absolute inset-0 bg-aurora opacity-30 animate-aurora"></div>
    <div class="absolute inset-0 bg-mesh-gradient opacity-20"></div>
    
    <!-- 浮动装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-pink/10 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-end/10 rounded-full blur-3xl animate-float-slower" style="animation-delay: 2s;"></div>
    </div>

    <div class="max-w-4xl mx-auto relative z-10">
      <SectionTitle
        :title="t('guestbook.title')"
        :subtitle="t('guestbook.subtitle')"
      />

      <!-- 留言表单 -->
      <div class="relative mb-12">
        <div class="absolute -inset-1 bg-gradient-primary rounded-3xl blur opacity-20 animate-glow-pulse"></div>
        
        <div class="relative glass-strong rounded-3xl p-8 border border-white/20 dark:border-white/10">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-rainbow rounded-t-3xl"></div>
          
          <h3 class="text-xl font-bold gradient-text mb-6 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ t('guestbook.formTitle') }}
          </h3>

          <form @submit.prevent="submitEntry" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ t('guestbook.name') }} *</label>
                <input
                  v-model="newEntry.author_name"
                  type="text"
                  required
                  :placeholder="t('guestbook.name')"
                  class="w-full px-4 py-3 rounded-xl glass border-2 border-transparent focus:border-gradient-start/50 bg-white/50 dark:bg-dark-card/50 outline-none transition-all duration-300 input-glow"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ t('guestbook.email') }}</label>
                <input
                  v-model="newEntry.author_email"
                  type="email"
                  placeholder="your@email.com"
                  class="w-full px-4 py-3 rounded-xl glass border-2 border-transparent focus:border-gradient-start/50 bg-white/50 dark:bg-dark-card/50 outline-none transition-all duration-300 input-glow"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ t('guestbook.message') }} *</label>
              <textarea
                v-model="newEntry.message"
                required
                rows="4"
                :placeholder="t('guestbook.message')"
                class="w-full px-4 py-3 rounded-xl glass border-2 border-transparent focus:border-gradient-start/50 bg-white/50 dark:bg-dark-card/50 outline-none transition-all duration-300 resize-none input-glow"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="submitting"
                class="btn-neon !rounded-xl !px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="!submitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{{ submitting ? t('guestbook.submitting') : t('guestbook.submit') }}</span>
              </button>
            </div>
          </form>

          <!-- 提交成功提示 -->
          <div v-if="submitSuccess" class="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ t('guestbook.success') }}</span>
          </div>
        </div>
      </div>

      <!-- 留言列表 -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold gradient-text flex items-center gap-2 mb-6">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          {{ t('guestbook.wallTitle') }} ({{ entries.length }})
        </h3>

        <!-- 加载中 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block w-10 h-10 border-3 border-gradient-start/30 border-t-gradient-start rounded-full animate-spin"></div>
          <p class="mt-4 text-gray-500">{{ t('common.loading') }}</p>
        </div>

        <!-- 留言列表 -->
        <div v-else-if="entries.length > 0" class="grid gap-4">
          <div
            v-for="(entry, index) in entries"
            :key="entry.id"
            class="group relative animate-fade-in"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="absolute -inset-0.5 bg-gradient-primary rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
            
            <div class="relative glass rounded-2xl p-5 border border-white/10 hover:border-gradient-start/30 transition-all duration-300">
              <div class="flex items-start gap-4">
                <!-- 头像 -->
                <div class="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-glow-purple/30 flex-shrink-0">
                  {{ entry.author_name.charAt(0).toUpperCase() }}
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-semibold text-gray-900 dark:text-white">{{ entry.author_name }}</span>
                    <span class="text-xs text-gray-500">{{ formatDate(entry.created_at) }}</span>
                  </div>
                  <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ entry.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">💬</div>
          <p class="text-xl text-gray-500 dark:text-gray-400 mb-2">{{ t('guestbook.empty') }}</p>
          <p class="text-gray-400">{{ t('guestbook.emptySub') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { guestbookApi, type GuestbookEntry } from '@/lib/supabase'
import SectionTitle from '@/components/SectionTitle.vue'

const { t, locale } = useI18n()

const entries = ref<GuestbookEntry[]>([])
const loading = ref(true)
const submitting = ref(false)
const submitSuccess = ref(false)

const newEntry = ref({
  author_name: '',
  author_email: '',
  message: ''
})

// 加载留言
async function loadEntries() {
  try {
    loading.value = true
    entries.value = await guestbookApi.getEntries()
  } catch (error) {
    console.error('加载留言失败:', error)
  } finally {
    loading.value = false
  }
}

// 提交留言
async function submitEntry() {
  if (!newEntry.value.author_name.trim() || !newEntry.value.message.trim()) return
  
  try {
    submitting.value = true
    await guestbookApi.createEntry({
      author_name: newEntry.value.author_name.trim(),
      author_email: newEntry.value.author_email.trim() || undefined,
      message: newEntry.value.message.trim()
    })
    
    // 重置表单
    newEntry.value = { author_name: '', author_email: '', message: '' }
    submitSuccess.value = true
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      submitSuccess.value = false
    }, 3000)
  } catch (error: any) {
    console.error('提交留言失败:', error)
    // 显示详细错误信息用于调试
    const errorMsg = error?.message || error?.error_description || JSON.stringify(error)
    alert('提交失败: ' + errorMsg)
  } finally {
    submitting.value = false
  }
}

// 格式化日期
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadEntries()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
