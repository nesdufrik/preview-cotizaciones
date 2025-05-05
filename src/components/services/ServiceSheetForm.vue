<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceSheet } from '@/types/serviceSheet'
import { useCustomerStore } from '@/stores/customer'
import { useServiceSheet } from '@/composables/useServiceSheet'

const props = defineProps<{
  sheet?: ServiceSheet
}>()

const emit = defineEmits<{
  saved: [ServiceSheet]
  cancelled: []
}>()

const customerStore = useCustomerStore()

const customersWithCustomPricing = computed(() => 
  customerStore.customers.filter(customer => customer.customPricing)
)

const { 
  data, 
  errors, 
  handleSubmit,
  saveServiceSheet 
} = useServiceSheet(props.sheet)

async function onSubmit() {
  try {
    // Si no hay cliente seleccionado, aseguramos que sea null
    if (!data.value.customerId) {
      data.value.customerId = null
    }
    
    const savedSheet = await saveServiceSheet()
    emit('saved', savedSheet)
  } catch (error) {
    console.error('Error al guardar la hoja:', error)
    throw error
  }
}
</script>

<template>
  <form @submit.prevent="() => handleSubmit(onSubmit)" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
      <input
        id="name"
        v-model="data.name"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'border-red-300': errors.name }"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>

    <div>
      <label for="customerId" class="block text-sm font-medium text-gray-700">Cliente</label>
      <select
        id="customerId"
        v-model="data.customerId"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'border-red-300': errors.customerId }"
      >
        <option :value="null">Sin cliente específico</option>
        <option 
          v-for="customer in customersWithCustomPricing" 
          :key="customer.id" 
          :value="customer.id"
        >
          {{ customer.name }} (Precios personalizados)
        </option>
      </select>
      <p v-if="errors.customerId" class="mt-1 text-sm text-red-600">{{ errors.customerId }}</p>
      <p class="mt-1 text-sm text-gray-500">
        Solo se muestran clientes con precios personalizados habilitados
      </p>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea
        id="description"
        v-model="data.description"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'border-red-300': errors.description }"
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
    </div>

    <div class="flex justify-end space-x-3">
      <Button variant="secondary" @click="emit('cancelled')">Cancelar</Button>
      <Button type="submit">Guardar</Button>
    </div>
  </form>
</template>