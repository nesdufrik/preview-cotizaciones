import type { Service, Customer, QuoteService } from '@/types'

export function useQuoteCalculations() {
  function calculateServicePrice(service: Service): number {
    if (!service) return 0
    return service.basePrice
  }

  function calculateTotal(services: QuoteService[]): number {
    return services.reduce((sum, service) => sum + service.price * service.quantity, 0)
  }

  return {
    calculateServicePrice,
    calculateTotal
  }
}