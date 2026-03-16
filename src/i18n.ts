import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

// 获取浏览器语言或默认使用中文
const defaultLocale = localStorage.getItem('locale') || (navigator.language.startsWith('en') ? 'en' : 'zh')

const i18n = createI18n({
    legacy: false, // 使用 Composition API
    locale: defaultLocale,
    fallbackLocale: 'zh',
    messages: {
        zh,
        en
    }
})

export default i18n
