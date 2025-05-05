<script setup lang="ts">
import { ref, computed } from 'vue'
import type { QuoteService } from '@/types'
import { useServiceStore } from '@/stores/service'
import { useServiceSheetStore } from '@/stores/serviceSheet'
import { useCategoryStore } from '@/stores/category'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps<{
  customerId?: string
}>()

const emit = defineEmits<{
  add: [QuoteService]
  cancel: []
}>()

const serviceStore = useServiceStore()
const categoryStore = useCategoryStore()
const serviceSheetStore = useServiceSheetStore()

const selectedService = ref(null)
const quantity = ref(1)
const customPrice = ref(null)

const categories = computed(() => categoryStore.categories)

// Obtener servicios combinados (default + personalizados)
const availableServices = computed(() => {
  const defaultSheet = serviceSheetStore.getDefaultSheet()
  const defaultServices = defaultSheet?.services || []

  if (!props.customerId) return defaultServices

  const customerSheet = serviceSheetStore.sheets.find(
    sheet => sheet.customerId === props.customerId && !sheet.isDefault
  )
  
  if (!customerSheet) return defaultServices

  // Crear un mapa de servicios por nombre para facilitar la búsqueda
  const servicesMap = new Map()
  
  // Primero agregamos los servicios default
  defaultServices.forEach(service => {
    servicesMap.set(service.name, { ...service })
  })
  
  // Luego sobrescribimos con los servicios personalizados si existen
  customerSheet.services.forEach(customService => {
    servicesMap.set(customService.name, { ...customService })
  })

  // Convertir el mapa de vuelta a un array
  return Array.from(servicesMap.values())
})

const servicesByCategory = computed(() => {
  const grouped = new Map()
  availableServices.value.forEach(service => {
    if (!grouped.has(service.category)) {
      grouped.set(service.category, [])
    }
    grouped.get(service.category).push(service)
  })
  return grouped
})

const isValid = computed(() => 
  selectedService.value && 
  quantity.value > 0 && 
  (customPrice.value === null || customPrice.value > 0)
)

function handleServiceSelection(serviceId: string) {
  const service = availableServices.value.find(s => s.id === serviceId)
  if (service) {
    selectedService.value = service
    customPrice.value = service.basePrice
  }
}

function createQuoteService(): QuoteService | null {
  if (!selectedService.value || !quantity.value) return null

  return {
    serviceId: selectedService.value.id,
    quantity: quantity.value,
    price: customPrice.value || selectedService.value.basePrice,
    date: new Date()
  }
}

function reset() {
  selectedService.value = null
  quantity.value = 1
  customPrice.value = null
}

function handleSubmit() {
  const quoteService = createQuoteService()
  if (quoteService) {
    emit('add', quoteService)
    reset()
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="service" class="block text-sm font-medium text-gray-700">Servicio</label>
      <select
        id="service"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        @change="handleServiceSelection(($event.target as HTMLSelectElement).value)"
      >
        <option value="">Seleccione un servicio</option>
        <optgroup 
          v-for="category in categories" 
          :key="category.id" 
          :label="category.name"
        >
          <option
            v-for="service in servicesByCategory.get(category.name) || []"
            :key="service.id"
            :value="service.id"
          >
            {{ service.name }} - {{ formatCurrency(service.basePrice) }}
          </option>
        </optgroup>
      </select>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="quantity" class="block text-sm font-medium text-gray-700">Cantidad</label>
        <input
          id="quantity"
          v-model.number="quantity"
          type="number"
          min="1"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">Precio</label>
        <input
          id="price"
          v-model.number="customPrice"
          type="number"
          min="0"
          step="0.01"
          :placeholder="selectedService?.basePrice.toString()"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div v-if="selectedService" class="text-sm text-gray-500">
      <p>Precio base: {{ formatCurrency(selectedService.basePrice) }}</p>
      <p v-if="quantity > 0 && customPrice !== null">
        Total: {{ formatCurrency(quantity * customPrice) }}
      </p>
    </div>

    <div class="flex justify-end space-x-3">
      <Button variant="secondary" @click="emit('cancel')">Cancelar</Button>
      <Button type="submit" :disabled="!isValid">Agregar</Button>
    </div>
  </form>
</template>