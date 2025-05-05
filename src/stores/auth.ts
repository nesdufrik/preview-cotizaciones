import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { router } from '../router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  // Check if there's a stored user in localStorage on initialization
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }

  function login(username: string, password: string) {
    // Simple hardcoded authentication
    if (username === 'admin' && password === 'admin') {
      user.value = { username }
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
})