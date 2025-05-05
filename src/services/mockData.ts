import type { Customer, Service, Quote, Category } from '@/types'
import { QuoteStatus } from '@/types/quote'

export const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Hotel',
    description: 'Servicios de alojamiento y hospedaje',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'cat2',
    name: 'Transporte',
    description: 'Servicios de traslados y transportación',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'cat3',
    name: 'Actividad',
    description: 'Tours, excursiones y actividades turísticas',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
]

export const mockCustomers: Customer[] = [
  {
    id: 'c1b6e2a0-7d3f-4f2e-9e5d-8b4c1a2d3e4f',
    name: 'Hotel California',
    email: 'reservas@hotelcalifornia.com',
    customPricing: true
  },
  {
    id: 'd2c7f3b1-8e4g-5h3f-0i6e-9j5k2l4m6n7p',
    name: 'Agencia de Viajes Aventura',
    email: 'reservas@aventura.com',
    customPricing: false
  },
  {
    id: 'e3d8g4c2-9f5h-6i4g-1j7f-0k6l3m5n8p9q',
    name: 'Corporativo Global',
    email: 'viajes@corporativoglobal.com',
    customPricing: true
  }
]

export const mockServices: Service[] = [
  {
    id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    name: 'Hotel Grand Resort & Spa',
    category: 'Hotel',
    location: 'Cancún',
    basePrice: 2500,
    description: 'Habitación de lujo con vista al mar',
    lastUpdated: new Date('2024-03-01')
  },
  {
    id: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7',
    name: 'Traslado Aeropuerto-Hotel',
    category: 'Transporte',
    location: 'Cancún',
    basePrice: 800,
    description: 'Servicio privado de transporte',
    lastUpdated: new Date('2024-03-01')
  },
  {
    id: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8',
    name: 'Tour Chichén Itzá',
    category: 'Actividad',
    location: 'Yucatán',
    basePrice: 1200,
    description: 'Tour guiado con comida incluida',
    lastUpdated: new Date('2024-03-01')
  }
]

export const mockQuotes: Quote[] = [
  {
    id: 'q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6',
    customerId: mockCustomers[0].id,
    services: [
      {
        serviceId: mockServices[0].id,
        quantity: 3,
        price: 2500,
        date: new Date('2024-07-15')
      },
      {
        serviceId: mockServices[1].id,
        quantity: 1,
        price: 800,
        date: new Date('2024-07-15')
      }
    ],
    status: QuoteStatus.APPROVED,
    total: 8300,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
]