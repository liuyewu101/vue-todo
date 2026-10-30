<!-- src/components/todo/TagManager.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useTagStore } from '@/stores/tagStore'
import TagBadge from '@/components/ui/TagBadge.vue'

const tagStore = useTagStore()

// 新增标签
const newTagName = ref('')
const newTagColor = ref('#42b883')

const presetColors = [
  '#3b82f6', '#42b883', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
]

function handleAddTag() {
  const name = newTagName.value.trim()
  if (!name) return
  tagStore.addTag(name, newTagColor.value)
  newTagName.value = ''
}

function handleRemoveTag(id: string) {
  if (confirm('删除标签后，所有任务上的该标签也会被移除。确认删除？')) {
    tagStore.removeTag(id)
  }
}

// 编辑模式
const editingId = ref<string | null>(null)
const editName = ref('')
const editColor = ref('')

function startEdit(tag: { id: string; name: string; color: string }) {
  editingId.value = tag.id
  editName.value = tag.name
  editColor.value = tag.color
}

function saveEdit() {
  if (editingId.value) {
    tagStore.updateTag(editingId.value, {
      name: editName.value,
      color: editColor.value,
    })
    editingId.value = null
  }
}
</script>

<template>
  <div class="tag-manager">
    <h3>标签管理</h3>

    <!-- 现有标签列表 -->
    <div class="tag-list">
      <div v-for="tag in tagStore.tags" :key="tag.id" class="tag-item">
        <template v-if="editingId === tag.id">
          <input v-model="editName" class="edit-input" @keydown.enter="!$event.isComposing && saveEdit()" />
          <div class="color-picker">
            <button
              v-for="c in presetColors"
              :key="c"
              class="color-dot"
              :class="{ active: editColor === c }"
              :style="{ background: c }"
              @click="editColor = c"
            />
          </div>
          <button @click="saveEdit" class="btn-sm">保存</button>
        </template>
        <template v-else>
          <TagBadge :name="tag.name" :color="tag.color" />
          <div class="tag-actions">
            <button @click="startEdit(tag)" class="action-btn">✏️</button>
            <button @click="handleRemoveTag(tag.id)" class="action-btn danger">🗑️</button>
          </div>
        </template>
      </div>
    </div>

    <!-- 添加新标签 -->
    <div class="add-tag-form">
      <input
        v-model="newTagName"
        placeholder="新标签名称..."
        class="tag-input"
        @keydown.enter="!$event.isComposing && handleAddTag()"
      />
      <div class="color-picker">
        <button
          v-for="c in presetColors"
          :key="c"
          class="color-dot"
          :class="{ active: newTagColor === c }"
          :style="{ background: c }"
          @click="newTagColor = c"
        />
      </div>
      <button @click="handleAddTag" class="btn-primary" :disabled="!newTagName.trim()">
        添加
      </button>
    </div>
  </div>
</template>

<style scoped>
.tag-manager {
  padding: 16px;
  background: var(--bg-primary, #fff);
  border-radius: 12px;
  border: 1px solid var(--border-color, #e0e0e0);
}

.tag-manager h3 {
  margin: 0 0 16px;
  font-size: 1rem;
}

.tag-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
}

.tag-actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.5;
  transition: opacity 0.15s;
}

.action-btn:hover { opacity: 1; }
.action-btn.danger:hover { background: #fee; }

.add-tag-form {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-input, .edit-input {
  flex: 1;
  min-width: 120px;
  padding: 6px 12px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 6px;
  font-size: 0.85rem;
}

.color-picker {
  display: flex;
  gap: 4px;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}

.color-dot:hover { transform: scale(1.15); }
.color-dot.active { border-color: #333; transform: scale(1.2); }

.btn-primary {
  padding: 6px 16px;
  background: var(--accent, #42b883);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-sm {
  padding: 4px 12px;
  background: var(--accent, #42b883);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}
</style>