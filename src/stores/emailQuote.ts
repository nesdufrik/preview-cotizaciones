import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EmailQuote } from '@/types/emailQuote'
import { mockEmailQuotes } from '@/services/mockEmailData'

export const useEmailQuoteStore = defineStore('emailQuote', () => {
  const emailQuotes = ref<EmailQuote[]>(mockEmailQuotes)
  
  function updateEmailQuoteStatus(id: string, status: 'pending' | 'processed' | 'ignored') {
    const quote = emailQuotes.value.find(q => q.id === id)
    if (quote) {
      quote.status = status
    }
  }

  return {
    emailQuotes,
    updateEmailQuoteStatus
  }
})