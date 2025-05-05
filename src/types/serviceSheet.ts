import { z } from 'zod'
import { serviceSchema } from './service'

export interface ServiceSheet {
  id: string
  name: string
  description?: string
  isDefault: boolean
  customerId?: string | null
  createdAt: Date
  updatedAt: Date
  services: z.infer<typeof serviceSchema>[]
}

// Esquema de validación para hojas de servicio
export const serviceSheetSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  description: z.string().max(500, 'La descripción es muy larga').optional().nullable(),
  isDefault: z.boolean(),
  customerId: z.string().uuid('ID de cliente inválido').optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  services: z.array(serviceSchema).default([])
})
