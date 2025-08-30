import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../pages/Login.vue'
import TaskBoard from '../pages/TaskBoard.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import Users from '../pages/Users.vue'
import store from '../../lib/store'

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true },
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'TaskBoard',
        component: TaskBoard,
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Simple auth guard
router.beforeEach(async (to, from, next) => {
  const isPublic = to.matched.some((r) => r.meta.public)
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)

  // If the route is public, allow
  if (isPublic) {
    // redirect logged-in users away from login
    if (to.name === 'Login' && store.getters['auth/isAuthenticated']) {
      return next({ name: 'TaskBoard' })
    }
    return next()
  }

  // If route requires auth
  if (requiresAuth) {
    // If Vuex has user, allow
    if (store.getters['auth/isAuthenticated']) return next()

    // Otherwise, try fetching user from cookie
    await store.dispatch('auth/fetchUser')

    if (store.getters['auth/isAuthenticated']) return next()

    // Not authenticated, redirect to log in
    return next({ name: 'Login' })
  }

  next()
})

export default router
