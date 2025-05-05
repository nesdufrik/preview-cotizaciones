<script setup lang="ts">
import { ref } from 'vue'
import type { Quote, QuoteService } from '@/types'
import { QuoteStatus } from '@/types/quote'
import { useQuoteStore } from '@/stores/quote'
import { useCustomerStore } from '@/stores/customer'
import { useQuoteForm } from '@/composables/useQuoteForm'
import { formatCurrency } from '@/utils/formatters'
import { showNotification } from '@/utils/notifications'

const props = defineProps<{
  quote?: Quote
}>()

const emit = defineEmits<{
  saved: [Quote]
  cancelled: []
}>()

const quoteStore = useQuoteStore()
const customerStore = useCustomerStore()
const showServiceForm = ref(false)

const { 
  form, 
  total, 
  selectedCustomer, 
  addService, 
  removeService, 
  setCustomer 
} = useQuoteForm(props.quote)

async function handleSubmit() {
  if (!form.value.services.length) {
    showNotification({
      title: 'Error',
      message: 'Debe agregar al menos un servicio a la cotización',
      type: 'error'
    })
    return
  }

  const quoteData: Quote = {
    id: props.quote?.id || crypto.randomUUID(),
    customerId: form.value.customerId,
    services: form.value.services,
    status: form.value.status as QuoteStatus,
    total: total.value,
    createdAt: props.quote?.createdAt || new Date(),
    updatedAt: new Date()
  }

  if (props.quote) {
    quoteStore.updateQuote(props.quote.id, quoteData)
  } else {
    quoteStore.addQuote(quoteData)
  }

  emit('saved', quoteData)
}

function handleAddService(service: QuoteService) {
  addService(service)
  showServiceForm.value = false
}

function handleCustomerChange(event: Event) {
  const customerId = (event.target as HTMLSelectElement).value
  const customer = customerStore.customers.find(c => c.id === customerId)
  if (customer) {
    setCustomer(customer)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="customerId" class="block text-sm font-medium text-gray-700">Cliente</label>
      <select
        id="customerId"
        v-model="form.customerId"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        @change="handleCustomerChange"
      >
        <option value="">Seleccionar cliente</option>
        <option v-for="customer in customerStore.customers" :key="customer.id" :value="customer.id">
          {{ customer.name }} - {{ customer.email }}
        </option>
      </select>
    </div>

    <div>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Servicios</h3>
        <Button 
          variant="secondary" 
          size="sm" 
          :disabled="!form.customerId"
          @click="showServiceForm = true"
        >
          Agregar Servicio
        </Button>
      </div>

      <QuoteServiceList
        :services="form.services"
        @remove="removeService"
      />

      <p v-if="!form.services.length" class="text-sm text-gray-500 mt-2">
        No hay servicios agregados a la cotización
      </p>

      <Modal
        :show="showServiceForm"
        title="Agregar Servicio"
        @close="showServiceForm = false"
      >
        <QuoteServiceForm
          :customer-id="form.customerId"
          @add="handleAddService"
          @cancel="showServiceForm = false"
        />
      </Modal>
    </div>

    <div class="flex justify-between items-center pt-4 border-t">
      <div class="text-lg font-medium">
        Total: {{ formatCurrency(total) }}
      </div>
      <div class="flex gap-3">
        <Button variant="secondary" @click="emit('cancelled')">Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </div>
  </form>
</template>