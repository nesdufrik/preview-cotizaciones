<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = () => {
  error.value = ''
  
  if (!username.value || !password.value) {
    error.value = 'Por favor ingrese usuario y contraseña'
    return
  }
  
  const success = authStore.login(username.value, password.value)
  
  if (success) {
    router.push('/')
  } else {
    error.value = 'Usuario o contraseña incorrectos'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Administración de Cotizaciones
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ingrese sus credenciales para acceder
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              v-model="username"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Usuario"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              v-model="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  </div>
</template>