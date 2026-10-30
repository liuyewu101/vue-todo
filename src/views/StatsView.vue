<!-- src/views/StatsView.vue -->
<script setup lang="ts">
import TodoStats from '@/components/todo/TodoStats.vue'
import { useTodos } from '@/composables/useTodos'
const { stats } = useTodos()
</script>

<template><section><h1>任务统计</h1><TodoStats v-bind="stats" /></section></template>