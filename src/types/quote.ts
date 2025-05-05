export interface Quote {
  id: string
  customerId: string
  services: QuoteService[]
  status: QuoteStatus
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface QuoteService {
  serviceId: string
  quantity: number
  price: number
  date: Date
}

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  [QuoteStatus.DRAFT]: 'Borrador',
  [QuoteStatus.SENT]: 'Enviada',
  [QuoteStatus.APPROVED]: 'Aprobada',
  [QuoteStatus.REJECTED]: 'Rechazada'
}