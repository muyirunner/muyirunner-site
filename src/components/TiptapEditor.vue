<template>
  <div class="tiptap-editor">
    <!-- 工具栏 -->
    <div class="toolbar glass rounded-xl p-2 mb-3 flex flex-wrap gap-1 border border-white/10">
      <!-- 格式组 -->
      <div class="flex gap-1 pr-2 border-r border-gray-300/30">
        <button
          @click="editor?.chain().focus().toggleBold().run()"
          :class="['toolbar-btn', { active: editor?.isActive('bold') }]"
          title="粗体 (Ctrl+B)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleItalic().run()"
          :class="['toolbar-btn', { active: editor?.isActive('italic') }]"
          title="斜体 (Ctrl+I)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 16V4m-4 16h8" transform="skewX(-12)" />
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleStrike().run()"
          :class="['toolbar-btn', { active: editor?.isActive('strike') }]"
          title="删除线"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5v14" transform="rotate(45 12 12)" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16" />
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleCode().run()"
          :class="['toolbar-btn', { active: editor?.isActive('code') }]"
          title="行内代码"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>

      <!-- 标题组 -->
      <div class="flex gap-1 px-2 border-r border-gray-300/30">
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="['toolbar-btn', { active: editor?.isActive('heading', { level: 1 }) }]"
          title="标题1"
        >
          H1
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="['toolbar-btn', { active: editor?.isActive('heading', { level: 2 }) }]"
          title="标题2"
        >
          H2
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="['toolbar-btn', { active: editor?.isActive('heading', { level: 3 }) }]"
          title="标题3"
        >
          H3
        </button>
      </div>

      <!-- 列表组 -->
      <div class="flex gap-1 px-2 border-r border-gray-300/30">
        <button
          @click="editor?.chain().focus().toggleBulletList().run()"
          :class="['toolbar-btn', { active: editor?.isActive('bulletList') }]"
          title="无序列表"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleOrderedList().run()"
          :class="['toolbar-btn', { active: editor?.isActive('orderedList') }]"
          title="有序列表"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h14M7 12h14M7 16h14M3 8h.01M3 12h.01M3 16h.01" />
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleBlockquote().run()"
          :class="['toolbar-btn', { active: editor?.isActive('blockquote') }]"
          title="引用"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().toggleCodeBlock().run()"
          :class="['toolbar-btn', { active: editor?.isActive('codeBlock') }]"
          title="代码块"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <!-- 插入组 -->
      <div class="flex gap-1 px-2 border-r border-gray-300/30">
        <button @click="setLink" class="toolbar-btn" title="插入链接">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        <button @click="addImage" class="toolbar-btn" title="插入图片">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button @click="editor?.chain().focus().setHorizontalRule().run()" class="toolbar-btn" title="分隔线">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16" />
          </svg>
        </button>
      </div>

      <!-- 操作组 -->
      <div class="flex gap-1 px-2">
        <button
          @click="editor?.chain().focus().undo().run()"
          :disabled="!editor?.can().undo()"
          class="toolbar-btn"
          title="撤销 (Ctrl+Z)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          @click="editor?.chain().focus().redo().run()"
          :disabled="!editor?.can().redo()"
          class="toolbar-btn"
          title="重做 (Ctrl+Y)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>
        <button @click="showFindReplace = !showFindReplace" :class="['toolbar-btn', { active: showFindReplace }]" title="查找替换 (Ctrl+F)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 查找替换面板 -->
    <div v-if="showFindReplace" class="find-replace glass rounded-xl p-3 mb-3 border border-white/10">
      <div class="flex flex-wrap gap-2 items-center">
        <div class="flex-1 min-w-[150px]">
          <input
            v-model="findText"
            type="text"
            placeholder="查找..."
            class="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-dark-card/50 border border-white/10 outline-none text-sm"
            @keyup.enter="findNext"
          />
        </div>
        <div class="flex-1 min-w-[150px]">
          <input
            v-model="replaceText"
            type="text"
            placeholder="替换为..."
            class="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-dark-card/50 border border-white/10 outline-none text-sm"
          />
        </div>
        <div class="flex gap-1">
          <button @click="findNext" class="px-3 py-2 text-xs rounded-lg glass-subtle hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
            查找下一个
          </button>
          <button @click="replaceOne" class="px-3 py-2 text-xs rounded-lg glass-subtle hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
            替换
          </button>
          <button @click="replaceAll" class="px-3 py-2 text-xs rounded-lg glass-subtle hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
            全部替换
          </button>
        </div>
        <span v-if="findCount > 0" class="text-xs text-gray-500">找到 {{ findCount }} 处</span>
      </div>
    </div>

    <!-- 编辑器区域 -->
    <div class="editor-wrapper glass rounded-xl border border-white/10 overflow-hidden">
      <editor-content :editor="editor" class="editor-content" />
    </div>

    <!-- 字数统计 -->
    <div class="mt-2 text-xs text-gray-500 text-right">
      {{ characterCount }} 字符
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

// 查找替换
const showFindReplace = ref(false)
const findText = ref('')
const replaceText = ref('')
const findCount = ref(0)

// 编辑器实例
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    Link.configure({
      openOnClick: false,
    }),
    Placeholder.configure({
      placeholder: props.placeholder || '开始写作...',
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// 字符数统计
const characterCount = computed(() => {
  return editor.value?.storage?.characterCount?.characters() || editor.value?.getText().length || 0
})

// 监听外部值变化
watch(() => props.modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (!isSame) {
    editor.value?.commands.setContent(value, false)
  }
})

// 设置链接
function setLink() {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('请输入链接地址:', previousUrl)

  if (url === null) return

  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

// 添加图片
function addImage() {
  const url = window.prompt('请输入图片地址:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

// 查找功能
function findNext() {
  if (!findText.value || !editor.value) return
  
  const text = editor.value.getText()
  const matches = text.match(new RegExp(findText.value, 'gi'))
  findCount.value = matches?.length || 0
  
  // 高亮并选中找到的文本
  const content = editor.value.getHTML()
  const index = content.toLowerCase().indexOf(findText.value.toLowerCase())
  if (index !== -1) {
    // 简单的查找实现 - 选中文本
    const { state } = editor.value
    const { doc } = state
    let found = false
    doc.descendants((node, pos) => {
      if (found) return false
      if (node.isText && node.text) {
        const textIndex = node.text.toLowerCase().indexOf(findText.value.toLowerCase())
        if (textIndex !== -1) {
          editor.value?.chain().focus().setTextSelection({ from: pos + textIndex, to: pos + textIndex + findText.value.length }).run()
          found = true
          return false
        }
      }
    })
  }
}

// 替换单个
function replaceOne() {
  if (!findText.value || !editor.value) return
  
  const { state } = editor.value
  const { selection } = state
  const selectedText = state.doc.textBetween(selection.from, selection.to)
  
  if (selectedText.toLowerCase() === findText.value.toLowerCase()) {
    editor.value.chain().focus().insertContent(replaceText.value).run()
  }
  findNext()
}

// 全部替换
function replaceAll() {
  if (!findText.value || !editor.value) return
  
  const html = editor.value.getHTML()
  const regex = new RegExp(findText.value, 'gi')
  const newHtml = html.replace(regex, replaceText.value)
  editor.value.commands.setContent(newHtml)
  findCount.value = 0
}

// 快捷键
function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault()
    showFindReplace.value = true
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  editor.value?.destroy()
})
</script>

<style scoped>
.toolbar-btn {
  @apply p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors text-xs font-medium;
}

.toolbar-btn.active {
  @apply bg-gradient-primary text-white;
}

.toolbar-btn:disabled {
  @apply opacity-30 cursor-not-allowed;
}

.editor-content {
  @apply min-h-[400px] max-h-[60vh] overflow-y-auto p-4;
}

.editor-content :deep(.ProseMirror) {
  @apply outline-none min-h-[380px];
}

.editor-content :deep(.ProseMirror p) {
  @apply my-2;
}

.editor-content :deep(.ProseMirror h1) {
  @apply text-2xl font-bold mt-6 mb-3;
}

.editor-content :deep(.ProseMirror h2) {
  @apply text-xl font-bold mt-5 mb-2;
}

.editor-content :deep(.ProseMirror h3) {
  @apply text-lg font-bold mt-4 mb-2;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  @apply pl-6 my-2;
}

.editor-content :deep(.ProseMirror ul) {
  @apply list-disc;
}

.editor-content :deep(.ProseMirror ol) {
  @apply list-decimal;
}

.editor-content :deep(.ProseMirror blockquote) {
  @apply border-l-4 border-gradient-start/50 pl-4 my-4 text-gray-600 dark:text-gray-400 italic;
}

.editor-content :deep(.ProseMirror code) {
  @apply bg-gray-200/50 dark:bg-gray-700/50 px-1.5 py-0.5 rounded text-sm font-mono;
}

.editor-content :deep(.ProseMirror pre) {
  @apply bg-gray-900 text-gray-100 p-4 rounded-xl my-4 overflow-x-auto;
}

.editor-content :deep(.ProseMirror pre code) {
  @apply bg-transparent p-0;
}

.editor-content :deep(.ProseMirror hr) {
  @apply border-t border-gray-300 dark:border-gray-600 my-6;
}

.editor-content :deep(.ProseMirror img) {
  @apply max-w-full h-auto rounded-xl my-4;
}

.editor-content :deep(.ProseMirror a) {
  @apply text-gradient-start underline;
}

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  @apply text-gray-400 dark:text-gray-500 float-left h-0 pointer-events-none;
  content: attr(data-placeholder);
}
</style>
</template>
<parameter name="Complexity">7
