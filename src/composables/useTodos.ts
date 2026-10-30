// src/composables/useTodos.ts
import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { createTodoId, isTodoList, isFilterType, migrateTodoList, type Todo, type FilterType } from '@/types/todo'

export function useTodos() {
  const todos = useLocalStorage<Todo[]>('vue-todo-list', [], isTodoList, migrateTodoList)
  const filter = useLocalStorage<FilterType>('vue-todo-filter', 'all', isFilterType)

  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active': return todos.value.filter(t => !t.done)
      case 'done': return todos.value.filter(t => t.done)
      default: return todos.value
    }
  })

  const stats = computed(() => {
    const total = todos.value.length
    const doneCount = todos.value.filter(t => t.done).length
    return {
      total,
      doneCount,
      activeCount: total - doneCount,
      donePercent: total > 0 ? Math.round((doneCount / total) * 100) : 0,
    }
  })

  function addTodo(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    todos.value.push({
      id: createTodoId(todos.value),
      text: trimmed,
      done: false,
      priority: 'medium',
      createdAt: new Date().toISOString().slice(0, 10), // UTC 日期
      tags: [],
    })
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.done = !todo.done
  }

  function deleteTodo(id: number) {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  function updateTodo(id: number, text: string) {
    const todo = todos.value.find(t => t.id === id)
    if (todo && text.trim()) todo.text = text.trim()
  }

  function clearDone() {
    todos.value = todos.value.filter(t => !t.done)
  }

  return {
    todos,
    filter,
    filteredTodos,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearDone,
  }
}
