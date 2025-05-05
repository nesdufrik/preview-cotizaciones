import { ref, computed } from 'vue'
import type { Service, Customer, QuoteService } from '@/types'
import { useServiceStore } from '@/stores/service'
import { useServiceSheetStore } from '@/stores/serviceSheet'
import { useQuoteCalculations } from './useQuoteCalculations'

export function useQuoteServices(customerId?: string) {
  const serviceStore = useServiceStore()
  const serviceSheetStore = useServiceSheetStore()
  const { calculateServicePrice } = useQuoteCalculations()

  const selectedService = ref<Service | null>(null)
  const quantity = ref(1)
  const customPrice = ref<number | null>(null)

  // Obtener servicios combinados (default + personalizados)
  const availableServices = computed(() => {
    const defaultSheet = serviceSheetStore.getDefaultSheet()
    const defaultServices = defaultSheet?.services || []

    if (!customerId) return defaultServices

    const customerSheet = serviceSheetStore.sheets.find(
      sheet => sheet.customerId === customerId && !sheet.isDefault
    )
    
    if (!customerSheet) return defaultServices

    // Combinar servicios, priorizando los personalizados
    const mergedServices = [...defaultServices]
    
    customerSheet.services.forEach(customService => {
      const index = mergedServices.findIndex(s => 
        s.name === customService.name && 
        s.category === customService.category
      )
      
      if (index >= 0) {
        // Reemplazar servicio existente con versión personalizada
        mergedServices[index] = customService
      } else {
        // Agregar nuevo servicio personalizado
        mergedServices.push(customService)
      }
    })

    return mergedServices
  })

  function handleServiceSelection(serviceId: string) {
    const service = availableServices.value.find(s => s.id === serviceId)
    if (service) {
      selectedService.value = service
      customPrice.value = calculateServicePrice(service)
    }
  }

  function createQuoteService(): QuoteService | null {
    if (!selectedService.value || !quantity.value) return null

    return {
      serviceId: selectedService.value.id,
      quantity: quantity.value,
      price: customPrice.value || selectedService.value.basePrice,
      date: new Date()
    }
  }

  function reset() {
    selectedService.value = null
    quantity.value = 1
    customPrice.value = null
  }

  return {
    selectedService,
    quantity,
    customPrice,
    availableServices,
    handleServiceSelection,
    createQuoteService,
    reset
  }
}