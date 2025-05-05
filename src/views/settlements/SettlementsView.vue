<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuoteStore } from '@/stores/quote'
import { useSettlementStore } from '@/stores/settlement'
import { useCustomerStore } from '@/stores/customer'
import { useServiceStore } from '@/stores/service'
import type { Quote, Settlement } from '@/types'
import { formatCurrency } from '@/utils/formatters'

const quoteStore = useQuoteStore()
const settlementStore = useSettlementStore()
const customerStore = useCustomerStore()
const serviceStore = useServiceStore()

const approvedQuotes = ref<Quote[]>([])
const isLoading = ref(true)
const showSettlementModal = ref(false)
const selectedQuote = ref<Quote | null>(null)

const quotesWithDetails = computed(() => {
  return approvedQuotes.value.map(quote => {
    const customer = customerStore.customers.find(c => c.id === quote.customerId)
    const services = quote.services.map(service => {
      const serviceDetails = serviceStore.services.find(s => s.id === service.serviceId)
      return {
        ...service,
        name: serviceDetails?.name || 'Servicio no encontrado'
      }
    })
    return {
      ...quote,
      customerName: customer?.name || 'Cliente no encontrado',
      services
    }
  })
})

onMounted(async () => {
  // In a real app, this would fetch from an API
  approvedQuotes.value = quoteStore.quotes.filter(quote => quote.status === 'approved')
  isLoading.value = false
})

function handleGenerateSettlement(quote: Quote) {
  selectedQuote.value = quote
  showSettlementModal.value = true
}

function handleSettlementSaved(settlement: Settlement) {
  showSettlementModal.value = false
  selectedQuote.value = null
  // Refresh the list or update UI as needed
}

function isSettlementGenerated(quoteId: string): boolean {
  return !!settlementStore.getSettlementByQuoteId(quoteId)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Liquidaciones</h1>
    </div>

    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Servicios
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Estado
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-if="isLoading">
                  <td colspan="5" class="text-center py-4">
                    <LoadingSpinner size="sm" />
                  </td>
                </tr>
                <tr v-else-if="quotesWithDetails.length === 0">
                  <td colspan="5" class="text-center py-4">No hay cotizaciones aprobadas</td>
                </tr>
                <tr v-for="quote in quotesWithDetails" :key="quote.id">
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                  >
                    {{ quote.customerName }}
                  </td>
                  <td class="px-3 py-4 text-sm text-gray-500">
                    <ul class="list-disc list-inside">
                      <li v-for="service in quote.services" :key="service.serviceId">
                        {{ service.name }} ({{ service.quantity }} x {{ formatCurrency(service.price) }})
                      </li>
                    </ul>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatCurrency(quote.total) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Badge
                      :variant="isSettlementGenerated(quote.id) ? 'success' : 'info'"
                    >
                      {{ isSettlementGenerated(quote.id) ? 'Liquidada' : 'Pendiente' }}
                    </Badge>
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  >
                    <Button
                      v-if="!isSettlementGenerated(quote.id)"
                      variant="primary"
                      size="sm"
                      @click="handleGenerateSettlement(quote)"
                    >
                      Generar Liquidación
                    </Button>
                    <Button
                      v-else
                      variant="secondary"
                      size="sm"
                      disabled
                    >
                      Ya Liquidada
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <Modal
      v-if="selectedQuote"
      :show="showSettlementModal"
      title="Generar Liquidación"
      @close="showSettlementModal = false"
    >
      <SettlementForm
        :quote="selectedQuote"
        @saved="handleSettlementSaved"
        @cancelled="showSettlementModal = false"
      />
    </Modal>
  </div>
</template>