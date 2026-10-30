<!-- src/components/TodoItem.vue（新增编辑功能） -->
<script setup lang="ts">
import { nextTick, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    id: number
    text: string
    done?: boolean
    priority?: 'low' | 'medium' | 'high'
    createdAt?: string
  }>(),
  { done: false, priority: 'medium' }
)

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  update: [id: number, text: string]
}>()

// 编辑状态
const isEditing = ref(false)
const editText = ref('')
const editInput = ref<HTMLInputElement | null>(null)

async function startEdit() {
  if (props.done) return  // 本例不允许编辑已完成项
  editText.value = props.text
  isEditing.value = true
  await nextTick() // 等 v-if 创建输入框后再聚焦
  editInput.value?.focus()
  editInput.value?.select()
}

function saveEdit() {
  if (!isEditing.value) return // Enter 或 Esc 关闭后，忽略随后的 blur
  isEditing.value = false
  const text = editText.value.trim()
  if (text && text !== props.text) {
    emit('update', props.id, text)
  }
}

function cancelEdit() {
  isEditing.value = false
}

function handleEditKeydown(event: KeyboardEvent) {
  if (event.isComposing) return // 不把输入法确认键当作提交
  if (event.key === 'Enter') {
    event.preventDefault()
    saveEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div class="todo-item" :class="{ 'is-done': done, 'is-editing': isEditing, [`priority-${priority}`]: true }">
    <button type="button" class="toggle-btn" :aria-label="done ? '标记为未完成' : '标记为已完成'" :aria-pressed="done" @click="emit('toggle', id)">
      {{ done ? '✅' : '⬜' }}
    </button>

    <div class="todo-content">
      <!-- 编辑模式 -->
      <input
        v-if="isEditing"
        v-model.trim="editText"
        @keydown="handleEditKeydown"
        @blur="saveEdit"
        class="edit-input"
        ref="editInput"
      />

      <!-- 展示模式 -->
      <span
        v-else
        class="todo-text"
        @dblclick="startEdit"
      >
        {{ text }}
      </span>

      <span v-if="createdAt && !isEditing" class="todo-date">{{ createdAt }}</span>
    </div>

    <span v-if="!isEditing" class="priority-badge">{{ priority }}</span>
    <button v-if="!done && !isEditing" type="button" class="edit-btn" @click="startEdit">编辑</button>
    <button v-if="!isEditing" type="button" class="delete-btn" aria-label="删除任务" @click="emit('delete', id)">🗑️</button>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.todo-item.is-editing {
  border-color: #42b883;
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.15);
}

.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.todo-item.is-done {
  opacity: 0.55;
  background: #fafafa;
}

.todo-item.is-done .todo-text {
  text-decoration: line-through;
  color: #999;
}

.toggle-btn,
.edit-btn,
.delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.toggle-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
  background: #f0f0f0;
}

.delete-btn {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.todo-item:hover .delete-btn,
.todo-item:focus-within .delete-btn {
  opacity: 1;
}

.todo-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.todo-text {
  font-size: 1rem;
  color: #2c3e50;
  cursor: default;
}

.todo-text:hover {
  cursor: text;
}

.edit-input {
  font-size: 1rem;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  width: 100%;
}

.edit-input:focus {
  border-color: #42b883;
}

.todo-date {
  font-size: 0.75rem;
  color: #aaa;
  margin-top: 2px;
}

.priority-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: uppercase;
  font-weight: 600;
}

.priority-low .priority-badge { background: #e8f5e9; color: #4caf50; }
.priority-medium .priority-badge { background: #fff3e0; color: #ff9800; }
.priority-high .priority-badge { background: #ffebee; color: #f44336; }
</style>