import { ref } from 'vue'

const deferredPrompt = ref<any>(null)
const isPwaInstalled = ref(false)

// 初始化监听 (只需调用一次)
export function initPwaListener() {
    if (typeof window === 'undefined') return

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('PWA: Global listener caught beforeinstallprompt!', e)
        e.preventDefault()
        deferredPrompt.value = e
    })

    window.addEventListener('appinstalled', () => {
        console.log('PWA: App installed')
        deferredPrompt.value = null
        isPwaInstalled.value = true
    })
}

export function usePWA() {
    const installPwa = async () => {
        if (!deferredPrompt.value) return

        deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice
        console.log(`User response to the install prompt: ${outcome}`)
        deferredPrompt.value = null
    }

    return {
        deferredPrompt,
        isPwaInstalled,
        installPwa
    }
}
