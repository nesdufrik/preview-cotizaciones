<script setup lang="ts">
import { computed } from 'vue'
import type { Customer } from '@/types'

const props = defineProps<{
  customers: Customer[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  edit: [Customer]
  delete: [Customer]
}>()

const tableHeaders = computed(() => [
  { key: 'name', label: 'Nombre', class: 'pl-4 pr-3 sm:pl-6' },
  { key: 'email', label: 'Email' },
  { key: 'customPricing', label: 'Precios Personalizados' }
])
</script>

<template>
  <Table :headers="tableHeaders">
    <template #header-actions>
      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
        <span class="sr-only">Acciones</span>
      </th>
    </template>

    <tr v-if="isLoading">
      <td colspan="4" class="text-center py-4">
        <LoadingSpinner size="sm" />
      </td>
    </tr>
    <tr v-else-if="customers.length === 0">
      <td colspan="4" class="text-center py-4 text-muted-foreground">
        No hay clientes registrados
      </td>
    </tr>

    <tr v-for="customer in customers" :key="customer.id">
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
        {{ customer.name }}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
        {{ customer.email }}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
        {{ customer.customPricing ? 'Sí' : 'No' }}
      </td>
      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <Button variant="secondary" size="sm" class="mr-2" @click="emit('edit', customer)">
          Editar
        </Button>
        <Button variant="danger" size="sm" @click="emit('delete', customer)">Eliminar</Button>
      </td>
    </tr>
  </Table>
</template>
