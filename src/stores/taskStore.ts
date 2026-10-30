import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useTodos } from '@/composables/useTodos'
import type { Todo } from '@/types/todo'

export const useTaskStore = defineStore('tasks', () => {
  const { todos, filter, stats, addTodo, toggleTodo, deleteTodo, updateTodo, clearDone } = useTodos()
  const selectedCategory = ref<string | null>(null)
  const selectedTags = ref<string[]>([])
  const selectedPriority = ref<'all' | Todo['priority']>('all')
  const searchQuery = ref('')
  const tagFilterMode = ref<'and' | 'or'>('and')

  const filteredTodos = computed(() => todos.value.filter(todo => {
    if (filter.value === 'active' && todo.done) return false
    if (filter.value === 'done' && !todo.done) return false
    if (selectedCategory.value === 'uncategorized' && todo.categoryId) return false
    if (selectedCategory.value && selectedCategory.value !== 'uncategorized' && todo.categoryId !== selectedCategory.value) return false
    if (selectedPriority.value !== 'all' && todo.priority !== selectedPriority.value) return false
    if (searchQuery.value && !todo.text.toLocaleLowerCase().includes(searchQuery.value.trim().toLocaleLowerCase())) return false
    if (selectedTags.value.length) {
      const matches = selectedTags.value.map(tag => todo.tags.includes(tag))
      if (tagFilterMode.value === 'and' ? !matches.every(Boolean) : !matches.some(Boolean)) return false
    }
    return true
  }))

  function updateTodoMeta(id: number, updates: Partial<Pick<Todo, 'tags' | 'categoryId' | 'priority'>>) {
    const todo = todos.value.find(item => item.id === id)
    if (!todo) return
    if (updates.tags !== undefined) todo.tags = updates.tags
    if ('categoryId' in updates) {
      if (updates.categoryId) todo.categoryId = updates.categoryId
      else delete todo.categoryId
    }
    if (updates.priority) todo.priority = updates.priority
  }

  function moveTodo(id: number, categoryId?: string, beforeId?: number) {
    const sourceIndex = todos.value.findIndex(todo => todo.id === id)
    if (sourceIndex < 0 || id === beforeId) return
    const [todo] = todos.value.splice(sourceIndex, 1)
    if (!todo) return
    if (categoryId) todo.categoryId = categoryId
    else delete todo.categoryId
    const beforeIndex = beforeId === undefined ? -1 : todos.value.findIndex(item => item.id === beforeId && item.categoryId === categoryId)
    if (beforeIndex >= 0) {
      todos.value.splice(beforeIndex, 0, todo)
      return
    }
    let lastIndex = -1
    for (let index = 0; index < todos.value.length; index++) {
      if (todos.value[index]?.categoryId === categoryId) lastIndex = index
    }
    todos.value.splice(lastIndex + 1, 0, todo)
  }

  function reorderTodos(ids: number[]) {
    const selected = new Set(ids)
    const ordered = ids.map(id => todos.value.find(todo => todo.id === id)).filter((todo): todo is Todo => todo !== undefined)
    let next = 0
    todos.value = todos.value.map(todo => selected.has(todo.id) ? ordered[next++] ?? todo : todo)
  }

  return {
    todos, filter, stats, filteredTodos, addTodo, toggleTodo, deleteTodo, updateTodo, clearDone,
    selectedCategory, selectedTags, selectedPriority, searchQuery, tagFilterMode, updateTodoMeta, moveTodo, reorderTodos,
  }
})
