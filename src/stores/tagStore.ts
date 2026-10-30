// src/stores/tagStore.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Tag, Category } from '@/types/todo'
import { useTaskStore } from './taskStore'

export const useTagStore = defineStore('tags', () => {
  // ─── 标签 ───
  const tags = ref<Tag[]>([
    { id: 'work', name: '工作', color: '#3b82f6' },
    { id: 'study', name: '学习', color: '#42b883' },
    { id: 'life', name: '生活', color: '#f59e0b' },
    { id: 'urgent', name: '紧急', color: '#ef4444' },
  ])

  function addTag(name: string, color: string) {
    name = name.trim()
    if (!name || !/^#[0-9a-f]{6}$/i.test(color)) return
    const id = `tag-${crypto.randomUUID()}`
    tags.value.push({ id, name, color })
    return id
  }

  function updateTag(id: string, updates: Partial<Omit<Tag, 'id'>>) {
    const tag = tags.value.find(t => t.id === id)
    if (tag) {
      if (updates.name?.trim()) tag.name = updates.name.trim()
      if (updates.color && /^#[0-9a-f]{6}$/i.test(updates.color)) tag.color = updates.color
    }
  }

  function removeTag(id: string) {
    tags.value = tags.value.filter(t => t.id !== id)
    const taskStore = useTaskStore()
    for (const todo of taskStore.todos) todo.tags = todo.tags.filter(tag => tag !== id)
    taskStore.selectedTags = taskStore.selectedTags.filter(tag => tag !== id)
  }

  function getTagById(id: string) {
    return tags.value.find(t => t.id === id)
  }

  // ─── 分类 ───
  const categories = ref<Category[]>([
    { id: 'inbox', name: '收件箱', icon: '📥', order: 0 },
    { id: 'project', name: '项目', icon: '📁', order: 1 },
    { id: 'someday', name: '将来/也许', icon: '💭', order: 2 },
  ])

  function addCategory(name: string, icon: string) {
    name = name.trim()
    if (!name) return
    const id = `cat-${crypto.randomUUID()}`
    categories.value.push({
      id, name, icon,
      order: categories.value.reduce((max, category) => Math.max(max, category.order), -1) + 1,
    })
    return id
  }

  function removeCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id)
    const taskStore = useTaskStore()
    for (const todo of taskStore.todos) {
      if (todo.categoryId === id) delete todo.categoryId
    }
    if (taskStore.selectedCategory === id) taskStore.selectedCategory = null
  }

  const sortedCategories = computed(() =>
    [...categories.value].sort((a, b) => a.order - b.order)
  )

  return {
    tags, addTag, updateTag, removeTag, getTagById,
    categories, sortedCategories, addCategory, removeCategory,
  }
}, { persist: { key: 'vue-tag-store', pick: ['tags', 'categories'] } })