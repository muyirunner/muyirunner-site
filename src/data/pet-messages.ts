/**
 * 看板娘对话消息配置 (国际化版)
 * Virtual Pet / Waifu Messages Configuration (i18n supported)
 * 
 * 所有消息已移入 locales/zh.ts 和 locales/en.ts 的 pet 字段。
 * 此文件仅保留辅助函数，供 VirtualPet.vue 使用。
 */

/**
 * 获取随机消息
 */
export function getRandomMessage(messages: string[]): string {
    if (!messages || messages.length === 0) return ''
    return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * 获取当前时间段 key
 */
export function getTimePeriod(): string {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 11) return 'morning'
    if (hour >= 11 && hour < 13) return 'noon'
    if (hour >= 13 && hour < 18) return 'afternoon'
    if (hour >= 18 && hour < 22) return 'evening'
    return 'night'
}

/**
 * 获取当前节日 key（如果有的话）
 */
export function getHolidayKey(): string | null {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()

    if (month === 1 && day === 1) return 'newYear'
    if (month === 2 && day === 14) return 'valentine'
    if (month === 10 && day === 31) return 'halloween'
    if (month === 12 && day === 25) return 'christmas'

    return null
}
