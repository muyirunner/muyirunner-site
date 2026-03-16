<template>
  <div class="space-y-6">
    <!-- 评论表单 -->
    <div class="glass rounded-2xl p-6 border border-white/10">
      <h4 class="text-lg font-bold gradient-text mb-4 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        发表评论
      </h4>

      <form @submit.prevent="submitComment" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <input
            v-model="newComment.author_name"
            type="text"
            required
            placeholder="你的昵称 *"
            class="px-4 py-3 rounded-xl glass border border-white/10 bg-transparent outline-none focus:border-gradient-start/50 transition-all"
          />
          <input
            v-model="newComment.author_email"
            type="email"
            placeholder="邮箱（可选）"
            class="px-4 py-3 rounded-xl glass border border-white/10 bg-transparent outline-none focus:border-gradient-start/50 transition-all"
          />
        </div>
        
        <textarea
          v-model="newComment.content"
          required
          rows="3"
          placeholder="写下你的评论..."
          class="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-transparent outline-none focus:border-gradient-start/50 transition-all resize-none"
        ></textarea>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="submitting"
            class="btn-neon !rounded-xl !px-6 flex items-center gap-2 disabled:opacity-50"
          >
            <svg v-if="!submitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            发送
          </button>
        </div>
      </form>

      <!-- 成功提示 -->
      <div v-if="submitSuccess" class="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 text-sm flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        评论提交成功！审核通过后将会显示。
      </div>
    </div>

    <!-- 评论列表 -->
    <div>
      <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
        评论 ({{ comments.length }})
      </h4>

      <div v-if="loading" class="text-center py-8">
        <div class="w-8 h-8 border-2 border-gradient-start/30 border-t-gradient-start rounded-full animate-spin inline-block"></div>
      </div>

      <div v-else-if="comments.length > 0" class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="glass rounded-xl p-4 border border-white/10"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
              {{ comment.author_name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-gray-900 dark:text-white">{{ comment.author_name }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
              </div>
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        暂无评论，来抢沙发吧！
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { commentApi, type Comment } from '@/lib/supabase'

const props = defineProps<{
  postId: string
}>()

const comments = ref<Comment[]>([])
const loading = ref(true)
const submitting = ref(false)
const submitSuccess = ref(false)

const newComment = ref({
  author_name: '',
  author_email: '',
  content: ''
})

async function loadComments() {
  try {
    loading.value = true
    comments.value = await commentApi.getComments(props.postId)
  } catch (error) {
    console.error('加载评论失败:', error)
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  if (!newComment.value.author_name.trim() || !newComment.value.content.trim()) return

  try {
    submitting.value = true
    await commentApi.createComment({
      post_id: props.postId,
      author_name: newComment.value.author_name.trim(),
      author_email: newComment.value.author_email.trim() || undefined,
      content: newComment.value.content.trim()
    })

    newComment.value = { author_name: '', author_email: '', content: '' }
    submitSuccess.value = true
    setTimeout(() => { submitSuccess.value = false }, 3000)
  } catch (error) {
    console.error('提交评论失败:', error)
    alert('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadComments()
})
</script>
