<template>
  <transition name="chat-fade">
    <div v-if="isOpen" class="chat-container">
      <!-- 头部 -->
      <div class="chat-header">
        <span class="chat-title">
          <span class="status-dot"></span>
          {{ t('qa.chat.title') }}
        </span>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <!-- 消息列表 -->
      <div class="chat-messages" ref="messagesContainer">
        <div v-if="messages.length === 0" class="empty-state">
          <p v-html="t('qa.chat.empty')"></p>
        </div>
        
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          class="message-wrapper"
          :class="msg.role"
        >
          <div class="message-bubble" v-html="renderMarkdown(msg.content)"></div>
        </div>

        <div v-if="isLoading" class="message-wrapper assistant">
          <div class="message-bubble typing">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="chat-input-area">
        <input 
          v-model="inputContent" 
          type="text" 
          :placeholder="t('qa.chat.inputPlaceholder')"
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading || !inputContent.trim()">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { sendToDeepSeek, type ChatMessage } from '@/services/deepSeekService';
import { marked } from 'marked'; // 需要安装 marked
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'message-sent', 'message-received']);

const messages = ref<ChatMessage[]>([]);
const inputContent = ref('');
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

// 简单的 Markdown 渲染
function renderMarkdown(text: string) {
  try {
    return marked.parse(text);
  } catch (e) {
    return text;
  }
}

async function sendMessage() {
  if (!inputContent.value.trim() || isLoading.value) return;

  const userMsg = inputContent.value;
  messages.value.push({ role: 'user', content: userMsg });
  inputContent.value = '';
  isLoading.value = true;
  emit('message-sent');

  scrollToBottom();

  try {
    // 构造请求历史 (最近 10 条，避免上下文过长消耗 token)
    const history = messages.value.slice(-10);
    const reply = await sendToDeepSeek(history, { mode: 'mascot' });
    
    messages.value.push({ role: 'assistant', content: reply });
    emit('message-received', reply);
  } catch (error) {
    messages.value.push({ role: 'assistant', content: t('qa.chat.error') });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}
</script>

<style scoped>
.chat-container {
  position: absolute;
  /* 修复：改为相对于父容器(看板娘)的右侧显示 */
  left: 310px; /* 280px (看板娘宽度) + 30px 间距 */
  bottom: 0px;
  width: 320px;
  height: 400px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(168, 85, 247, 0.2);
  backdrop-filter: blur(10px);
  z-index: 1001; 
}

.dark .chat-container {
  background: rgba(30, 30, 40, 0.95);
  border-color: rgba(168, 85, 247, 0.4);
}

.chat-header {
  padding: 12px 16px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  margin-right: 6px;
  box-shadow: 0 0 5px #4ade80;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.8;
}

.close-btn:hover {
  opacity: 1;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  color: #888;
  font-size: 13px;
  margin-top: 40px;
  font-style: italic;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.message-wrapper.user {
  align-items: flex-end;
}

.message-wrapper.assistant {
  align-items: flex-start;
}

.message-bubble {
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
}

/* Deep customizations for markdown content */
.message-bubble :deep(p) {
  margin: 0 0 6px 0;
}
.message-bubble :deep(p:last-child) {
  margin: 0;
}
.message-bubble :deep(code) {
  background: rgba(0,0,0,0.1);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}
.message-bubble :deep(pre) {
  background: #1e1e1e;
  color: #eee;
  padding: 8px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 6px 0;
}

.user .message-bubble {
  background: #a855f7;
  color: white;
  border-bottom-right-radius: 2px;
}

.assistant .message-bubble {
  background: #f3f4f6;
  color: #1f2937;
  border-bottom-left-radius: 2px;
}

.dark .assistant .message-bubble {
  background: #374151;
  color: #e5e7eb;
}

.typing span {
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out both;
  margin: 0 1px;
}

.typing span:nth-child(1) { animation-delay: -0.32s; }
.typing span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input-area {
  padding: 12px;
  border-top: 1px solid rgba(0,0,0,0.05);
  display: flex;
  gap: 8px;
}

.dark .chat-input-area {
  border-top-color: rgba(255,255,255,0.05);
}

.chat-input-area input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: inherit;
}

.chat-input-area input:focus {
  border-color: #a855f7;
}

.chat-input-area button {
  width: 36px;
  height: 36px;
  background: #a855f7;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.chat-input-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chat-input-area button:hover:not(:disabled) {
  background: #9333ea;
}

.chat-input-area button svg {
  width: 18px;
  height: 18px;
  margin-left: 2px; /* Visual adjustment */
}

/* Transitions */
.chat-fade-enter-active,
.chat-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.chat-fade-enter-from,
.chat-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .chat-container {
    right: 20px;
    bottom: 240px; /* Above the mascot */
    width: auto;
    left: 20px;
    height: 300px;
  }
}
</style>
