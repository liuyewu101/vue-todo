<!-- src/components/todo/CategorySidebar.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useTagStore } from '@/stores/tagStore'
import { useTaskStore } from '@/stores/taskStore'
import { storeToRefs } from 'pinia'

const tagStore = useTagStore()
const taskStore = useTaskStore()
const { selectedCategory } = storeToRefs(taskStore)

// 计算每个分类的任务数量
const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const cat of tagStore.categories) {
    counts[cat.id] = taskStore.todos.filter(t => t.categoryId === cat.id).length
  }
  // 未分类
  counts['uncategorized'] = taskStore.todos.filter(t => !t.categoryId).length
  return counts
})
</script>

<template>
  <aside class="sidebar">
    <h3 class="sidebar-title">分类</h3>
    <ul class="category-list">
      <!-- 全部 -->
      <li
        class="category-item"
        :class="{ active: !selectedCategory }"
        @click="selectedCategory = null"
      >
        <span class="cat-icon">📋</span>
        <span class="cat-name">全部</span>
        <span class="cat-count">{{ taskStore.todos.length }}</span>
      </li>

      <li class="category-item" :class="{ active: selectedCategory === 'uncategorized' }" @click="selectedCategory = 'uncategorized'">
        <span class="cat-name">未分类</span><span class="cat-count">{{ categoryCounts.uncategorized }}</span>
      </li>

      <!-- 各分类 -->
      <li
        v-for="cat in tagStore.sortedCategories"
        :key="cat.id"
        class="category-item"
        :class="{ active: selectedCategory === cat.id }"
        @click="selectedCategory = cat.id"
      >
        <span class="cat-icon">{{ cat.icon }}</span>
        <span class="cat-name">{{ cat.name }}</span>
        <span class="cat-count">{{ categoryCounts[cat.id] || 0 }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  padding: 16px;
  border-right: 1px solid var(--border-color, #e0e0e0);
}

.sidebar-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted, #999);
  margin: 0 0 12px;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 2px;
}

.category-item:hover {
  background: var(--bg-tertiary, #f0f0f0);
}

.category-item.active {
  background: var(--accent, #42b883);
  color: white;
}

.category-item.active .cat-count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.cat-icon { font-size: 1rem; }
.cat-name { flex: 1; font-size: 0.9rem; }

.cat-count {
  font-size: 0.7rem;
  background: var(--bg-tertiary, #e0e0e0);
  padding: 1px 8px;
  border-radius: 10px;
  font-weight: 600;
}
</style>