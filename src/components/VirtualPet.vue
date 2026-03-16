<template>
  <!-- Live2D 看板娘容器 -->
  <div 
    v-show="isVisible"
    id="waifu"
    class="waifu"
  >
    <!-- 对话气泡 -->
    <transition name="tips-fade">
      <div 
        v-if="showTips && currentMessage"
        id="waifu-tips"
        class="waifu-tips"
        @click="hideTips"
      >
        <span v-html="currentMessage"></span>
      </div>
    </transition>

    <!-- Live2D Canvas -->
    <canvas id="live2d" ref="live2dCanvas" @click="handleModelClick"></canvas>

    <!-- 工具栏 -->
    <div class="waifu-tool">
      <span 
        class="waifu-tool-icon" 
        @click="goHome"
        :title="t('pet.tools.home')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      </span>
      <span 
        class="waifu-tool-icon" 
        @click="switchModel"
        :title="t('pet.tools.switchModel')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      </span>
      <span 
        class="waifu-tool-icon" 
        @click="showInfo"
        :title="t('pet.tools.info')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
      </span>
      <span 
        class="waifu-tool-icon" 
        @click="toggleChat"
        :title="t('pet.tips.chat')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      </span>
      <span 
        class="waifu-tool-icon" 
        @click="hideWaifu"
        :title="t('pet.tools.close')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
    </div>
    
    <!-- 聊天窗口 -->
    <ChatBox 
      :is-open="isChatOpen" 
      @close="isChatOpen = false" 
      @message-sent="stopIdleMessages"
      @message-received="handleAIChat"
    />
  </div>

  <!-- 召唤按钮 -->
  <transition name="btn-fade">
    <div 
      v-if="!isVisible"
      class="waifu-toggle"
      @click="showWaifu"
      :title="t('pet.tools.open')"
    >
      <div class="toggle-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-4.97 0-9 3.19-9 7.12 0 2.12 1.13 4.03 2.94 5.34l-.94 3.54 4.38-2.15c.86.19 1.72.28 2.62.28 4.97 0 9-3.19 9-7.12 0-3.84-4.03-7.01-9-7.01zm-2 8.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        </svg>
      </div>
      <span class="toggle-text">{{ t('pet.tools.open') }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import ChatBox from './ChatBox.vue'
import {
  getRandomMessage,
  getTimePeriod,
  getHolidayKey,
} from '@/data/pet-messages'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const route = useRoute()

// ========== 辅助：从 locale 的 pet 字段获取消息数组 ==========
// tm() 返回原始对象/数组，rt() 可渲染单个 message，
// 但对于纯字符串数组 tm() 直接返回 string[]，可以直接用。
function petMessages(path: string): string[] {
  const raw = tm(`pet.${path}`) as unknown
  if (Array.isArray(raw)) return raw.map(String)
  return []
}

function petTip(key: string, named?: Record<string, unknown>): string {
  return t(`pet.tips.${key}`, named ?? {})
}

// 状态
const isVisible = ref(true)
const isChatOpen = ref(false)
const showTips = ref(false)
const currentMessage = ref('')
const live2dCanvas = ref<HTMLCanvasElement | null>(null)

// 模型状态
const modelId = ref(0)
const flatModelList = ref<string[]>([]) // 扁平化的模型列表

// 定时器
let messageTimer: ReturnType<typeof setTimeout> | null = null
let idleTimer: ReturnType<typeof setTimeout> | null = null

// Live2D API CDN 路径 - 切换到更稳定的源
const cdnPath = 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/'

// 显示消息
function showMessage(text: string, duration = 5000, priority = false) {
  if (priority || !showTips.value) {
    currentMessage.value = text
    showTips.value = true
    
    if (messageTimer) clearTimeout(messageTimer)
    
    messageTimer = setTimeout(() => {
      showTips.value = false
    }, duration)
  }
}

function hideTips() {
  showTips.value = false
}

// 空闲消息
function startIdleMessages() {
  if (idleTimer) clearTimeout(idleTimer)
  
  const showIdle = () => {
    if (isVisible.value && !showTips.value) {
      showMessage(getRandomMessage(petMessages('idle')))
    }
    idleTimer = setTimeout(showIdle, 20000 + Math.random() * 25000)
  }
  
  idleTimer = setTimeout(showIdle, 15000 + Math.random() * 10000)
}

function stopIdleMessages() {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }
}

// 模型点击
function handleModelClick() {
  if (isChatOpen.value) return // 聊天时点击不触发随机语音
  const area = Math.random() > 0.5 ? 'touch.head' : 'touch.body'
  showMessage(getRandomMessage(petMessages(area)), 4000, true)
}

// 聊天功能
function toggleChat() {
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value) {
    stopIdleMessages()
    showMessage(petTip('chat'), 4000, true)
  } else {
    startIdleMessages()
  }
}

function handleAIChat(_reply: string) {
  showMessage(petTip('replying'), 2000)
}

// 工具栏功能
function goHome() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  showMessage(petTip('top'))
}

// 切换角色 (通过 API 获取下一个模型)
async function switchModel() {
  showMessage(petTip('switching'), 2000)
  
  try {
    if (flatModelList.value.length === 0) {
      const response = await fetch(`${cdnPath}model_list.json`)
      const data = await response.json()
      processModelList(data.models)
    }

    modelId.value = (modelId.value + 1) % flatModelList.value.length
    const model = flatModelList.value[modelId.value]
    await loadModel(model, 0)
    
    const modelName = model.split('/').pop() || petTip('noModel')
    showMessage(petTip('switched', { name: modelName }))
  } catch (error) {
    console.error('切换模型失败:', error)
    showMessage(petTip('switchFail'))
  }
}

function showInfo() {
  showMessage(petTip('info'), 6000, true)
}

function hideWaifu() {
  showMessage(petTip('bye'), 2000, true)
  setTimeout(() => {
    isVisible.value = false
    stopIdleMessages()
    localStorage.setItem('waifu-display', 'hide')
  }, 2000)
}

function showWaifu() {
  isVisible.value = true
  localStorage.setItem('waifu-display', 'show')
  
  nextTick(() => {
    initLive2D()
    startIdleMessages()
    showMessage(petTip('back'), 4000, true)
  })
}

// 加载指定模型
async function loadModel(modelPath: string, textureIndex: number = 0) {
  try {
    let modelJsonUrl = `${cdnPath}model/${modelPath}/index.json`
    if (textureIndex > 0) {
      modelJsonUrl = `${cdnPath}model/${modelPath}/index.json?texture=${textureIndex}`
    }
    if ((window as any).loadlive2d) {
      (window as any).loadlive2d('live2d', modelJsonUrl)
      console.log('加载模型:', modelJsonUrl)
    } else {
      console.error('loadlive2d from stevenjoezhang script not found')
    }
  } catch (error) {
    console.error('加载模型失败:', error)
    showMessage(petTip('loadFail'))
  }
}

// 处理模型列表（扁平化）
function processModelList(models: any[]) {
  flatModelList.value = []
  if (Array.isArray(models)) {
    models.forEach((item: any) => {
      if (Array.isArray(item)) {
        flatModelList.value.push(...item)
      } else {
        flatModelList.value.push(item)
      }
    })
  }
}

// Canvas 尺寸配置 - 分三档适配不同设备
const CANVAS_SIZE = {
  desktop: { width: 280, height: 250 },
  tablet: { width: 220, height: 200 },
  mobile: { width: 160, height: 140 }
}

// 初始化 Live2D
async function initLive2D() {
  try {
    if (live2dCanvas.value) {
      const width = window.innerWidth
      const size = width <= 480 
        ? CANVAS_SIZE.mobile 
        : width <= 768 
          ? CANVAS_SIZE.tablet 
          : CANVAS_SIZE.desktop
      live2dCanvas.value.width = size.width
      live2dCanvas.value.height = size.height
      live2dCanvas.value.style.width = `${size.width}px`
      live2dCanvas.value.style.height = `${size.height}px`
    }

    if (!(window as any).loadlive2d) {
      try {
        await loadScript('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js')
      } catch (e) {
        console.warn('Primary CDN failed, trying fallback...')
        await loadScript('https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js')
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      if (flatModelList.value.length === 0) {
        const response = await fetch(`${cdnPath}model_list.json`)
        if (!response.ok) throw new Error('Model list not found')
        const data = await response.json()
        processModelList(data.models)
      }
      
      if (flatModelList.value.length > 0) {
        await loadModel(flatModelList.value[modelId.value], 0)
      }
    } catch (error) {
      console.error('获取模型列表失败:', error)
      await loadModel('Potion-Maker/Pio', 0)
    }
  } catch (error) {
    console.error('Live2D 初始化严重失败:', error)
    showMessage(petTip('sleep'), 5000)
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = src
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 监听窗口大小变化以更新 Canvas 属性
window.addEventListener('resize', () => {
  if (live2dCanvas.value) {
    const width = window.innerWidth
    const size = width <= 480 
      ? CANVAS_SIZE.mobile 
      : width <= 768 
        ? CANVAS_SIZE.tablet 
        : CANVAS_SIZE.desktop
    if (live2dCanvas.value.width !== size.width) {
      live2dCanvas.value.width = size.width
      live2dCanvas.value.height = size.height
      live2dCanvas.value.style.width = `${size.width}px`
      live2dCanvas.value.style.height = `${size.height}px`
    }
  }
})

// 页面可见性变化
function handleVisibilityChange() {
  if (document.hidden) {
    stopIdleMessages()
  } else if (isVisible.value) {
    startIdleMessages()
    showMessage(petTip('back'))
  }
}

// 路由监听
watch(() => route.path, (newPath) => {
  const section = newPath.split('/')[1] || 'home'
  const msgs = petMessages(`page.${section}`)
  
  if (msgs.length > 0 && isVisible.value) {
    setTimeout(() => {
      showMessage(getRandomMessage(msgs))
    }, 800)
  }
})

// 初始化
onMounted(() => {
  const savedDisplay = localStorage.getItem('waifu-display')
  if (savedDisplay === 'hide') {
    isVisible.value = false
    return
  }
  
  // 显示欢迎消息
  const holidayKey = getHolidayKey()
  if (holidayKey) {
    const msgs = petMessages(`holiday.${holidayKey}`)
    showMessage(getRandomMessage(msgs), 8000)
  } else {
    const period = getTimePeriod()
    const msgs = Math.random() > 0.5
      ? petMessages('welcome')
      : petMessages(`greeting.${period}`)
    showMessage(getRandomMessage(msgs), 6000)
  }
  
  initLive2D()
  startIdleMessages()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

// 清理
onUnmounted(() => {
  stopIdleMessages()
  if (messageTimer) clearTimeout(messageTimer)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
/* 主容器 - 位于左下角 */
.waifu {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  font-size: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.waifu > * {
  pointer-events: auto;
}

/* 对话气泡 - 调整宽度适应更小的模型 */
.waifu-tips {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  min-height: 40px;
  margin-bottom: 10px;
  padding: 10px 14px;
  border: 2px solid rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 240, 250, 0.95) 100%);
  box-shadow: 
    0 8px 32px rgba(168, 85, 247, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  font-size: 13px;
  line-height: 1.5;
  text-align: center;
  color: #333;
  word-break: break-word;
  animation: shake 50s ease-in-out 5s infinite;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.dark .waifu-tips {
  background: linear-gradient(135deg, 
    rgba(30, 30, 50, 0.95) 0%, 
    rgba(50, 30, 60, 0.95) 100%);
  color: #eee;
  border-color: rgba(168, 85, 247, 0.5);
}

.waifu-tips::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(255, 240, 250, 0.95);
}

.dark .waifu-tips::before {
  border-top-color: rgba(50, 30, 60, 0.95);
}

@keyframes shake {
  2% { transform: translateX(-50%) rotate(-0.5deg); }
  4% { transform: translateX(-50%) rotate(0.5deg); }
  6% { transform: translateX(-50%) rotate(-0.5deg); }
  8% { transform: translateX(-50%) rotate(0.5deg); }
  10% { transform: translateX(-50%) rotate(0deg); }
}

/* Live2D Canvas */
#live2d {
  display: block;
  /* width 和 height 现在由 JS 动态控制，以确保 Canvas 绘图分辨率正确 */
  cursor: grab;
  transition: transform 0.3s ease;
}

#live2d:hover {
  transform: scale(1.02);
}

#live2d:active {
  cursor: grabbing;
}

/* 工具栏 - 相应缩小 */
.waifu-tool {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, 
    rgba(168, 85, 247, 0.9) 0%, 
    rgba(236, 72, 153, 0.9) 100%);
  border-radius: 20px;
  margin: -5px auto 5px;
  width: fit-content;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
}

.waifu-tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.waifu-tool-icon svg {
  width: 16px;
  height: 16px;
}

.waifu-tool-icon:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.15) rotate(5deg);
}

.waifu-tool-icon:active {
  transform: scale(0.95);
}

/* 召唤按钮 */
.waifu-toggle {
  position: fixed;
  left: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 14px;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
  transition: all 0.3s ease;
}

.waifu-toggle:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 30px rgba(168, 85, 247, 0.5);
}

.toggle-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.toggle-icon svg {
  width: 20px;
  height: 20px;
  fill: white;
}

.toggle-text {
  font-size: 11px;
  color: white;
  font-weight: 500;
}

/* 动画 */
.tips-fade-enter-active,
.tips-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.tips-fade-enter-from,
.tips-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px) scale(0.95);
}

.btn-fade-enter-active,
.btn-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.btn-fade-enter-from,
.btn-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@media (max-width: 768px) {
  /* 移动端：缩小看板娘并确保不与 Speed Dial FAB 重叠 */
  .waifu {
    transform: scale(0.7);
    transform-origin: bottom left;
  }
  
  .waifu-tips {
    width: 160px;
    font-size: 11px;
    padding: 8px 12px;
  }
  
  .waifu-tool {
    padding: 6px 10px;
    gap: 5px;
  }
  
  .waifu-tool-icon {
    width: 24px;
    height: 24px;
  }
  
  .waifu-tool-icon svg {
    width: 14px;
    height: 14px;
  }
  
  /* 移动端召唤按钮：左下角，避开右下角的 Speed Dial */
  .waifu-toggle {
    left: 16px;
    right: auto;
    bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
    padding: 10px 14px;
  }
  
  .toggle-icon {
    width: 28px;
    height: 28px;
  }
  
  .toggle-text {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  /* 极小屏幕：进一步缩小召唤按钮 */
  .waifu-toggle {
    padding: 8px 10px;
    left: 12px;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .waifu-tips {
    animation: none;
  }
  
  #live2d:hover {
    transform: none;
  }
}
</style>
