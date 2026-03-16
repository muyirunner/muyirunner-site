<template>
  <div class="fixed inset-0 z-50 overflow-auto bg-gray-50 dark:bg-dark-bg">
    <!-- 顶部工具栏 -->
    <div class="sticky top-0 z-10 glass-strong border-b border-white/10">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="$emit('close')"
            class="p-2 rounded-xl glass-subtle hover:bg-red-500/10 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 class="text-xl font-bold gradient-text">{{ isEditing ? '编辑文章' : '发布新文章' }}</h1>
        </div>

        <div class="flex items-center gap-3">
          <!-- 预览切换 -->
          <button
            @click="showPreview = !showPreview"
            :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all', showPreview ? 'bg-gradient-primary text-white' : 'glass-subtle']"
          >
            {{ showPreview ? '编辑' : '预览' }}
          </button>

          <!-- 保存草稿 -->
          <button
            @click="saveDraft"
            :disabled="saving"
            class="px-4 py-2 rounded-xl text-sm font-medium glass-subtle hover:bg-gray-500/10 transition-all"
          >
            保存草稿
          </button>

          <!-- 发布 -->
          <button
            @click="publishPost"
            :disabled="saving || !post.title.trim() || !post.content.trim()"
            class="btn-neon !rounded-xl !px-6 !py-2 flex items-center gap-2 disabled:opacity-50"
          >
            <svg v-if="!saving" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            发布
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="max-w-5xl mx-auto p-6">
      <div v-if="!showPreview" class="space-y-6">
        <!-- 标题 -->
        <input
          v-model="post.title"
          type="text"
          placeholder="文章标题..."
          class="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
        />

        <!-- 元信息 -->
        <div class="flex flex-wrap gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">分类</label>
            <select
              v-model="post.category"
              class="px-4 py-2 rounded-xl glass border border-white/10 bg-transparent outline-none text-sm"
            >
              <option value="技术">技术</option>
              <option value="生活">生活</option>
              <option value="随笔">随笔</option>
              <option value="教程">教程</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs text-gray-500 mb-1">标签（逗号分隔）</label>
            <input
              v-model="tagsInput"
              type="text"
              placeholder="Vue, TypeScript, 前端"
              class="w-full px-4 py-2 rounded-xl glass border border-white/10 bg-transparent outline-none text-sm"
            />
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs text-gray-500 mb-1">封面图片 URL</label>
            <input
              v-model="post.cover_image"
              type="url"
              placeholder="https://..."
              class="w-full px-4 py-2 rounded-xl glass border border-white/10 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        <!-- 摘要 -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">摘要</label>
          <textarea
            v-model="post.excerpt"
            rows="2"
            placeholder="文章摘要（可选，用于列表展示）..."
            class="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-transparent outline-none text-sm resize-none"
          ></textarea>
        </div>

        <!-- Markdown 编辑器 + AI 工具栏 -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">内容（支持 Markdown）</label>

          <!-- AI 工具栏 -->
          <div class="flex items-center gap-2 mb-2 p-2 rounded-xl glass border border-white/10">
            <span class="text-xs text-gray-400 mr-1">🤖 AI</span>
            <button
              v-for="action in aiActions"
              :key="action.id"
              @click="handleAiAction(action.id)"
              :disabled="aiLoading !== null || !post.content.trim()"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
              :class="aiLoading === action.id
                ? 'bg-purple-500/20 text-purple-300 cursor-wait'
                : 'glass-subtle hover:bg-white/10 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'"
            >
              <div v-if="aiLoading === action.id" class="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
              <span v-else>{{ action.icon }}</span>
              {{ action.label }}
            </button>
          </div>

          <!-- AI 结果预览面板 -->
          <Transition name="ai-preview">
            <div v-if="aiPreview" class="mb-3 rounded-xl border border-purple-500/30 overflow-hidden">
              <div class="flex items-center justify-between px-4 py-2 bg-purple-500/10 border-b border-purple-500/20">
                <span class="text-xs font-medium text-purple-300">✨ AI {{ aiPreviewLabel }}</span>
                <div class="flex items-center gap-2">
                  <button
                    @click="acceptAiResult"
                    class="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  >✓ 采纳</button>
                  <button
                    @click="aiPreview = null"
                    class="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >✗ 取消</button>
                </div>
              </div>
              <div class="p-4 bg-white/5 max-h-60 overflow-y-auto">
                <pre class="whitespace-pre-wrap text-sm text-gray-200 font-mono">{{ aiPreview.result }}</pre>
              </div>
            </div>
          </Transition>

          <textarea
            ref="contentTextarea"
            v-model="post.content"
            rows="20"
            placeholder="开始写作...

支持 Markdown 语法：
# 标题
**粗体** *斜体*
- 列表项
```代码块```"
            class="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-transparent outline-none font-mono text-sm resize-none"
          ></textarea>
        </div>
      </div>

      <!-- 预览 -->
      <div v-else class="prose prose-lg dark:prose-invert max-w-none">
        <h1>{{ post.title || '无标题' }}</h1>
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span class="px-2 py-1 rounded bg-accent/10 text-accent">{{ post.category }}</span>
          <span v-for="tag in parsedTags" :key="tag" class="px-2 py-1 rounded bg-gray-500/10">#{{ tag }}</span>
        </div>
        <div v-html="renderedContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { blogApi, authApi, type BlogPost } from '@/lib/supabase'
import { aiPolish, aiSummarize, aiContinue, aiTranslate } from '@/services/deepSeekService'

const props = defineProps<{
  editPost?: BlogPost | null
}>()

const emit = defineEmits(['close', 'saved'])

const saving = ref(false)
const showPreview = ref(false)
const isEditing = computed(() => !!props.editPost)

const post = ref({
  title: '',
  content: '',
  excerpt: '',
  cover_image: '',
  category: '技术',
  published: false
})

const tagsInput = ref('')
const contentTextarea = ref<HTMLTextAreaElement | null>(null)

// ========== AI 写作助手 ==========
const aiLoading = ref<string | null>(null)
const aiPreview = ref<{ action: string; result: string } | null>(null)
const aiPreviewLabel = computed(() => {
  if (!aiPreview.value) return ''
  const labels: Record<string, string> = { polish: '润色结果', summarize: '生成摘要', continue: '续写内容', translate: '翻译结果' }
  return labels[aiPreview.value.action] || '结果'
})

const aiActions = [
  { id: 'polish', label: '润色', icon: '✨' },
  { id: 'summarize', label: '摘要', icon: '📝' },
  { id: 'continue', label: '续写', icon: '✏️' },
  { id: 'translate', label: '翻译', icon: '🌐' },
]

async function handleAiAction(actionId: string) {
  if (aiLoading.value || !post.value.content.trim()) return
  aiLoading.value = actionId
  aiPreview.value = null

  try {
    let result = ''
    const content = post.value.content.trim()

    switch (actionId) {
      case 'polish':
        result = await aiPolish(content)
        break
      case 'summarize':
        result = await aiSummarize(content)
        // 摘要直接填充到 excerpt 字段
        post.value.excerpt = result
        break
      case 'continue':
        result = await aiContinue(content)
        break
      case 'translate': {
        // 自动检测：如果内容主要是中文则翻译为英文，反之亦然
        const isChinese = /[\u4e00-\u9fa5]/.test(content) && content.match(/[\u4e00-\u9fa5]/g)!.length > content.length * 0.1
        result = await aiTranslate(content, isChinese ? 'en' : 'zh')
        break
      }
    }

    // 摘要不需要预览（已直接填充），其他操作显示预览面板
    if (actionId === 'summarize') {
      // 已填充，不显示预览
    } else {
      aiPreview.value = { action: actionId, result }
    }
  } catch (error: any) {
    console.error('AI 操作失败:', error)
    alert('AI 操作失败: ' + (error?.message || '网络错误，请稍后重试'))
  } finally {
    aiLoading.value = null
  }
}

function acceptAiResult() {
  if (!aiPreview.value) return
  const { action, result } = aiPreview.value

  if (action === 'continue') {
    // 续写：追加到末尾
    post.value.content = post.value.content.trimEnd() + '\n\n' + result
  } else {
    // 润色 / 翻译：替换全文
    post.value.content = result
  }
  aiPreview.value = null
}

const parsedTags = computed(() => {
  return tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
})

// 简单的 Markdown 渲染（实际项目中建议使用 marked 或 markdown-it）
const renderedContent = computed(() => {
  let html = post.value.content
    // 标题
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 粗体和斜体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 代码块
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // 行内代码
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // 链接
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    // 换行
    .replace(/\n/g, '<br>')
  
  return html
})

// 保存草稿
async function saveDraft() {
  await savePost(false)
}

// 发布文章
async function publishPost() {
  await savePost(true)
}

// 保存文章
async function savePost(published: boolean) {
  if (!post.value.title.trim() || !post.value.content.trim()) return
  
  try {
    saving.value = true
    
    const user = await authApi.getUser()
    if (!user) {
      alert('请先登录')
      return
    }

    const postData = {
      title: post.value.title.trim(),
      content: post.value.content.trim(),
      excerpt: post.value.excerpt.trim() || post.value.content.substring(0, 200) + '...',
      cover_image: post.value.cover_image.trim() || undefined,
      category: post.value.category,
      tags: parsedTags.value,
      published,
      author_id: user.id
    }

    if (isEditing.value && props.editPost) {
      await blogApi.updatePost(props.editPost.id, postData)
    } else {
      await blogApi.createPost(postData)
    }

    emit('saved')
    emit('close')
  } catch (error: any) {
    console.error('保存失败:', error)
    alert('保存失败: ' + (error.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (props.editPost) {
    post.value = {
      title: props.editPost.title,
      content: props.editPost.content,
      excerpt: props.editPost.excerpt || '',
      cover_image: props.editPost.cover_image || '',
      category: props.editPost.category,
      published: props.editPost.published
    }
    tagsInput.value = props.editPost.tags.join(', ')
  }
})
</script>

<style scoped>
/* AI 预览面板过渡动画 */
.ai-preview-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.ai-preview-leave-active {
  transition: all 0.2s ease-in;
}
.ai-preview-enter-from,
.ai-preview-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
</style>
