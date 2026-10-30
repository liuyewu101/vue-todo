<!-- TodoList.vue -->
<script setup lang="ts">
import type { Todo } from '@/types/todo'

defineProps<{
  todos: Todo[]
}>()
</script>

<template>
  <div class="todo-list">
    <div v-for="(todo, index) in todos" :key="todo.id">
      <!-- 作用域插槽：把 todo 数据暴露给父组件 -->
      <slot name="item" :todo="todo" :index="index" />
    </div>
  </div>
</template>