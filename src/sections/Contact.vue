<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResume } from '@/composables/useResume'
import SectionTitle from '@/components/SectionTitle.vue'

const { t } = useI18n()
const { resume: data } = useResume()

const copiedId = ref<string | null>(null)

// 复制功能
const copyToClipboard = async (text: string, id: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = id
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

// Contacts definition moved inside template or computed if needed, 
// but since we need t(), it must be inside script setup.
// We can define it as a computed property to be reactive to locale changes.
import { computed } from 'vue'

const contacts = computed(() => [
  {
    id: 'email',
    icon: '📧',
    label: t('contact.email'),
    value: data.value.personalInfo.email,
    action: 'mailto:' + data.value.personalInfo.email
  },
  {
    id: 'phone',
    icon: '📱',
    label: t('contact.phone'),
    value: data.value.personalInfo.phone,
    action: 'tel:' + data.value.personalInfo.phone
  },
  {
    id: 'wechat',
    icon: '💬',
    label: t('contact.wechat'),
    value: data.value.personalInfo.wechat || 'wxid_xxxxxx',
    action: ''
  },
  {
    id: 'location',
    icon: '📍',
    label: t('contact.location'),
    value: data.value.personalInfo.location,
    action: ''
  }
])
</script>

<template>
  <section id="contact" class="py-20 px-6 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-mesh-gradient opacity-20"></div>
    <div class="absolute -right-20 bottom-0 w-96 h-96 bg-gradient-start/10 rounded-full blur-3xl animate-pulse-slow"></div>
    
    <div class="max-w-4xl mx-auto relative z-10">
      <SectionTitle
        :title="t('contact.title')"
        :subtitle="t('contact.subtitle')"
      />

      <div class="grid md:grid-cols-2 gap-6 mt-12">
        <div
          v-for="(item, index) in contacts"
          :key="item.id"
          class="group relative"
        >
          <div class="absolute -inset-0.5 bg-gradient-primary rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
          
          <div class="relative glass rounded-2xl p-6 border border-white/10 hover:border-transparent transition-all duration-300 transform group-hover:-translate-y-1">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                {{ item.icon }}
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ item.label }}</p>
                <p class="text-lg font-bold text-gray-900 dark:text-white truncate font-mono">{{ item.value }}</p>
              </div>

              <button
                @click="copyToClipboard(item.value, item.id)"
                class="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
                :title="t('common.copy')"
              >
                <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform scale-50 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-50 opacity-0"
                  mode="out-in"
                >
                  <svg
                    v-if="copiedId === item.id"
                    class="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5 text-gray-400 group-hover:text-gradient-start"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </transition>
                
                <!-- Tooltip -->
                <span
                  class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                >
                  {{ copiedId === item.id ? t('common.copied') : t('common.copy') }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 社交媒体链接 -->
      <div class="flex justify-center gap-6 mt-12 pb-8">
        <a
          v-for="social in data.socialLinks"
          :key="social.name"
          :href="social.url"
          target="_blank"
          class="w-12 h-12 rounded-full glass flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gradient-primary hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-glow-purple"
        >
          <span class="text-xl">{{ social.icon }}</span>
        </a>
      </div>
    </div>
  </section>
</template>
