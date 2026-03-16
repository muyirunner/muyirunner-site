import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { resumeData as resumeZh } from '@/data/resume'
import { resumeDataEn } from '@/data/resume_en'

export function useResume() {
    const { locale } = useI18n()

    const resume = computed(() => {
        return locale.value === 'en' ? resumeDataEn : resumeZh
    })

    // 辅助函数：根据当前语言获取对应的 resume 数据
    // 有些组件可能只需要 resume 数据，而不直接依 i18n
    return {
        resume
    }
}
