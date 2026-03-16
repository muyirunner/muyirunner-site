# Vue 3 Composition API 实战

Vue 3 带来了全新的 Composition API，让我们能以更灵活的方式组织组件逻辑。本文将分享我在实战中的使用经验。

## 为什么需要 Composition API？

### Options API 的局限

在 Vue 2 的 Options API 中，我们这样写组件：

```vue
<script>
export default {
  data() {
    return {
      count: 0,
      loading: false
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>
```

问题在于：
- ❌ 相关逻辑分散在不同的选项中
- ❌ 复用逻辑困难（需要 mixins）
- ❌ TypeScript 支持不够好

### Composition API 的优势

使用 Composition API 重写：

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 所有相关逻辑都在一起
const count = ref(0)
const loading = ref(false)

const doubleCount = computed(() => count.value * 2)

const increment = () => {
  count.value++
}

onMounted(() => {
  fetchData()
})
</script>
```

优势：
- ✅ 逻辑组织更清晰
- ✅ 更好的代码复用
- ✅ 完美的 TypeScript 支持
- ✅ 更小的打包体积

## 实战案例

### 1. 自定义 Hooks

将可复用的逻辑提取为 Hooks：

```typescript
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

在组件中使用：

```vue
<script setup lang="ts">
import { useMouse } from '@/composables/useMouse'

const { x, y } = useMouse()
</script>

<template>
  <div>鼠标位置：{{ x }}, {{ y }}</div>
</template>
```

### 2. 异步数据获取

封装一个通用的数据获取 Hook：

```typescript
// composables/useFetch.ts
import { ref, Ref } from 'vue'

export function useFetch<T>(url: string) {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
```

使用示例：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'

interface Post {
  id: number
  title: string
  content: string
}

const { data: posts, loading, error, execute } = useFetch<Post[]>('/api/posts')

onMounted(() => execute())
</script>

<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <div v-else>
      <div v-for="post in posts" :key="post.id">
        {{ post.title }}
      </div>
    </div>
  </div>
</template>
```

### 3. 表单处理

创建一个表单验证 Hook：

```typescript
// composables/useForm.ts
import { ref, reactive, computed } from 'vue'

interface FormRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  rules: Record<keyof T, FormRule>
) {
  const values = reactive({ ...initialValues })
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  const touched = reactive<Partial<Record<keyof T, boolean>>>({})

  const validate = (field: keyof T) => {
    const rule = rules[field]
    const value = values[field]

    if (rule.required && !value) {
      errors[field] = '此字段必填'
      return false
    }

    if (rule.min && value.length < rule.min) {
      errors[field] = `最少 ${rule.min} 个字符`
      return false
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = '格式不正确'
      return false
    }

    delete errors[field]
    return true
  }

  const validateAll = () => {
    return Object.keys(rules).every(field => validate(field as keyof T))
  }

  const handleBlur = (field: keyof T) => {
    touched[field] = true
    validate(field)
  }

  const isValid = computed(() => Object.keys(errors).length === 0)

  return {
    values,
    errors,
    touched,
    isValid,
    validate,
    validateAll,
    handleBlur
  }
}
```

使用示例：

```vue
<script setup lang="ts">
import { useForm } from '@/composables/useForm'

const { values, errors, touched, isValid, handleBlur, validateAll } = useForm(
  {
    email: '',
    password: ''
  },
  {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      min: 6
    }
  }
)

const handleSubmit = () => {
  if (validateAll()) {
    console.log('提交表单', values)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input
        v-model="values.email"
        @blur="handleBlur('email')"
        placeholder="邮箱"
      />
      <span v-if="touched.email && errors.email">{{ errors.email }}</span>
    </div>
    <div>
      <input
        v-model="values.password"
        type="password"
        @blur="handleBlur('password')"
        placeholder="密码"
      />
      <span v-if="touched.password && errors.password">{{ errors.password }}</span>
    </div>
    <button :disabled="!isValid">提交</button>
  </form>
</template>
```

## 最佳实践

### 1. 逻辑组织

将相关的状态和方法组织在一起：

```typescript
// ✅ 好的做法
function useUserProfile() {
  const user = ref(null)
  const loading = ref(false)

  const fetchUser = async () => {
    loading.value = true
    // ...
  }

  return { user, loading, fetchUser }
}

// ❌ 不好的做法
const user = ref(null)
const loading = ref(false)
// ... 其他不相关的代码
const fetchUser = async () => { /* ... */ }
```

### 2. 合理使用 ref 和 reactive

- 基本类型用 `ref`
- 对象/数组用 `reactive`

```typescript
// ✅ 推荐
const count = ref(0)
const user = reactive({ name: '', age: 0 })

// ❌ 不推荐
const count = reactive({ value: 0 }) // 多余的嵌套
const name = reactive('John') // reactive 不适合基本类型
```

### 3. 避免在 computed 中修改状态

```typescript
// ❌ 错误
const doubleCount = computed(() => {
  count.value++ // 副作用！
  return count.value * 2
})

// ✅ 正确
const doubleCount = computed(() => count.value * 2)
```

## 总结

Composition API 是 Vue 3 最重要的特性之一，它让我们能够：

1. **更好地组织代码** - 相关逻辑放在一起
2. **更容易复用** - 通过自定义 Hooks
3. **更好的类型推导** - TypeScript 支持更完善
4. **更灵活** - 不受选项式 API 的限制

掌握 Composition API，你的 Vue 3 开发效率将大大提升！

---

**相关资源**：
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [VueUse](https://vueuse.org/) - 优秀的 Composition 工具库
