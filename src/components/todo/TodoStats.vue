<!-- src/components/todo/TodoStats.vue -->
<script setup lang="ts">
defineProps<{
  total: number
  doneCount: number
  activeCount: number
  donePercent: number
}>()
</script>

<template>
  <div class="stats-panel">
    <div class="stat">
      <span class="stat-value">{{ total }}</span>
      <span class="stat-label">总计</span>
    </div>
    <div class="stat">
      <span class="stat-value">{{ activeCount }}</span>
      <span class="stat-label">进行中</span>
    </div>
    <div class="stat">
      <span class="stat-value">{{ doneCount }}</span>
      <span class="stat-label">已完成</span>
    </div>
    <div class="stat">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: donePercent + '%' }"></div>
      </div>
      <span class="stat-label">{{ donePercent }}%</span>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.75rem;
  color: #999;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: #42b883;
  border-radius: 3px;
  transition: width 0.3s ease;
}
</style>