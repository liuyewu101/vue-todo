<!-- src/components/todo/DraggableTodoList.vue -->
<script setup lang="ts">
import { useTaskStore } from '@/stores/taskStore'
import { useTagStore } from '@/stores/tagStore'
import TodoItem from './TodoItem.vue'
import TagSelector from './TagSelector.vue'
import { computed, ref } from 'vue'

const taskStore = useTaskStore()
const tagStore = useTagStore()

const sortableTodos = computed(() => taskStore.filteredTodos)

// 拖拽状态
const isDragging = ref(false)
const draggedId = ref<number | null>(null)

function startDrag(event: DragEvent, id: number) {
  draggedId.value = id
  isDragging.value = true
  event.dataTransfer?.setData('text/plain', String(id))
}

function dropBefore(event: DragEvent, beforeId: number) {
  const id = Number(event.dataTransfer?.getData('text/plain') || draggedId.value)
  if (!Number.isSafeInteger(id) || id === beforeId) return
  const ids = sortableTodos.value.map(todo => todo.id)
  const from = ids.indexOf(id)
  const target = ids.indexOf(beforeId)
  if (from < 0 || target < 0) return
  ids.splice(from, 1)
  ids.splice(ids.indexOf(beforeId), 0, id)
  taskStore.reorderTodos(ids)
}

// 顺序已由 computed setter 写回 Store，结束时只重置交互状态
function onDragEnd() {
  isDragging.value = false
  draggedId.value = null
}
</script>

<template>
  <div>
      <div
        v-for="element in sortableTodos"
        :key="element.id"
        class="todo-row"
        :class="{ dragging: isDragging && draggedId === element.id }"
        draggable="true"
        @dragstart="startDrag($event, element.id)"
        @dragover.prevent
        @drop.prevent="dropBefore($event, element.id)"
        @dragend="onDragEnd"
      >
        <TodoItem
          v-bind="element"
          @toggle="taskStore.toggleTodo"
          @delete="taskStore.deleteTodo"
          @update="taskStore.updateTodo"
        >
          <template #prefix>
            <span class="drag-handle" :title="'长按拖拽排序'">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="5" cy="3" r="1.5" />
                <circle cx="11" cy="3" r="1.5" />
                <circle cx="5" cy="8" r="1.5" />
                <circle cx="11" cy="8" r="1.5" />
                <circle cx="5" cy="13" r="1.5" />
                <circle cx="11" cy="13" r="1.5" />
              </svg>
            </span>
          </template>
        </TodoItem>
        <div class="todo-meta">
          <TagSelector
            :model-value="element.tags"
            @update:model-value="taskStore.updateTodoMeta(element.id, { tags: $event })"
          />
          <select
            :value="element.categoryId ?? ''"
            aria-label="任务分类"
            @change="taskStore.updateTodoMeta(element.id, { categoryId: ($event.target as HTMLSelectElement).value || undefined })"
          >
            <option value="">未分类</option>
            <option v-for="category in tagStore.sortedCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <select
            :value="element.priority"
            aria-label="任务优先级"
            @change="taskStore.updateTodoMeta(element.id, { priority: ($event.target as HTMLSelectElement).value as 'low' | 'medium' | 'high' })"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
      </div>
    <!-- 空状态 -->
      <div v-if="sortableTodos.length === 0" class="empty-state">
        <p>暂无任务</p>
      </div>
  </div>
</template>

<style scoped>
.todo-row { margin-bottom: 12px; }
.todo-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px 0; }

/* 拖拽手柄 */
.drag-handle {
  cursor: grab;
  color: #ccc;
  user-select: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}

.drag-handle:hover {
  color: #42b883;
  background: #42b88310;
}

.drag-handle:active {
  cursor: grabbing;
}

/* 拖拽时留在原位的占位 —— ghost */
.ghost {
  opacity: 0.3;
  background: #42b88320;
  border: 2px dashed #42b883;
  border-radius: 8px;
}

/* 被选中（按下但未开始拖拽）—— chosen */
.chosen {
  box-shadow: 0 4px 20px rgba(66, 184, 131, 0.3);
}

/* 正在拖拽的元素 —— dragging */
.dragging {
  opacity: 0.9;
  transform: rotate(2deg);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>
