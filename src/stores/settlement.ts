import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Settlement } from '@/types'

export const useSettlementStore = defineStore('settlement', () => {
  const settlements = ref<Settlement[]>([])
  
  function addSettlement(settlement: Settlement) {
    settlements.value.push(settlement)
  }

  function updateSettlement(id: string, settlement: Partial<Settlement>) {
    const index = settlements.value.findIndex(s => s.id === id)
    if (index !== -1) {
      settlements.value[index] = { ...settlements.value[index], ...settlement }
    }
  }

  function getSettlementByQuoteId(quoteId: string) {
    return settlements.value.find(s => s.quoteId === quoteId)
  }

  return {
    settlements,
    addSettlement,
    updateSettlement,
    getSettlementByQuoteId
  }
})