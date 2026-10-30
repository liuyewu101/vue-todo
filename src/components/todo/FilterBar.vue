<!-- src/components/todo/FilterBar.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useTagStore } from '@/stores/tagStore'
import { storeToRefs } from 'pinia'
import TagBadge from '@/components/ui/TagBadge.vue'

const taskStore = useTaskStore()
const tagStore = useTagStore()
const { selectedTags, selectedPriority, searchQuery, tagFilterMode, selectedCategory, filter } = storeToRefs(taskStore)

function toggleTag(tagId: string) {
  const idx = selectedTags.value.indexOf(tagId)
  if (idx > -1) selectedTags.value.splice(idx, 1)
  else selectedTags.value.push(tagId)
}

function clearFilters() {
  selectedTags.value = []
  selectedPriority.value = 'all'
  searchQuery.value = ''
  selectedCategory.value = null
  filter.value = 'all'
  tagFilterMode.value = 'and'
}

const hasActiveFilter = computed(() =>
  selectedTags.value.length > 0 ||
  selectedPriority.value !== 'all' ||
  searchQuery.value !== '' || selectedCategory.value !== null || filter.value !== 'all'
)
</script>

<template>
  <div class="filter-bar">
    <!-- 搜索 -->
    <input
      v-model="searchQuery"
      placeholder="🔍 搜索任务..."
      class="search-input"
    />

    <!-- 优先级 -->
    <div class="filter-group">
      <label>优先级</label>
      <select v-model="selectedPriority" class="priority-select">
        <option value="all">全部</option>
        <option value="high">🔴 高</option>
        <option value="medium">🟡 中</option>
        <option value="low">🟢 低</option>
      </select>
    </div>

    <!-- 标签筛选 -->
    <div class="filter-group">
      <div class="tag-filter-header">
        <label>标签</label>
        <button
          class="mode-toggle"
          @click="tagFilterMode = tagFilterMode === 'and' ? 'or' : 'and'"
        >
          {{ tagFilterMode === 'and' ? 'AND' : 'OR' }}
        </button>
      </div>
      <div class="tag-filter-list">
        <TagBadge
          v-for="tag in tagStore.tags"
          :key="tag.id"
          :name="tag.name"
          :color="tag.color"
          :selected="selectedTags.includes(tag.id)"
          interactive
          size="sm"
          style="cursor: pointer"
          @click="toggleTag(tag.id)"
        />
      </div>
    </div>

    <!-- 清除筛选 -->
    <button
      v-if="hasActiveFilter"
      @click="clearFilters"
      class="clear-btn"
    >
      ✕ 清除筛选
    </button>
  </div>
</template>