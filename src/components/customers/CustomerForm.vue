<script setup lang="ts">
import { ref } from 'vue'
import type { Customer } from '@/types'
import { useCustomerStore } from '@/stores/customer'

const props = defineProps<{
  customer?: Customer
}>()

const emit = defineEmits<{
  saved: [Customer]
  cancelled: []
}>()

const customerStore = useCustomerStore()

const form = ref({
  name: props.customer?.name || '',
  email: props.customer?.email || '',
  customPricing: props.customer?.customPricing || false
})

async function handleSubmit() {
  const customerData: Customer = {
    id: props.customer?.id || crypto.randomUUID(),
    ...form.value
  }

  if (props.customer) {
    customerStore.updateCustomer(props.customer.id, customerData)
  } else {
    customerStore.addCustomer(customerData)
  }

  emit('saved', customerData)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>

    <div class="flex items-center">
      <input
        id="customPricing"
        v-model="form.customPricing"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <label for="customPricing" class="ml-2 block text-sm text-gray-900"
        >Precios personalizados</label
      >
    </div>

    <div class="flex justify-end space-x-3">
      <Button variant="secondary" @click="emit('cancelled')">Cancelar</Button>
      <Button type="submit">Guardar</Button>
    </div>
  </form>
</template>