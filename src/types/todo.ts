// src/types/todo.ts
export interface Todo {
  id: number
  text: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  categoryId?: string
  tags: string[]
  dueDate?: string
}

// src/types/todo.ts，追加在已有 Todo 接口后
export function isTodoList(value: unknown): value is Todo[] {
  if (!Array.isArray(value)) return false
  const ids = new Set<number>()
  return value.every((item: unknown) => {
    if (typeof item !== 'object' || item === null) return false
    const todo = item as Record<string, unknown>
    if (
      typeof todo.id !== 'number' || !Number.isSafeInteger(todo.id) || todo.id < 1 ||
      typeof todo.text !== 'string' || !todo.text.trim() ||
      typeof todo.done !== 'boolean' ||
      (todo.priority !== 'low' && todo.priority !== 'medium' && todo.priority !== 'high') ||
      typeof todo.createdAt !== 'string' ||
      !Array.isArray(todo.tags) || !todo.tags.every((tag: unknown) => typeof tag === 'string') ||
      (todo.categoryId !== undefined && typeof todo.categoryId !== 'string') ||
      ids.has(todo.id)
    ) return false
    ids.add(todo.id)
    return true
  })
}

// 通常取现有最大 ID + 1；到达安全整数上限时复用未占用的正整数
export function createTodoId(todos: readonly Todo[]): number {
  const highest = todos.reduce((max, todo) => Math.max(max, todo.id), 0)
  if (highest < Number.MAX_SAFE_INTEGER) return highest + 1
  const used = new Set(todos.map(todo => todo.id))
  let id = 1
  while (used.has(id)) id++
  return id
}

export type FilterType = 'all' | 'active' | 'done'


export interface Tag {
  id: string
  name: string
  color: string  // 如 '#42b883'
}

export interface Category {
  id: string
  name: string
  icon: string   // emoji
  order: number  // 排序
}

export function migrateTodoList(value: unknown): Todo[] {
  if (!Array.isArray(value)) return []
  const migrated = value.map((item: unknown) => {
    if (typeof item !== 'object' || item === null) return item
    const todo = item as Record<string, unknown>
    return { ...todo, tags: todo.tags === undefined ? [] : todo.tags }
  })
  return isTodoList(migrated) ? migrated : []
}



export function isFilterType(value: unknown): value is FilterType {
  return value === 'all' || value === 'active' || value === 'done'
}
