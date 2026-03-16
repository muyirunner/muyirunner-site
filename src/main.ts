import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

createApp(App)
    .use(router)
    .use(i18n)
    .mount('#app')

// 注册 Service Worker (PWA 离线支持)
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service Worker 注册失败不影响正常使用
        })
    })
}
