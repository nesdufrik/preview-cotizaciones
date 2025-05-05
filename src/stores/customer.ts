import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Customer } from '@/types'
import { mockCustomers } from '@/services/mockData'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>(mockCustomers)
  
  function addCustomer(customer: Customer) {
    customers.value.push(customer)
  }

  function updateCustomer(id: string, customer: Partial<Customer>) {
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...customer }
    }
  }

  return {
    customers,
    addCustomer,
    updateCustomer
  }
})