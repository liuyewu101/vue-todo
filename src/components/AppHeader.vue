<!-- src/components/AppHeader.vue -->
<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <header class="app-header"><h1>{{ title }}</h1></header>
</template>

<style scoped>
.app-header { text-align: center; margin-bottom: 2rem; }
h1 { color: #42b883; font-size: 2rem; }
</style>