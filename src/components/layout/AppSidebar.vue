<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const isCollapsed = ref(false)
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const theme = localStorage.getItem('theme')
  isDark.value = theme === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})

const navigation = [
  { name: 'Inicio', path: '/', icon: '🏠' },
  { name: 'Cotizaciones', path: '/quotes', icon: '📝' },
  { name: 'Cotizaciones Email', path: '/email-quotes', icon: '📧' },
  { name: 'Servicios', path: '/services', icon: '🛠️' },
  { name: 'Categorías', path: '/services/categories', icon: '📑' },
  { name: 'Clientes', path: '/customers', icon: '👥' },
  { name: 'Liquidaciones', path: '/settlements', icon: '💰' }
]
</script>

<template>
  <aside
    :class="[
      'fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-background border-r border-border shadow-lg',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <div class="h-full px-3 py-4 overflow-y-auto bg-background text-foreground">
      <div class="flex items-center justify-between mb-5 px-2">
        <h1 v-if="!isCollapsed" class="text-xl font-semibold text-primary">AdminCotizaciones</h1>
        <div class="flex gap-2">
          <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-accent">
            {{ isDark ? '🌙' : '☀️' }}
          </button>
          <button @click="isCollapsed = !isCollapsed" class="p-2 rounded-lg hover:bg-accent">
            {{ isCollapsed ? '→' : '←' }}
          </button>
        </div>
      </div>
      <ul class="space-y-2 font-medium">
        <li v-for="item in navigation" :key="item.name">
          <RouterLink
            :to="item.path"
            class="flex items-center p-2 rounded-lg hover:bg-accent transition-colors duration-200 group"
            :class="{
              'justify-center': isCollapsed
            }"
          >
            <span class="text-xl">{{ item.icon }}</span>
            <span v-if="!isCollapsed" class="ml-3 whitespace-nowrap">{{ item.name }}</span>
          </RouterLink>
        </li>
      </ul>
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <button
          @click="authStore.logout()"
          :class="[
            'w-full flex items-center justify-center p-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-lg hover:opacity-90 transition-opacity duration-200',
            isCollapsed ? 'px-2' : 'px-4'
          ]"
        >
          <span class="text-xl">🚪</span>
          <span v-if="!isCollapsed" class="ml-2">Cerrar sesión</span>
        </button>
      </div>
    </div>
  </aside>
  <div :class="[isCollapsed ? 'ml-16' : 'ml-64']">
    <slot></slot>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-accent text-accent-foreground;
}
</style>
