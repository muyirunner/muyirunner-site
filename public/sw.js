// Service Worker — 缓存优先策略
// 缓存静态资源，网络不可用时提供离线体验

const CACHE_NAME = 'yangwenchuan-v1'
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/favicon.ico'
]

// 安装阶段：预缓存核心资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS)
        })
    )
    // 立即激活，跳过等待
    self.skipWaiting()
})

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        })
    )
    // 接管所有页面
    self.clients.claim()
})

// 请求拦截：网络优先 + 缓存回退
self.addEventListener('fetch', (event) => {
    const { request } = event

    // 只处理 GET 请求
    if (request.method !== 'GET') return

    // 跳过外部 API 请求（Supabase、DeepSeek 等）
    if (request.url.includes('supabase') || request.url.includes('deepseek')) return

    // 静态资源（JS/CSS/图片）使用缓存优先
    if (request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'image' ||
        request.destination === 'font') {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached
                return fetch(request).then((response) => {
                    // 缓存新资源
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    return response
                })
            })
        )
        return
    }

    // HTML 页面使用网络优先
    event.respondWith(
        fetch(request)
            .then((response) => {
                // 缓存页面响应
                const clone = response.clone()
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                return response
            })
            .catch(() => {
                // 网络失败时尝试缓存
                return caches.match(request).then((cached) => {
                    return cached || caches.match('/')
                })
            })
    )
})
