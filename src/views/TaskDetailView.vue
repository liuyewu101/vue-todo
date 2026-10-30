<!-- src/views/TaskDetailView.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useTodos } from '@/composables/useTodos'

const props = defineProps<{ id: string }>()
const { todos } = useTodos()
const todo = computed(() => todos.value.find(item => item.id === Number(props.id)))
</script>

<template>
  <section v-if="todo">
    <h1>{{ todo.text }}</h1>
    <p>{{ todo.done ? '已完成' : '进行中' }} · {{ todo.priority }}</p>
    <p>创建于 {{ todo.createdAt }}</p>
  </section>
  <p v-else>任务不存在</p>
</template>