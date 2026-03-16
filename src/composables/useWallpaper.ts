import { ref, computed, onMounted } from 'vue'
import {
    wallpapers,
    getDefaultWallpaper,
    getWallpaperById,
    defaultWallpaperConfig,
    type Wallpaper,
    type WallpaperConfig
} from '@/data/wallpaper'
import { wallpaperApi } from '@/lib/supabase'

const LOCAL_STORAGE_KEY = 'site-wallpaper-config'

// 全局响应式状态
const wallpaperConfig = ref<WallpaperConfig>(structuredClone(defaultWallpaperConfig))
const isLoading = ref(false)
const lastSaveTime = ref<Date | null>(null)

export function useWallpaper() {
    // 当前壁纸对象 (用于预设模式)
    const currentWallpaper = computed<Wallpaper | null>(() => {
        if (wallpaperConfig.value.base.type === 'preset') {
            return getWallpaperById(wallpaperConfig.value.base.value) || getDefaultWallpaper()
        }
        return null
    })

    // 所有预设壁纸
    const availableWallpapers = computed(() => wallpapers)

    // 当前配置
    const config = computed(() => wallpaperConfig.value)

    // 获取背景 CSS
    const backgroundCSS = computed(() => {
        const { base } = wallpaperConfig.value

        switch (base.type) {
            case 'preset':
                const preset = getWallpaperById(base.value)
                return preset?.value || getDefaultWallpaper().value
            case 'image':
                return base.value ? `url(${base.value}) center/cover no-repeat fixed` : getDefaultWallpaper().value
            case 'gradient':
                return base.value || getDefaultWallpaper().value
            case 'solid':
                return base.value || '#0f0f23'
            default:
                return getDefaultWallpaper().value
        }
    })

    // 设置基础层类型
    const setBaseType = (type: WallpaperConfig['base']['type']) => {
        wallpaperConfig.value.base.type = type
        // 为新类型设置默认值
        if (type === 'preset') {
            wallpaperConfig.value.base.value = 'bento-dark'
        } else if (type === 'solid') {
            wallpaperConfig.value.base.value = '#0f0f23'
        } else if (type === 'gradient') {
            wallpaperConfig.value.base.value = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
        } else if (type === 'image') {
            wallpaperConfig.value.base.value = ''
        }
    }

    // 设置预设壁纸
    const setPreset = (id: string) => {
        wallpaperConfig.value.base = { type: 'preset', value: id }
    }

    // 设置自定义图片
    const setImage = (url: string) => {
        wallpaperConfig.value.base = { type: 'image', value: url }
    }

    // 设置自定义渐变
    const setGradient = (css: string) => {
        wallpaperConfig.value.base = { type: 'gradient', value: css }
    }

    // 设置纯色
    const setSolid = (color: string) => {
        wallpaperConfig.value.base = { type: 'solid', value: color }
    }

    // 更新效果设置
    const updateEffect = <K extends keyof WallpaperConfig['effects']>(
        effectName: K,
        settings: Partial<WallpaperConfig['effects'][K]>
    ) => {
        wallpaperConfig.value.effects[effectName] = {
            ...wallpaperConfig.value.effects[effectName],
            ...settings
        }
    }

    // 切换效果开关
    const toggleEffect = (effectName: keyof WallpaperConfig['effects']) => {
        wallpaperConfig.value.effects[effectName].enabled =
            !wallpaperConfig.value.effects[effectName].enabled
    }

    // 更新动画设置
    const updateAnimation = (settings: Partial<WallpaperConfig['animation']>) => {
        wallpaperConfig.value.animation = {
            ...wallpaperConfig.value.animation,
            ...settings
        }
    }

    // 恢复默认
    const resetToDefault = () => {
        wallpaperConfig.value = structuredClone(defaultWallpaperConfig)
    }

    // 保存到服务器 (管理员操作)
    const saveToServer = async (): Promise<boolean> => {
        try {
            isLoading.value = true
            await wallpaperApi.saveConfig(wallpaperConfig.value)
            // 同时保存到本地作为缓存
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wallpaperConfig.value))
            lastSaveTime.value = new Date()
            return true
        } catch (e) {
            console.error('保存壁纸配置到服务器失败:', e)
            return false
        } finally {
            isLoading.value = false
        }
    }

    // 从服务器加载
    const loadFromServer = async () => {
        try {
            const serverConfig = await wallpaperApi.getConfig()
            if (serverConfig) {
                // 合并服务器配置
                wallpaperConfig.value = {
                    ...structuredClone(defaultWallpaperConfig),
                    ...serverConfig,
                    effects: {
                        ...structuredClone(defaultWallpaperConfig.effects),
                        ...(serverConfig.effects || {})
                    },
                    animation: {
                        ...structuredClone(defaultWallpaperConfig.animation),
                        ...(serverConfig.animation || {})
                    }
                }
                // 更新本地缓存
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wallpaperConfig.value))
                return true
            }
            return false
        } catch (e) {
            console.error('从服务器加载壁纸配置失败:', e)
            return false
        }
    }

    // 从本地缓存加载
    const loadFromLocal = () => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
            if (saved) {
                const parsed = JSON.parse(saved) as WallpaperConfig
                wallpaperConfig.value = {
                    ...structuredClone(defaultWallpaperConfig),
                    ...parsed,
                    effects: {
                        ...structuredClone(defaultWallpaperConfig.effects),
                        ...(parsed.effects || {})
                    },
                    animation: {
                        ...structuredClone(defaultWallpaperConfig.animation),
                        ...(parsed.animation || {})
                    }
                }
                return true
            }
            return false
        } catch (e) {
            console.error('加载本地壁纸配置失败:', e)
            return false
        }
    }

    // 初始化 - 优先从服务器加载，失败则从本地加载
    const initWallpaper = async () => {
        // 先从本地快速加载
        loadFromLocal()
        // 再尝试从服务器同步最新配置
        await loadFromServer()
    }

    // 组件挂载时初始化
    onMounted(() => {
        initWallpaper()
    })

    return {
        // 状态
        config,
        currentWallpaper,
        availableWallpapers,
        backgroundCSS,
        isLoading,
        lastSaveTime,

        // 基础层操作
        setBaseType,
        setPreset,
        setImage,
        setGradient,
        setSolid,

        // 效果操作
        updateEffect,
        toggleEffect,
        updateAnimation,

        // 通用操作
        resetToDefault,
        saveToServer,
        loadFromServer,
        initWallpaper
    }
}
