import type { Customer, Service } from '@/types'

export function calculateServicePrice(service: Service, customer?: Customer): number {
  if (!service) return 0
  return customer?.customPricing ? service.basePrice * 0.9 : service.basePrice
}

export function calculateTotal(services: Array<{ quantity: number; price: number }>): number {
  return services.reduce((sum, service) => sum + service.price * service.quantity, 0)
}