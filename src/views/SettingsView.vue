<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const error = ref('')

function logout() {
  try {
    localStorage.removeItem('user-token')
    void router.replace({ name: 'login' })
  } catch {
    error.value = '浏览器存储不可用，无法退出演示登录'
  }
}
</script>

<template>
  <section>
    <h1>设置</h1>
    <p>主题设置将在 L16 加入。</p>
    <button type="button" @click="logout">退出登录</button>
    <p v-if="error" role="alert">{{ error }}</p>
  </section>
</template>
