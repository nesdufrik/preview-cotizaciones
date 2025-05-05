export interface EmailQuote {
  id: string
  subject: string
  sender: string
  receivedAt: Date
  originalHtml: string
  detectedServices: DetectedService[]
  status: 'pending' | 'processed' | 'ignored'
}

export interface DetectedService {
  name: string
  description?: string
  suggestedPrice?: number
  quantity?: number
  date?: string
  confidence: number
}