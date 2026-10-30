<!-- BaseCard.vue -->
<template>
  <div class="card">
    <slot />  <!-- 占位符：父组件可以往这里插入内容 -->
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 16px;
  margin-bottom: 16px;
}
</style>