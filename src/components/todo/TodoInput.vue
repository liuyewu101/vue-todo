<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
const emit = defineEmits<{
  add: [text: string]
}>()

function submit() {
  const value = text.value.trim()
  if (!value) return
  emit('add', value)
  text.value = ''
}
</script>

<template>
  <form class="todo-input" @submit.prevent="submit">
    <input
      v-model="text"
      type="text"
      placeholder="添加一个待办任务"
      aria-label="待办任务内容"
      maxlength="200"
    />
    <button type="submit" :disabled="!text.trim()">添加</button>
  </form>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font: inherit;
}

input:focus {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

button {
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  background: #42b883;
  color: #fff;
  font: inherit;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
