<script setup lang="ts">
import { computed } from 'vue'
import type { Quote } from '@/types/quote'
import { QUOTE_STATUS_LABELS } from '@/types/quote'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { useCustomerStore } from '@/stores/customer'
import QuoteStatusManager from './QuoteStatusManager.vue'

const props = defineProps<{
  quotes: Quote[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  edit: [Quote]
  delete: [Quote]
  statusChanged: [Quote]
}>()

const customerStore = useCustomerStore()

const tableHeaders = computed(() => [
  { key: 'id', label: 'ID', class: 'pl-4 pr-3 sm:pl-6' },
  { key: 'customer', label: 'Cliente' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Estado' },
  { key: 'date', label: 'Fecha' }
])

function getCustomerName(customerId: string): string {
  const customer = customerStore.customers.find(c => c.id === customerId)
  return customer?.name || customerId
}

function handleStatusChanged(quote: Quote) {
  emit('statusChanged', quote)
}
</script>

<template>
  <Table :headers="tableHeaders">
    <template #header-actions>
      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
        <span class="sr-only">Acciones</span>
      </th>
    </template>

    <tr v-if="isLoading">
      <td colspan="6" class="text-center py-4">
        <LoadingSpinner size="sm" />
      </td>
    </tr>
    <tr v-else-if="quotes.length === 0">
      <td colspan="6" class="text-center py-4">No hay cotizaciones registradas</td>
    </tr>

    <tr v-for="quote in quotes" :key="quote.id">
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {{ quote.id }}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {{ getCustomerName(quote.customerId) }}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {{ formatCurrency(quote.total) }}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <QuoteStatusManager 
          :quote="quote"
          @status-changed="handleStatusChanged"
        />
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {{ formatDate(quote.createdAt) }}
      </td>
      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <Button 
          variant="secondary" 
          size="sm" 
          class="mr-2" 
          :disabled="quote.status !== 'draft'"
          @click="emit('edit', quote)"
        >
          Editar
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          :disabled="quote.status !== 'draft'"
          @click="emit('delete', quote)"
        >
          Eliminar
        </Button>
      </td>
    </tr>
  </Table>
</template>