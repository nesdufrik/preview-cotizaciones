import type { EmailQuote } from '@/types/emailQuote'

export const mockEmailQuotes: EmailQuote[] = [
  {
    id: 'eq1',
    subject: 'Solicitud de cotización - Grupo turístico',
    sender: 'cliente@empresa.com',
    receivedAt: new Date('2024-03-10T10:30:00'),
    originalHtml: `
      <div>
        Buen día,
        
        Necesito cotización para los siguientes servicios:
        - Hotel Marriott (3 noches, 2 habitaciones)
        - Traslado aeropuerto-hotel
        - Tour a Chichén Itzá
        
        Fecha: 15 de abril
        
        Saludos
      </div>
    `,
    detectedServices: [
      {
        name: 'Hotel Marriott',
        description: 'Estancia de 3 noches, 2 habitaciones',
        quantity: 2,
        date: '2024-04-15',
        suggestedPrice: 2500,
        confidence: 0.95
      },
      {
        name: 'Traslado Aeropuerto-Hotel',
        quantity: 1,
        date: '2024-04-15',
        suggestedPrice: 800,
        confidence: 0.90
      },
      {
        name: 'Tour Chichén Itzá',
        quantity: 1,
        date: '2024-04-16',
        suggestedPrice: 1200,
        confidence: 0.85
      }
    ],
    status: 'pending'
  },
  {
    id: 'eq2',
    subject: 'Cotización servicios turísticos',
    sender: 'otro@cliente.com',
    receivedAt: new Date('2024-03-09T15:45:00'),
    originalHtml: `
      <div>
        Hola,
        
        Me gustaría saber el costo de:
        * 1 semana en Hotel Grand Resort
        * Transporte desde el aeropuerto
        * 2 tours (Xcaret y Tulum)
        
        Gracias
      </div>
    `,
    detectedServices: [
      {
        name: 'Hotel Grand Resort',
        description: 'Estancia de 7 noches',
        quantity: 1,
        date: '2024-05-01',
        suggestedPrice: 5600,
        confidence: 0.88
      },
      {
        name: 'Traslado Aeropuerto-Hotel',
        quantity: 1,
        suggestedPrice: 800,
        confidence: 0.92
      },
      {
        name: 'Tour Xcaret',
        quantity: 1,
        suggestedPrice: 2500,
        confidence: 0.87
      },
      {
        name: 'Tour Tulum',
        quantity: 1,
        suggestedPrice: 1500,
        confidence: 0.89
      }
    ],
    status: 'pending'
  }
]