<!-- src/views/LoginView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const error = ref('')
function login() {
  try {
    localStorage.setItem('user-token', 'demo-only')
    const redirect = route.query.redirect
    const destination = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//') && !redirect.startsWith('/login')
      ? redirect
      : '/'
    void router.replace(destination)
  } catch {
    error.value = '浏览器存储不可用，无法设置演示登录标记'
  }
}
</script>

<template><section><h1>演示登录</h1><button @click="login">进入演示</button><p>{{ error }}</p></section></template>
