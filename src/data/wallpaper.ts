// 高级壁纸配置数据结构

// 壁纸配置接口
export interface WallpaperConfig {
    // 基础层
    base: {
        type: 'preset' | 'image' | 'gradient' | 'solid'
        value: string // 预设ID / 图片URL / 渐变CSS / 颜色值
    }
    // 效果层
    effects: {
        colorOverlay: { enabled: boolean; color: string; opacity: number }
        particles: { enabled: boolean; count: number; speed: number; color: string }
        grid: { enabled: boolean; opacity: number; size: number }
        orbs: { enabled: boolean; count: number; blur: number }
    }
    // 动画
    animation: {
        gradientShift: boolean
        parallax: boolean
    }
}

// 预设壁纸接口
export interface Wallpaper {
    id: string
    name: string
    type: 'gradient' | 'image' | 'animated'
    value: string
    preview: string
    isDefault?: boolean
}

// 默认配置
export const defaultWallpaperConfig: WallpaperConfig = {
    base: {
        type: 'preset',
        value: 'bento-dark'
    },
    effects: {
        colorOverlay: { enabled: false, color: '#000000', opacity: 0.3 },
        particles: { enabled: true, count: 20, speed: 15, color: '#a855f7' },
        grid: { enabled: true, opacity: 0.5, size: 60 },
        orbs: { enabled: true, count: 3, blur: 80 }
    },
    animation: {
        gradientShift: false,
        parallax: false
    }
}

// 预设壁纸列表
export const wallpapers: Wallpaper[] = [
    {
        id: 'bento-dark',
        name: 'Bento 深色',
        type: 'gradient',
        value: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent), linear-gradient(to bottom, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        preview: 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
        isDefault: true
    },
    {
        id: 'aurora',
        name: '极光',
        type: 'animated',
        value: 'linear-gradient(135deg, rgba(120, 119, 198, 0.15) 0%, rgba(168, 85, 247, 0.15) 25%, rgba(59, 130, 246, 0.15) 50%, rgba(16, 185, 129, 0.15) 75%, rgba(120, 119, 198, 0.15) 100%)',
        preview: 'linear-gradient(135deg, #7877c6, #a855f7, #3b82f6)'
    },
    {
        id: 'mesh-gradient',
        name: '网格渐变',
        type: 'gradient',
        value: 'radial-gradient(at 40% 20%, hsla(280, 80%, 50%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(200, 100%, 50%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(340, 100%, 50%, 0.2) 0px, transparent 50%), linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
        preview: 'linear-gradient(135deg, #1a1a2e, #2d1b4e, #1e3a5f)'
    },
    {
        id: 'cyber-grid',
        name: '赛博网格',
        type: 'gradient',
        value: 'linear-gradient(rgba(120, 119, 198, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(120, 119, 198, 0.03) 1px, transparent 1px), linear-gradient(to bottom, #0a0a0f 0%, #0f0f1a 100%)',
        preview: 'linear-gradient(135deg, #0a0a0f, #1a1a2e)'
    },
    {
        id: 'warm-sunset',
        name: '温暖日落',
        type: 'gradient',
        value: 'radial-gradient(ellipse at top, rgba(251, 146, 60, 0.15), transparent 50%), radial-gradient(ellipse at bottom, rgba(239, 68, 68, 0.1), transparent 50%), linear-gradient(to bottom, #1a1a2e 0%, #2a1a1a 100%)',
        preview: 'linear-gradient(135deg, #fb923c, #ef4444)'
    },
    {
        id: 'ocean-deep',
        name: '深海',
        type: 'gradient',
        value: 'radial-gradient(ellipse at bottom, rgba(6, 182, 212, 0.15), transparent 60%), linear-gradient(to bottom, #0a0a1a 0%, #0a1a2a 50%, #0f1f3a 100%)',
        preview: 'linear-gradient(135deg, #06b6d4, #0ea5e9, #0f1f3a)'
    },
    {
        id: 'forest-night',
        name: '森林之夜',
        type: 'gradient',
        value: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.1), transparent 60%), linear-gradient(to bottom, #0a1a0a 0%, #0f1f0f 50%, #1a2a1a 100%)',
        preview: 'linear-gradient(135deg, #22c55e, #10b981, #0a1a0a)'
    }
]

export const getDefaultWallpaper = (): Wallpaper => {
    return wallpapers.find(w => w.isDefault) || wallpapers[0]
}

export const getWallpaperById = (id: string): Wallpaper | undefined => {
    return wallpapers.find(w => w.id === id)
}
