<!-- src/components/todo/TodoFilter.vue -->
<script setup lang="ts">
import type { FilterType } from '@/types/todo'

const filter = defineModel<FilterType>({ required: true })

defineProps<{
  totalCount: number
  activeCount: number
  doneCount: number
}>()

const emit = defineEmits<{
  clearDone: []
}>()

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '进行中' },
  { value: 'done', label: '已完成' },
]
</script>

<template>
  <div class="filter-bar">
    <div class="filter-buttons">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        :class="['filter-btn', { active: filter === opt.value }]"
        @click="filter = opt.value"
      >
        {{ opt.label }}
        <span class="count">
          {{ opt.value === 'all' ? totalCount : opt.value === 'active' ? activeCount : doneCount }}
        </span>
      </button>
    </div>

    <button v-if="doneCount > 0" @click="emit('clearDone')" class="clear-btn">
      清除已完成
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 4px;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 3px;
}

.filter-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  color: #666;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #fff;
  color: #42b883;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.count {
  margin-left: 4px;
  font-size: 0.75rem;
  opacity: 0.7;
}

.clear-btn {
  padding: 6px 12px;
  border: 1px solid #ff6b6b;
  border-radius: 6px;
  background: transparent;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #ff6b6b;
  color: #fff;
}
</style>