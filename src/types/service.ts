import { z } from 'zod'

export interface Service {
  id: string
  name: string
  category: string
  location: string
  basePrice: number
  description?: string
  lastUpdated: Date
  sheetId?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Esquema de validación para servicios
export const serviceSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  basePrice: z.number().positive('El precio debe ser mayor a 0'),
  description: z.string().optional(),
  lastUpdated: z.date(),
  sheetId: z.string().uuid('ID de hoja inválido').optional()
})

// Esquema de validación para categorías
export const categorySchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})