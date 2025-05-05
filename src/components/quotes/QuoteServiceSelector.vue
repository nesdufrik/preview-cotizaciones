<script setup lang="ts">
import { computed } from 'vue'
import type { Service } from '@/types'
import { useServiceStore } from '@/stores/service'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps<{
  selectedServiceIds: string[]
}>()

const emit = defineEmits<{
  select: [Service]
}>()

const serviceStore = useServiceStore()

const availableServices = computed(() => {
  return serviceStore.services.filter(service => !props.selectedServiceIds.includes(service.id))
})
</script>

<template>
  <div>
    <label for="service" class="block text-sm font-medium text-gray-700">
      Seleccionar Servicio
    </label>
    <select
      id="service"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      @change="
        ($event.target as HTMLSelectElement).value &&
          emit('select', serviceStore.services.find(s => s.id === ($event.target as HTMLSelectElement).value)!)
      "
    >
      <option value="">Seleccione un servicio</option>
      <option
        v-for="service in availableServices"
        :key="service.id"
        :value="service.id"
      >
        {{ service.name }} - {{ formatCurrency(service.basePrice) }}
      </option>
    </select>
  </div>
</template>