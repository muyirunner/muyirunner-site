<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 print:bg-white print:py-0">
    <!-- 打印控制栏 (打印时隐藏) -->
    <div class="max-w-[210mm] mx-auto mb-6 flex justify-end gap-4 print:hidden px-4">
      <router-link to="/" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
        返回首页
      </router-link>
      <button @click="print" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        打印 / 另存为 PDF
      </button>
    </div>

    <!-- A4 纸张容器 -->
    <div class="max-w-[210mm] mx-auto bg-white text-gray-900 shadow-2xl print:shadow-none print:w-full print:max-w-none box-border p-[20mm] md:p-[25mm] min-h-[297mm]">
      
      <!-- 头部信息 -->
      <header class="border-b-2 border-gray-800 pb-4 mb-6">
        <div class="flex justify-between items-end">
          <div>
            <h1 class="text-4xl font-bold mb-2">{{ resume.personalInfo.name }}</h1>
            <p class="text-xl font-medium text-gray-700">{{ resume.personalInfo.targetPosition }}</p>
          </div>
          <div class="text-right text-sm leading-relaxed">
            <p>{{ resume.personalInfo.phone }} | {{ resume.personalInfo.email }}</p>
            <p>{{ resume.personalInfo.location }} | 微信: {{ resume.personalInfo.wechat }}</p>
            <div class="flex justify-end gap-4 mt-1">
              <a v-for="link in resume.socialLinks" :key="link.name" :href="link.url" class="text-blue-600 hover:underline print:text-black">
                {{ link.name }}
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- 教育背景 -->
      <section class="mb-6">
        <h2 class="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wider">教育背景</h2>
        <div class="flex justify-between mb-1">
          <div class="font-bold">{{ resume.education.school }}</div>
          <div class="font-bold">{{ resume.education.period }}</div>
        </div>
        <div class="flex justify-between mb-2">
          <div>{{ resume.education.degree }} | {{ resume.education.major }}</div>
          <div>GPA: {{ resume.education.gpa }}</div>
        </div>
        <ul class="list-disc list-inside text-sm text-gray-700">
          <li v-for="hl in resume.education.highlights" :key="hl" class="inline-block mr-6">
            {{ hl }}
          </li>
        </ul>
      </section>

      <!-- 技能清单 -->
      <section class="mb-6">
        <h2 class="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wider">专业技能</h2>
        <div class="grid grid-cols-1 gap-y-2 text-sm leading-relaxed">
          <div v-for="skillGroup in resume.skills" :key="skillGroup.category" class="flex">
            <span class="font-bold w-32 flex-shrink-0">{{ skillGroup.category }}:</span>
            <span>{{ skillGroup.skills.join(' / ') }}</span>
          </div>
        </div>
      </section>

      <!-- 实习经历 -->
      <section class="mb-6">
        <h2 class="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wider">实习经历</h2>
        <div v-for="exp in resume.experiences" :key="exp.id" class="mb-4 last:mb-0">
          <div class="flex justify-between font-bold mb-1">
            <div>{{ exp.company }} | {{ exp.position }}</div>
            <div>{{ exp.period }}</div>
          </div>
          <ul class="list-disc list-inside text-sm text-gray-700 leading-relaxed">
            <li v-for="(item, idx) in exp.responsibilities" :key="idx">
              {{ item }}
            </li>
          </ul>
        </div>
      </section>

      <!-- 项目经历 -->
      <section class="mb-6">
        <h2 class="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wider">项目经历</h2>
        <div v-for="proj in resume.projects" :key="proj.id" class="mb-4 last:mb-0">
          <div class="flex justify-between font-bold mb-1">
            <div>{{ proj.title }} <span class="font-normal text-gray-600">({{ proj.role }})</span></div>
            <div>{{ proj.period }}</div>
          </div>
          <ul class="list-disc list-inside text-sm text-gray-700 leading-relaxed">
            <li v-for="(item, idx) in proj.highlights" :key="idx">
              {{ item }}
            </li>
          </ul>
        </div>
      </section>

      <!-- 荣誉奖项 -->
      <section class="mb-0">
        <h2 class="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wider">荣誉奖项</h2>
        <ul class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm list-disc list-inside">
          <li v-for="award in resume.awards" :key="award.id">
            <span class="font-medium">{{ award.title }}</span>
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { resumeData } from '@/data/resume'

const resume = resumeData

function print() {
  window.print()
}
</script>

<style>
@media print {
  @page {
    margin: 0;
    size: A4;
  }
  body {
    -webkit-print-color-adjust: exact;
  }
}
</style>
