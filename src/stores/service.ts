import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Service } from '@/types'
import { mockServices } from '@/services/mockData'

export const useServiceStore = defineStore('service', () => {
  const services = ref<Service[]>(mockServices)
  
  function addService(service: Service) {
    services.value.push(service)
  }

  function updateService(id: string, service: Partial<Service>) {
    const index = services.value.findIndex(s => s.id === id)
    if (index !== -1) {
      services.value[index] = { ...services.value[index], ...service }
    }
  }

  return {
    services,
    addService,
    updateService
  }
})