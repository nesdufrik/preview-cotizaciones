import { ref, computed } from 'vue'
import type { Quote, QuoteService, Customer } from '@/types'
import { useServiceStore } from '@/stores/service'
import { useServiceSheetStore } from '@/stores/serviceSheet'
import { useQuoteCalculations } from './useQuoteCalculations'

export function useQuoteForm(initialQuote?: Quote) {
  const serviceStore = useServiceStore()
  const serviceSheetStore = useServiceSheetStore()
  const { calculateServicePrice, calculateTotal } = useQuoteCalculations()
  
  const form = ref({
    customerId: initialQuote?.customerId || '',
    services: initialQuote?.services || [] as QuoteService[],
    status: initialQuote?.status || 'draft'
  })

  const selectedCustomer = ref<Customer | undefined>()

  const total = computed(() => calculateTotal(form.value.services))

  function addService(service: QuoteService) {
    // Verificar si el servicio ya existe
    const existingIndex = form.value.services.findIndex(s => s.serviceId === service.serviceId)
    
    if (existingIndex >= 0) {
      // Actualizar cantidad si ya existe
      form.value.services[existingIndex].quantity += service.quantity
    } else {
      // Agregar nuevo servicio
      form.value.services.push(service)
    }
  }

  function removeService(index: number) {
    form.value.services.splice(index, 1)
  }

  function setCustomer(customer: Customer) {
    selectedCustomer.value = customer
    form.value.customerId = customer.id
  }

  return {
    form,
    total,
    selectedCustomer,
    addService,
    removeService,
    setCustomer
  }
}