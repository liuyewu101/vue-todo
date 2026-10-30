// src/composables/useLocalStorage.ts
import { ref, watch, type Ref } from 'vue'

/** 适用于本课的 JSON 数据；在组件 setup 中同步调用。 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  isValid: (value: unknown) => value is T,
  migrate?: (value: unknown) => unknown,
): Ref<T> {
  // 调用者传入普通、可 JSON 序列化的默认值；复制以免共享默认对象
  let initialValue: T = JSON.parse(JSON.stringify(defaultValue))

  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      const parsed: unknown = migrate ? migrate(JSON.parse(stored)) : JSON.parse(stored)
      if (!isValid(parsed)) throw new Error(`无效的存储数据: ${key}`)
      initialValue = parsed
    }
  } catch (error) {
    console.error(`读取 ${key} 失败，使用默认值`, error)
  }

  // T 限定为本课的普通 JSON 数据，不包含嵌套 ref
  const data = ref(initialValue) as Ref<T>
  watch(data, (newValue) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.error(`保存 ${key} 失败，修改仅保留在内存中`, error)
    }
  }, { deep: true })

  return data
}
