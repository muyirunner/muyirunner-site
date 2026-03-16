<template>
  <section
    id="qa"
    ref="sectionRef"
    class="py-20 px-6 relative overflow-hidden"
  >
    <!-- 极光背景效果 -->
    <div class="absolute inset-0 bg-aurora opacity-50 animate-aurora"></div>
    
    <!-- 网格背景 -->
    <div class="absolute inset-0 bg-mesh-gradient opacity-30"></div>
    
    <!-- 浮动装饰元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-[10%] w-72 h-72 bg-gradient-start/20 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-40 right-[5%] w-96 h-96 bg-gradient-end/15 rounded-full blur-3xl animate-float-slower" style="animation-delay: 3s;"></div>
      <div class="absolute top-1/2 left-[5%] w-48 h-48 bg-gradient-pink/10 rounded-full blur-3xl animate-float" style="animation-delay: 5s;"></div>
    </div>

    <div class="max-w-4xl mx-auto relative z-10">
      <SectionTitle
        :title="t('qa.title')"
        :subtitle="t('qa.subtitle')"
      />

      <!-- 聊天容器 -->
      <div class="relative mt-8">
        <!-- 外层发光效果 -->
        <div class="absolute -inset-1 bg-gradient-primary rounded-[2rem] blur opacity-20 animate-glow-pulse"></div>
        
        <!-- 主聊天卡片 -->
        <div class="relative glass-strong rounded-3xl overflow-hidden border border-white/20 dark:border-white/10">
          <!-- 顶部渐变装饰条 -->
          <div class="h-1.5 bg-gradient-rainbow animate-gradient-fast" style="background-size: 300% 100%;"></div>

          <!-- 头部 - ChatGPT 风格 -->
          <div class="px-6 py-5 border-b border-white/10 dark:border-dark-border/50 bg-gradient-to-r from-gradient-start/5 via-gradient-middle/5 to-gradient-end/5">
            <div class="flex items-center gap-4">
              <!-- 头像带呼吸灯效果 -->
              <div class="relative">
                <div class="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-glow-purple breathing-glow">
                  {{ firstChar }}
                </div>
                <!-- 在线指示器 -->
                <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-dark-card flex items-center justify-center">
                  <div class="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div class="flex-1">
                <h3 class="font-bold text-lg gradient-text-animated">{{ fullName }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    {{ t('qa.aiAssistant') }} · {{ t('qa.status') }}
                  </span>
                </p>
              </div>
              
              <!-- 标签徽章 -->
              <div class="flex items-center gap-2">
                <div class="tag-gradient">
                  <svg class="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                  </svg>
                  {{ t('qa.smartReply') }}
                </div>
              </div>
            </div>
          </div>

          <!-- 消息区域 -->
          <div
            ref="chatContainerRef"
            class="h-[60dvh] md:h-[550px] overflow-y-auto px-6 py-8 space-y-6 scroll-smooth relative"
            style="scrollbar-width: thin;"
          >
            <!-- 网格装饰背景 -->
            <div class="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style="background-image: linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px); background-size: 50px 50px;"></div>
            
            <!-- 欢迎消息 -->
            <div v-if="messages.length === 0" class="space-y-4 relative">
              <div class="flex gap-4 animate-fade-in">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow-purple">
                    {{ firstChar }}
                  </div>
                </div>
                <div class="flex-1 space-y-3 max-w-[85%]">
                  <div class="glass-card !p-4 border-gradient rounded-2xl rounded-tl-sm">
                    <p class="leading-relaxed text-gray-700 dark:text-gray-200" v-html="t('qa.welcome', { name: `<span class='gradient-text font-semibold'>${fullName}</span>` })"></p>
                  </div>
                  <div class="glass-card !p-4 border-gradient rounded-2xl rounded-tl-sm">
                    <p class="leading-relaxed text-gray-700 dark:text-gray-200">{{ t('qa.guide') }}</p>
                  </div>
                </div>
              </div>

              <!-- ✨ 推荐问题网格 - 分类展示，带图标和渐变边框 -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 animate-fade-in" style="animation-delay: 0.3s;">
                <button
                  v-for="(item, index) in featuredQuestions"
                  :key="index"
                  @click="askQuestion(item.question)"
                  :disabled="isTyping || isTypingMessage"
                  class="group relative overflow-hidden rounded-xl p-3 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-glow-purple/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <!-- 渐变边框背景 -->
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       :class="item.gradientClass"></div>
                  <!-- 内部背景 -->
                  <div class="absolute inset-[1px] rounded-[11px] glass-card"></div>
                  <!-- 内容 -->
                  <div class="relative z-10 flex items-start gap-2.5">
                    <span class="text-xl flex-shrink-0 mt-0.5">{{ item.icon }}</span>
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-wider mb-1" :class="item.labelColor">{{ item.label }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-snug">{{ item.question }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- 消息列表 -->
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="[
                'flex gap-4',
                msg.type === 'user' ? 'flex-row-reverse' : '',
                'animate-slide-up'
              ]"
            >
              <!-- 头像 -->
              <div class="flex-shrink-0">
                <div
                  v-if="msg.type === 'bot'"
                  class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow-purple"
                >
                  {{ firstChar }}
                </div>
                <div
                  v-else
                  class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white shadow-lg"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>

              <!-- 消息内容 -->
              <div :class="['flex-1 space-y-2', msg.type === 'user' ? 'flex flex-col items-end' : '']">
                <div
                  :class="[
                    'inline-block px-5 py-3.5 rounded-2xl max-w-[85%] shadow-glass',
                    msg.type === 'user'
                      ? 'rounded-tr-sm bg-gradient-primary text-white'
                      : 'rounded-tl-sm glass border-gradient'
                  ]"
                >
                  <p class="leading-relaxed whitespace-pre-line" v-html="formatMessage(msg.content)"></p>
                  <!-- 打字中光标 -->
                  <span
                    v-if="msg.type === 'bot' && index === messages.length - 1 && isTypingMessage"
                    class="typing-cursor"
                  >▋</span>
                </div>
                <span class="text-xs text-gray-400 px-2 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ msg.timestamp }}
                </span>
              </div>
            </div>

            <!-- 打字中指示器 -->
            <div v-if="isTyping" class="flex gap-4 animate-fade-in">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow-purple animate-breathing">
                  {{ firstChar }}
                </div>
              </div>
              <div class="glass border-gradient rounded-2xl rounded-tl-sm px-5 py-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('qa.thinking') }}</span>
                  <div class="flex gap-1">
                    <div class="w-2 h-2 bg-gradient-start rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
                    <div class="w-2 h-2 bg-gradient-middle rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
                    <div class="w-2 h-2 bg-gradient-end rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 快捷问题 - 横向滚动 -->
          <div class="px-6 py-4 border-t border-white/10 dark:border-dark-border/50 bg-gradient-to-r from-gradient-start/3 to-gradient-end/3">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-sm font-medium gradient-text flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/>
                </svg>
                {{ t('qa.quickAsk') }}
              </span>
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                v-for="(q, index) in currentQuickQuestions.slice(0, 8)"
                :key="index"
                @click="askQuestion(q.question)"
                :disabled="isTyping || isTypingMessage"
                class="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm glass border border-white/20 dark:border-dark-border/50 text-gray-700 dark:text-gray-300 hover:border-gradient-start hover:text-gradient-start hover:bg-gradient-start/5 transition-all duration-300 hover:shadow-glow-purple/20 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                <span class="group-hover:gradient-text transition-all">{{ q.question }}</span>
              </button>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="px-6 py-5 border-t border-white/10 dark:border-dark-border/50 bg-gradient-to-r from-white/50 to-white/30 dark:from-dark-card/50 dark:to-dark-card/30">
            <form @submit.prevent="sendMessage" class="flex gap-3">
              <div class="flex-1 relative">
                <input
                  v-model="userInput"
                  type="text"
                  :placeholder="t('qa.inputPlaceholder')"
                  class="w-full px-5 py-3.5 rounded-xl glass border-2 border-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gradient-start focus:shadow-glow-purple/30 transition-all duration-300 input-glow"
                  :disabled="isTyping"
                />
              </div>
              <button
                type="submit"
                :disabled="!userInput.trim() || isTyping"
                class="btn-neon !rounded-xl !px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span class="font-medium">{{ t('qa.send') }}</span>
              </button>
            </form>
          </div>
        </div>

        <!-- 底部提示 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 glass-subtle rounded-full px-4 py-2 inline-flex">
            <svg class="w-4 h-4 text-gradient-start" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            {{ t('qa.footer') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResume } from '@/composables/useResume'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import SectionTitle from '@/components/SectionTitle.vue'
import { matchAnswer, quickQuestions as quickQuestionsZh } from '@/data/qa'
import { matchAnswerEn, quickQuestionsEn } from '@/data/qa_en'
import { sendToDeepSeek } from '@/services/deepSeekService'
import { blogApi } from '@/lib/supabase'
import type { BlogPost } from '@/types/blog'

const { t, locale } = useI18n()
const { resume: data } = useResume()

// 动态获取姓名信息
const fullName = computed(() => data.value.personalInfo.name)
const firstChar = computed(() => data.value.personalInfo.name.charAt(0))

interface Message {
  type: 'user' | 'bot'
  content: string
  timestamp: string
}

const { targetRef: sectionRef } = useIntersectionObserver()

const userInput = ref('')
const messages = ref<Message[]>([])
const isTyping = ref(false)
const isTypingMessage = ref(false) // 控制打字光标显示
const chatContainerRef = ref<HTMLElement | null>(null)
const blogPosts = ref<BlogPost[]>([])

onMounted(async () => {
  try {
    blogPosts.value = await blogApi.getPosts()
  } catch (e) {
    console.warn('Failed to load blog posts for RAG', e)
  }

  // Mobile Keyboard handling: Scroll to bottom when viewport resizes (keyboard opens)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scrollToBottom)
  }
})

onUnmounted(() => {
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', scrollToBottom)
  }
})

// ========== 推荐问题网格数据 ==========
// 分类展示的精选问题，带图标和渐变样式
const featuredQuestions = computed(() => [
  {
    icon: '👨‍💻',
    label: t('nav.about'),
    question: t('qa.questions.who'),
    gradientClass: 'from-purple-500 to-blue-500',
    labelColor: 'text-purple-400'
  },
  {
    icon: '🛠️',
    label: t('stats.skills'),
    question: t('qa.questions.skills'),
    gradientClass: 'from-cyan-500 to-blue-500',
    labelColor: 'text-cyan-400'
  },
  {
    icon: '🚀',
    label: t('stats.projects'),
    question: t('qa.questions.projects'),
    gradientClass: 'from-orange-500 to-pink-500',
    labelColor: 'text-orange-400'
  },
  {
    icon: '💼',
    label: t('stats.experience'),
    question: t('qa.questions.experience'),
    gradientClass: 'from-green-500 to-emerald-500',
    labelColor: 'text-green-400'
  },
  {
    icon: '🏆',
    label: t('stats.awards'),
    question: t('qa.questions.awards'),
    gradientClass: 'from-yellow-500 to-amber-500',
    labelColor: 'text-yellow-400'
  },
  {
    icon: '📬',
    label: t('contact.title'),
    question: t('qa.questions.contact'),
    gradientClass: 'from-pink-500 to-rose-500',
    labelColor: 'text-pink-400'
  }
])
// ...


// 格式化时间
function getCurrentTime(): string {
  const now = new Date()
  return now.toLocaleTimeString(locale.value, { hour: '2-digit', minute: '2-digit' })
}

// 格式化消息（支持粗体等简单格式）
function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-accent">$1</strong>')
    .replace(/\n/g, '<br>')
}

// 滚动到底部
async function scrollToBottom() {
  await nextTick()
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
  }
}

// 打字机效果
async function typeMessage(fullText: string) {
  const thinkingTime = 500 + Math.random() * 800 // 500-1300ms 思考时间
  await new Promise(resolve => setTimeout(resolve, thinkingTime))

  // 创建空消息
  messages.value.push({
    type: 'bot',
    content: '',
    timestamp: getCurrentTime()
  })

  const currentMessageIndex = messages.value.length - 1

  // 开始打字效果，显示光标
  isTypingMessage.value = true

  // 计算打字速度（根据内容长度动态调整）
  const baseSpeed = 30 // 基础速度 30ms/字符
  const speedVariation = 20 // 速度波动 ±20ms

  // 分段处理（按换行符分割）
  const paragraphs = fullText.split('\n')

  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p]

    // 如果是空行，直接添加
    if (paragraph.trim() === '') {
      messages.value[currentMessageIndex].content += '\n'
      continue
    }

    // 逐字符打字
    for (let i = 0; i < paragraph.length; i++) {
      const char = paragraph[i]
      messages.value[currentMessageIndex].content += char

      // 滚动到底部
      await scrollToBottom()

      // 动态速度：标点符号后停顿更久
      let delay = baseSpeed + Math.random() * speedVariation
      if (['。', '！', '？', '.', '!', '?'].includes(char)) {
        delay += 200 // 句末停顿
      } else if (['，', '、', ',', '；', ';'].includes(char)) {
        delay += 100 // 逗号停顿
      }

      await new Promise(resolve => setTimeout(resolve, delay))
    }

    // 段落结束后添加换行
    if (p < paragraphs.length - 1) {
      messages.value[currentMessageIndex].content += '\n'
      await new Promise(resolve => setTimeout(resolve, 150)) // 段落间停顿
    }
  }

  // 打字完成，隐藏光标
  isTypingMessage.value = false
}

// RAG: 查找相关博客内容
function findRelevantBlogContent(query: string): string {
  if (!blogPosts.value.length) return ''
  
  // 简单关键词匹配
  const keywords = query.toLowerCase().split(/[\s,，?？!！]+/).filter(k => k.length > 1)
  if (!keywords.length) return ''

  const relevantPosts = blogPosts.value.filter(post => {
    const text = (post.title + post.excerpt + post.tags.join(' ')).toLowerCase()
    return keywords.some(k => text.includes(k))
  }).slice(0, 3) // 取最相关的前3篇

  if (!relevantPosts.length) return ''

  return relevantPosts.map(p => `
  【文章标题】：${p.title}
  【摘要】：${p.excerpt}
  【内容片段】：${p.content.substring(0, 300)}...
  `).join('\n---\n')
}

// 发送消息
async function sendMessage() {
  const input = userInput.value.trim()
  if (!input || isTyping.value) return

  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: input,
    timestamp: getCurrentTime()
  })

  userInput.value = ''
  await scrollToBottom()

  // 显示打字中指示器
  isTyping.value = true

  try {
    // 尝试获取本地知识库回答
    let answer = locale.value === 'en' ? matchAnswerEn(input) : matchAnswer(input)

    // 如果没有本地匹配，调用 DeepSeek
    if (!answer) {
      // 构造历史记录 (Mapping to OpenAI format)
      // 注意：这里简单转换，如果 messages 包含更多字段需调整
      const history = messages.value
        .slice(-6) // 取最近几条上下文
        .map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content
        } as any)) // as any to match specific ChatMessage interface if needed

      // RAG: 查找相关博客内容
      const blogContext = findRelevantBlogContent(input)

      // 使用 QA 模式 (专业且基于简历 + 博客增强)
      answer = await sendToDeepSeek(history, { 
        mode: 'qa',
        blogContext 
      })
    }


    // 隐藏打字中指示器
    isTyping.value = false

    // 执行打字机动画
    if (answer) {
      await typeMessage(answer)
    }
  } catch (error) {
    isTyping.value = false
    messages.value.push({
      type: 'bot',
      content: '抱歉，大脑连接断开了... 请稍后再试 (网络错误)',
      timestamp: getCurrentTime()
    })
    await scrollToBottom()
  }
}

// 快捷问题数据
const currentQuickQuestions = computed(() => {
  return locale.value === 'en' ? quickQuestionsEn : quickQuestionsZh
})

// 快捷问题
function askQuestion(question: string) {
  userInput.value = question
  sendMessage()
}
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #1e2a4a;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #00d4ff;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #00b8e6;
}

/* 打字光标动画 */
.typing-cursor {
  display: inline-block;
  animation: blink 1s infinite;
  color: #00d4ff;
  font-weight: bold;
  margin-left: 2px;
}

@keyframes blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out;
}

.animate-fade-in {
  animation: fade-in-up 0.5s ease-out;
}
</style>
