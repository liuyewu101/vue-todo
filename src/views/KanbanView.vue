<!-- src/views/KanbanView.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useTagStore } from '@/stores/tagStore'
import type { Todo } from '@/types/todo'
import TodoInput from '@/components/todo/TodoInput.vue'

const taskStore = useTaskStore()
const tagStore = useTagStore()

// 看板列定义
interface KanbanColumn {
  id: string
  title: string
  emoji: string
  color: string
  items: Todo[]
}

const columns = computed<KanbanColumn[]>(() => [
  ...tagStore.sortedCategories.map(category => ({
    id: category.id,
    title: category.name,
    emoji: category.icon,
    color: '#42b883',
    items: taskStore.todos.filter(todo => todo.categoryId === category.id),
  })),
  {
    id: 'uncategorized', title: '未分类', emoji: '📋', color: '#888888',
    items: taskStore.todos.filter(todo => !todo.categoryId),
  },
])

const draggedId = ref<number | null>(null)
const activeColumn = ref<string | null>(null)

function startDrag(event: DragEvent, id: number, columnId: string) {
  draggedId.value = id
  activeColumn.value = columnId
  event.dataTransfer?.setData('text/plain', String(id))
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDrop(event: DragEvent, columnId: string, beforeId?: number) {
  const id = Number(event.dataTransfer?.getData('text/plain') || draggedId.value)
  if (!Number.isSafeInteger(id) || id < 1) return
  taskStore.moveTodo(id, columnId === 'uncategorized' ? undefined : columnId, beforeId)
  draggedId.value = null
  activeColumn.value = null
}
</script>

<template>
  <div class="kanban-page">
    <header class="kanban-header">
      <h1>📌 看板视图</h1>
      <p class="kanban-subtitle">拖拽任务卡片更改分类，或在同一列内排序</p>
    </header>

    <TodoInput @add="taskStore.addTodo" />

    <div class="kanban-board">
      <div
        v-for="column in columns"
        :key="column.id"
        class="kanban-column"
        :class="{ 'is-active': activeColumn === column.id }"
        :style="{ '--column-color': column.color }"
      >
        <!-- 列头 -->
        <div class="column-header">
          <span class="column-title">
            {{ column.emoji }} {{ column.title }}
          </span>
          <span class="column-count">{{ column.items.length }}</span>
        </div>

        <!-- 可拖拽列表 -->
        <div class="kanban-list" @dragover.prevent @drop.prevent="onDrop($event, column.id)">
            <div
              v-for="element in column.items"
              :key="element.id"
              class="kanban-card"
              :class="{ 'is-done': element.done }"
              draggable="true"
              @dragstart="startDrag($event, element.id, column.id)"
              @dragend="draggedId = null; activeColumn = null"
              @dragover.prevent
              @drop.stop.prevent="onDrop($event, column.id, element.id)"
            >
              <div class="card-header">
                <span class="card-title">{{ element.text }}</span>
                <span class="priority-badge" :class="element.priority">
                  {{ element.priority }}
                </span>
              </div>
              <div class="card-meta">
                <span v-if="element.categoryId" class="card-category">
                  📁 {{ tagStore.categories.find(category => category.id === element.categoryId)?.name ?? element.categoryId }}
                </span>
                <span v-if="element.tags?.length" class="card-tags">
                  <span v-for="tag in element.tags" :key="tag" class="tag">
                    {{ tagStore.getTagById(tag)?.name ?? tag }}
                  </span>
                </span>
              </div>
              <div class="card-footer">
                <button type="button" class="status-button" @click="taskStore.toggleTodo(element.id)">
                  {{ element.done ? '恢复' : '完成' }}
                </button>
                <select
                  :value="element.categoryId ?? ''"
                  :aria-label="`移动任务 ${element.text} 到分类`"
                  @change="taskStore.updateTodoMeta(element.id, { categoryId: ($event.target as HTMLSelectElement).value || undefined })"
                >
                  <option value="">未分类</option>
                  <option v-for="category in tagStore.sortedCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
                <span class="card-date">
                  {{ element.createdAt }}
                </span>
              </div>
            </div>
            <div v-if="column.items.length === 0" class="column-empty">
              <p>拖拽任务到这里</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-page {
  padding: 24px;
}

.kanban-header {
  margin-bottom: 24px;
}

.kanban-header h1 {
  font-size: 1.5rem;
  margin: 0 0 4px 0;
}

.kanban-subtitle {
  color: #888;
  font-size: 0.875rem;
  margin: 0;
}

/* ─── 看板容器 ─── */
.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  align-items: start;
}

/* ─── 列 ─── */
.kanban-column {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  min-height: 300px;
  border: 2px solid transparent;
  transition: border-color 0.2s, background 0.2s;
}

.kanban-column.is-active {
  border-color: var(--column-color);
  background: color-mix(in srgb, var(--column-color) 5%, #f8f9fa);
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--column-color, #e0e0e0);
}

.column-title {
  font-weight: 600;
  font-size: 1rem;
}

.column-count {
  background: var(--column-color, #e0e0e0);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 12px;
  min-width: 24px;
  text-align: center;
}

/* ─── 拖拽列表 ─── */
.kanban-list {
  min-height: 100px;
}

/* ─── 卡片 ─── */
.kanban-card {
  background: #fff;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  cursor: grab;
  transition: box-shadow 0.2s, transform 0.15s;
  border-left: 3px solid transparent;
}

.kanban-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.kanban-card:active {
  cursor: grabbing;
}

.kanban-card.is-done {
  opacity: 0.65;
}

.kanban-card.is-done .card-title {
  text-decoration: line-through;
}

/* ─── 卡片内部 ─── */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.card-title {
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.4;
  flex: 1;
}

.priority-badge {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 8px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.priority-badge.high { background: #fee2e2; color: #dc2626; }
.priority-badge.medium { background: #fef3c7; color: #d97706; }
.priority-badge.low { background: #d1fae5; color: #059669; }

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.card-category {
  font-size: 0.75rem;
  color: #666;
}

.card-tags {
  display: flex;
  gap: 4px;
}

.tag {
  font-size: 0.65rem;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 1px 6px;
  border-radius: 4px;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-footer button, .card-footer select {
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  padding: 3px 6px;
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}

.card-footer .card-date { margin-left: auto; }

.card-date {
  font-size: 0.7rem;
  color: #aaa;
}

/* ─── Ghost（占位） ─── */
.kanban-ghost {
  opacity: 0.3;
  background: #42b88320;
  border: 2px dashed #42b883;
  border-radius: 10px;
}

.kanban-ghost > * {
  visibility: hidden;
}

/* ─── 空列提示 ─── */
.column-empty {
  text-align: center;
  padding: 32px 16px;
  color: #bbb;
  font-size: 0.85rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
}
</style>
