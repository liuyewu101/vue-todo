<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app">
    <nav class="app-nav">
      <RouterLink to="/" class="nav-link">📋 任务</RouterLink>
      <RouterLink to="/stats" class="nav-link">📊 统计</RouterLink>
      <RouterLink to="/kanban" class="nav-link">📌 看板</RouterLink>
      <RouterLink to="/settings" class="nav-link">⚙️ 设置</RouterLink>
    </nav>

    <!-- 路由出口：匹配的组件渲染在这里 -->
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
