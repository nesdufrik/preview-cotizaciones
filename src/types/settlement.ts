import type { QuoteService } from './quote'

export interface Settlement {
  id: string
  quoteId: string
  customerId: string
  services: SettlementService[]
  total: number
  additionalCharges: AdditionalCharge[]
  status: SettlementStatus
  createdAt: Date
  updatedAt: Date
}

export interface SettlementService extends QuoteService {
  actualPrice?: number
  notes?: string
}

export interface AdditionalCharge {
  id: string
  description: string
  amount: number
}

export enum SettlementStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  [SettlementStatus.PENDING]: 'Pendiente',
  [SettlementStatus.COMPLETED]: 'Completada',
  [SettlementStatus.CANCELLED]: 'Cancelada'
}