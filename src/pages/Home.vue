<template>
  <div class="relative min-h-screen">
    <!-- 动画背景 -->
    <AnimatedBackground />

    <!-- 导航栏 -->
    <Navbar />

    <!-- 主要内容 -->
    <main class="relative z-10">
      <!-- Hero Section - 全屏 -->
      <BentoHero />

      <!-- Main Content Sections -->
      <div class="max-w-6xl mx-auto px-6 space-y-24 pb-24">
        <!-- Stats Section -->
        <BentoStats />

        <!-- Experience Section -->
        <BentoExperience />

        <!-- Projects Section -->
        <BentoProjects />

        <!-- Skills Section -->
        <BentoSkills />

        <!-- Education & Awards Grid -->
        <section>
          <AnimatedSection :delay="100">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Education Card -->
              <BentoEducation />
              <!-- Awards Card -->
              <BentoAwards />
            </div>
          </AnimatedSection>
        </section>

        <!-- Divider -->
        <div class="flex items-center justify-center gap-4">
          <div class="h-px w-20 bg-gradient-to-r from-transparent to-purple-500/50"></div>
          <span class="text-sm text-gray-500">{{ t('home.interaction') }}</span>
          <div class="h-px w-20 bg-gradient-to-l from-transparent to-purple-500/50"></div>
        </div>

        <!-- Interactive Sections -->
        <QA />
        <Guestbook />
        
        <!-- Contact Section -->
        <section id="contact">
          <Contact />
        </section>
      </div>

      <!-- Footer -->
      <footer class="relative py-16 px-6 overflow-hidden border-t border-white/5">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        
        <div class="max-w-6xl mx-auto relative z-10">
          <div class="text-center space-y-6">
            <!-- Name -->
            <div class="flex justify-center items-center gap-4">
              <div class="h-0.5 w-16 bg-gradient-to-r from-transparent to-purple-500 rounded-full"></div>
              <span class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {{ resumeData.personalInfo.name }}
              </span>
              <div class="h-0.5 w-16 bg-gradient-to-l from-transparent to-pink-500 rounded-full"></div>
            </div>

            <!-- Position -->
            <p class="text-sm text-gray-500">
              {{ resumeData.personalInfo.targetPosition }}
            </p>

            <!-- Social Links -->
            <div class="flex justify-center gap-4">
              <a
                v-for="link in resumeData.socialLinks"
                :key="link.name"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:border-purple-500/30 transition-all"
              >
                {{ link.name }}
              </a>
            </div>

            <!-- Copyright -->
            <p class="text-xs text-gray-600 pt-4">
              &copy; {{ currentYear }} {{ resumeData.personalInfo.name }}. {{ t('footer.rights') }}
            </p>
          </div>
        </div>
      </footer>
    </main>

    <!-- 返回顶部按钮 -->
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResume } from '@/composables/useResume'
const { resume: resumeData } = useResume()
const { t } = useI18n()
import AnimatedBackground from '@/components/AnimatedBackground.vue'
import Navbar from '@/components/Navbar.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import AnimatedSection from '@/components/AnimatedSection.vue'

// Bento 组件
import BentoHero from '@/sections/BentoHero.vue'
import BentoStats from '@/sections/BentoStats.vue'
import BentoEducation from '@/sections/BentoEducation.vue'
import BentoSkills from '@/sections/BentoSkills.vue'
import BentoExperience from '@/sections/BentoExperience.vue'
import BentoProjects from '@/sections/BentoProjects.vue'
import BentoAwards from '@/sections/BentoAwards.vue'

// 保留的原有组件
import QA from '@/sections/QA.vue'
import Guestbook from '@/sections/Guestbook.vue'
import Contact from '@/sections/Contact.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
