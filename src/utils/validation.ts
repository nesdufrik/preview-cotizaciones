import { z } from 'zod'
import type { Quote, Customer, Service } from '@/types'

export const customerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  customPricing: z.boolean().optional()
})

export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.enum(['hotel', 'restaurant', 'transport', 'activity']),
  location: z.string().min(1, 'La ubicación es requerida'),
  basePrice: z.number().positive('El precio debe ser mayor a 0'),
  description: z.string().optional(),
  lastUpdated: z.date()
})

export const quoteSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  services: z.array(z.object({
    serviceId: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    date: z.date()
  })),
  status: z.enum(['draft', 'sent', 'approved', 'rejected']),
  total: z.number().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export function validateCustomer(data: unknown): Customer {
  return customerSchema.parse(data)
}

export function validateService(data: unknown): Service {
  return serviceSchema.parse(data)
}

export function validateQuote(data: unknown): Quote {
  return quoteSchema.parse(data)
}