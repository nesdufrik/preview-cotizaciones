import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Quote } from '@/types'
import { mockQuotes } from '@/services/mockData'

export const useQuoteStore = defineStore('quote', () => {
  const quotes = ref<Quote[]>(mockQuotes)
  
  function addQuote(quote: Quote) {
    quotes.value.push(quote)
  }

  function updateQuote(id: string, quote: Partial<Quote>) {
    const index = quotes.value.findIndex(q => q.id === id)
    if (index !== -1) {
      quotes.value[index] = { ...quotes.value[index], ...quote }
    }
  }

  return {
    quotes,
    addQuote,
    updateQuote
  }
})