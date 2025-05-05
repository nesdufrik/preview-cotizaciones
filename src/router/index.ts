import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/quotes',
      name: 'quotes',
      component: () => import('../views/quotes/QuotesView.vue')
    },
    {
      path: '/email-quotes',
      name: 'email-quotes',
      component: () => import('../views/quotes/EmailQuotesView.vue')
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/services/ServicesView.vue')
    },
    {
      path: '/services/categories',
      name: 'service-categories',
      component: () => import('../views/services/CategoriesView.vue')
    },
    {
      path: '/services/:id',
      name: 'service-details',
      component: () => import('../views/services/ServiceDetailsView.vue')
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/customers/CustomersView.vue')
    },
    {
      path: '/settlements',
      name: 'settlements',
      component: () => import('../views/settlements/SettlementsView.vue')
    }
  ]
})

// Navigation guard to check authentication status
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
