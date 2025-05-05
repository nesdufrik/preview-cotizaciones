<script setup lang="ts">
import { computed } from 'vue'
import type { QuoteService } from '@/types'
import { useServiceStore } from '@/stores/service'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps<{
  services: QuoteService[]
}>()

const emit = defineEmits<{
  remove: [number]
}>()

const serviceStore = useServiceStore()

const servicesWithDetails = computed(() => {
  return props.services.map(service => {
    const serviceDetails = serviceStore.services.find(s => s.id === service.serviceId)
    return {
      ...service,
      name: serviceDetails?.name || 'Servicio no encontrado',
      total: service.price * service.quantity
    }
  })
})
</script>

<template>
  <div class="space-y-4">
    <div v-for="(service, index) in servicesWithDetails" :key="service.serviceId" class="flex gap-4">
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700">Servicio</label>
        <div class="mt-1 text-sm text-gray-900">{{ service.name }}</div>
      </div>
      <div class="w-24">
        <label class="block text-sm font-medium text-gray-700">Cantidad</label>
        <div class="mt-1 text-sm text-gray-900">{{ service.quantity }}</div>
      </div>
      <div class="w-32">
        <label class="block text-sm font-medium text-gray-700">Precio</label>
        <div class="mt-1 text-sm text-gray-900">{{ formatCurrency(service.price) }}</div>
      </div>
      <div class="w-32">
        <label class="block text-sm font-medium text-gray-700">Total</label>
        <div class="mt-1 text-sm text-gray-900">{{ formatCurrency(service.total) }}</div>
      </div>
      <div class="flex items-end">
        <Button variant="danger" size="sm" @click="emit('remove', index)">
          Eliminar
        </Button>
      </div>
    </div>
  </div>
</template>