<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/AppHeader.vue'
import TodoInput from '@/components/todo/TodoInput.vue'
import TodoFilter from '@/components/todo/TodoFilter.vue'
import TodoStats from '@/components/todo/TodoStats.vue'
import TodoItem from '@/components/todo/TodoItem.vue'
import CategorySidebar from '@/components/todo/CategorySidebar.vue'
import FilterBar from '@/components/todo/FilterBar.vue'
import TagSelector from '@/components/todo/TagSelector.vue'
import { useTaskStore } from '@/stores/taskStore'
import { useTagStore } from '@/stores/tagStore'

const taskStore = useTaskStore()
const tagStore = useTagStore()
const { filteredTodos, filter, stats } = storeToRefs(taskStore)
const { addTodo, toggleTodo, deleteTodo, updateTodo, clearDone } = taskStore

function updateCategory(id: number, event: Event) {
  taskStore.updateTodoMeta(id, { categoryId: (event.target as HTMLSelectElement).value || undefined })
}

function updatePriority(id: number, event: Event) {
  taskStore.updateTodoMeta(id, { priority: (event.target as HTMLSelectElement).value as 'low' | 'medium' | 'high' })
}
</script>

<template>
  <div class="app">
    <AppHeader title="📝 Vue Todo" />

    <TodoInput @add="addTodo" />
    <TodoStats v-bind="stats" />
    <TodoFilter
      v-model="filter"
      :total-count="stats.total"
      :active-count="stats.activeCount"
      :done-count="stats.doneCount"
      @clear-done="clearDone"
    />

    <main class="workspace">
      <CategorySidebar />
      <div class="task-panel">
      <FilterBar />
      <p v-if="filteredTodos.length === 0" class="empty">📭 没有匹配的任务</p>

      <TransitionGroup name="list" tag="div" class="todo-list">
        <div v-for="todo in filteredTodos" :key="todo.id" class="task-row">
          <TodoItem v-bind="todo" @toggle="toggleTodo" @delete="deleteTodo" @update="updateTodo" />
          <div class="task-meta">
            <TagSelector :model-value="todo.tags" @update:model-value="taskStore.updateTodoMeta(todo.id, { tags: $event })" />
            <select :value="todo.categoryId ?? ''" aria-label="任务分类" @change="updateCategory(todo.id, $event)">
              <option value="">未分类</option>
              <option v-for="category in tagStore.sortedCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
            <select :value="todo.priority" aria-label="任务优先级" @change="updatePriority(todo.id, $event)">
              <option value="low">低</option><option value="medium">中</option><option value="high">高</option>
            </select>
          </div>
        </div>
      </TransitionGroup>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: #999;
  background: #f8f9fa;
  border-radius: 12px;
}

.todo-list { position: relative; }
.workspace { display: flex; gap: 20px; align-items: flex-start; }
.workspace :deep(.sidebar) { flex: 0 0 220px; }
.task-panel { flex: 1; min-width: 0; }
.task-row { margin-bottom: 12px; }
.task-meta { display: flex; flex-wrap: wrap; align-items: end; gap: 12px; padding: 0 8px 8px; }
.task-meta select { padding: 5px; border: 1px solid #ddd; border-radius: 6px; }
@media (max-width: 700px) {
  .workspace { flex-direction: column; }
  .workspace :deep(.sidebar) { width: 100%; border-right: 0; border-bottom: 1px solid #ddd; }
  .task-panel { width: 100%; }
}
.list-enter-active,
.list-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateX(-30px); }
.list-leave-to { opacity: 0; transform: translateX(30px); }
.list-leave-active { position: absolute; width: 100%; }
.list-move { transition: transform 0.3s ease; }
</style>
