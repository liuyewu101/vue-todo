<script setup lang="ts">
defineProps<{
  name: string
  color: string
  selected?: boolean
  interactive?: boolean
  size?: 'sm'
}>()
</script>

<template>
  <button
    v-if="interactive"
    type="button"
    class="tag-badge"
    :class="{ selected, small: size === 'sm' }"
    :style="{ '--tag-color': color }"
    :aria-pressed="selected"
  >{{ name }}</button>
  <span v-else class="tag-badge" :class="{ small: size === 'sm' }" :style="{ '--tag-color': color }">{{ name }}</span>
</template>

<style scoped>
.tag-badge {
  display: inline-block;
  padding: 3px 9px;
  border: 1px solid var(--tag-color);
  border-radius: 999px;
  background: white;
  color: var(--tag-color);
  font: inherit;
  font-size: 0.8rem;
}
button.tag-badge { cursor: pointer; }
.tag-badge.selected { background: var(--tag-color); color: white; }
.tag-badge.small { font-size: 0.7rem; }
</style>
