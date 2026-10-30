<!-- src/components/todo/TagSelector.vue -->
<script setup lang="ts">
import { useTagStore } from '@/stores/tagStore'
import TagBadge from '@/components/ui/TagBadge.vue'

const tagStore = useTagStore()
const selectedTags = defineModel<string[]>({ required: true })

function toggleTag(tagId: string) {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value = selectedTags.value.filter(id => id !== tagId)
  } else {
    selectedTags.value = [...selectedTags.value, tagId]
  }
}

function isSelected(tagId: string) {
  return selectedTags.value.includes(tagId)
}
</script>

<template>
  <div class="tag-selector">
    <label class="selector-label">标签</label>
    <div class="tag-list">
      <TagBadge
        v-for="tag in tagStore.tags"
        :key="tag.id"
        :name="tag.name"
        :color="tag.color"
        :selected="isSelected(tag.id)"
        interactive
        style="cursor: pointer"
        @click="toggleTag(tag.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.tag-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selector-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #888);
  font-weight: 500;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>