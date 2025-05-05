<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const navigation = [
  { name: 'Inicio', path: '/' },
  { name: 'Cotizaciones', path: '/quotes' },
  { name: 'Cotizaciones Email', path: '/email-quotes' },
  { name: 'Servicios', path: '/services' },
  { name: 'Categorías', path: '/services/categories' },
  { name: 'Clientes', path: '/customers' },
  { name: 'Liquidaciones', path: '/settlements' }
]
</script>

<template>
  <header class="bg-white shadow">
    <nav class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold">AdminCotizaciones</h1>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <RouterLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.path"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>
        <div class="flex items-center">
          <button
            @click="authStore.logout()"
            class="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>
