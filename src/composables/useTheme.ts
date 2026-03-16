import { ref } from 'vue'

// Singleton State
const isDark = ref(false)
const isAuto = ref(false)
let intervalId: any = null

const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const checkAutoTheme = () => {
  if (!isAuto.value) return
  const hour = new Date().getHours()
  // 晚7点到早6点为深色模式
  const shouldBeDark = hour >= 19 || hour < 6
  if (isDark.value !== shouldBeDark) {
    isDark.value = shouldBeDark
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }
}

// Initialize (Run once)
const init = () => {
  if (typeof window === 'undefined') return

  const savedAuto = localStorage.getItem('theme_auto')
  if (savedAuto === 'true') {
    isAuto.value = true
    checkAutoTheme()
    intervalId = setInterval(checkAutoTheme, 60000)
  } else {
    // 没开自动模式，读取保存的主题或系统偏好
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }
}

// Start initialization
init()

export function useTheme() {
  const toggleTheme = () => {
    // 手动切换时，如果开启了自动模式，则关闭自动模式
    if (isAuto.value) {
      isAuto.value = false
      localStorage.setItem('theme_auto', 'false')
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  const toggleAuto = () => {
    isAuto.value = !isAuto.value
    localStorage.setItem('theme_auto', String(isAuto.value))

    if (isAuto.value) {
      // 开启自动模式：立即检查时间并启动定时器
      checkAutoTheme()
      intervalId = setInterval(checkAutoTheme, 60000)
    } else {
      // 关闭自动模式：清除定时器
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }

  return {
    isDark,
    isAuto,
    toggleTheme,
    toggleAuto
  }
}

