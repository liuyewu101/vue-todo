import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),  // 路由懒加载
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: () => import('@/views/TaskDetailView.vue'),
      props: true,  // 将路由参数作为 Props 传入组件
      meta: { requiresAuth: true },
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/views/StatsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/kanban',
      name: 'kanban',
      component: () => import('@/views/KanbanView.vue'),
      meta: { requiresAuth: true, title: '看板视图' },
    },
    {
	  path: '/settings',
	  name: 'settings',
	  component: () => import('@/views/SettingsView.vue'),
	  meta: {
		requiresAuth: true,   // 需要登录
		title: '设置',         // 页面标题
	  },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      // 404 页面
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

function isLoggedIn() {
  try {
    return localStorage.getItem('user-token') === 'demo-only'
  } catch {
    return false
  }
}


router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && isLoggedIn()) {
    return { name: 'home' }
  }
})

router.afterEach((to, _from, failure) => {
  if (!failure) {
    document.title = typeof to.meta.title === 'string' ? to.meta.title : 'Vue Todo'
  }
})

export default router
