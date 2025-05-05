<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Service, ServiceSheet } from '@/types'
import { useServiceStore } from '@/stores/service'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps<{
  sheet: ServiceSheet
}>()

const emit = defineEmits<{
  saved: []
  cancelled: []
}>()

const serviceStore = useServiceStore()
const showServiceModal = ref(false)
const showServiceSelector = ref(false)
const selectedService = ref<Service | undefined>()
const selectedExistingServiceId = ref('')
const customBasePrice = ref<number | null>(null)

function handleNewService() {
  selectedService.value = undefined
  showServiceModal.value = true
}

function handleSelectExistingService() {
  if (!selectedExistingServiceId.value) return
  
  const originalService = serviceStore.services.find(s => s.id === selectedExistingServiceId.value)
  if (!originalService) return

  // Crear una copia del servicio para la hoja actual con el precio personalizado
  const serviceCopy: Service = {
    ...originalService,
    id: crypto.randomUUID(),
    sheetId: props.sheet.id,
    basePrice: customBasePrice.value || originalService.basePrice
  }
  
  props.sheet.services.push(serviceCopy)
  showServiceSelector.value = false
  selectedExistingServiceId.value = ''
  customBasePrice.value = null
  emit('saved')
}

function handleEditService(service: Service) {
  selectedService.value = service
  showServiceModal.value = true
}

function handleDeleteService(service: Service) {
  if (confirm('¿Está seguro de eliminar este servicio?')) {
    props.sheet.services = props.sheet.services.filter(s => s.id !== service.id)
    emit('saved')
  }
}

function handleServiceSaved(service: Service) {
  if (selectedService.value) {
    const index = props.sheet.services.findIndex(s => s.id === service.id)
    if (index !== -1) {
      props.sheet.services[index] = service
    }
  } else {
    props.sheet.services.push({ ...service, sheetId: props.sheet.id })
  }
  showServiceModal.value = false
  emit('saved')
}

function handleModalClose() {
  showServiceModal.value = false
  showServiceSelector.value = false
  selectedService.value = undefined
  selectedExistingServiceId.value = ''
  customBasePrice.value = null
  emit('cancelled')
}

// Filtrar servicios que no están en la hoja actual
const availableServices = computed(() => {
  const currentServiceNames = new Set(props.sheet.services.map(s => s.name))
  return serviceStore.services.filter(service => !currentServiceNames.has(service.name))
})

function handleExistingServiceSelection(serviceId: string) {
  const service = serviceStore.services.find(s => s.id === serviceId)
  if (service) {
    customBasePrice.value = service.basePrice
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end space-x-3">
      <Button variant="secondary" @click="showServiceSelector = true">Agregar Existente</Button>
      <Button @click="handleNewService">Crear Nuevo</Button>
    </div>

    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Nombre
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Categoría
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Ubicación
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Precio Base
            </th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-if="sheet.services.length === 0">
            <td colspan="5" class="text-center py-4 text-sm text-gray-500">
              No hay servicios en esta hoja
            </td>
          </tr>
          <tr v-for="service in sheet.services" :key="service.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {{ service.name }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ service.category }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ service.location }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ formatCurrency(service.basePrice) }}
            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <Button variant="secondary" size="sm" class="mr-2" @click="handleEditService(service)">
                Editar
              </Button>
              <Button variant="danger" size="sm" @click="handleDeleteService(service)">
                Eliminar
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para seleccionar servicio existente -->
    <Modal
      :show="showServiceSelector"
      title="Seleccionar Servicio Existente"
      @close="showServiceSelector = false"
    >
      <div class="space-y-4">
        <div v-if="availableServices.length === 0" class="text-center py-4 text-sm text-gray-500">
          No hay servicios disponibles para agregar
        </div>
        <div v-else class="space-y-4">
          <div>
            <label for="existingService" class="block text-sm font-medium text-gray-700">
              Seleccionar Servicio
            </label>
            <select
              id="existingService"
              v-model="selectedExistingServiceId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              @change="handleExistingServiceSelection(selectedExistingServiceId)"
            >
              <option value="">Seleccione un servicio</option>
              <option v-for="service in availableServices" :key="service.id" :value="service.id">
                {{ service.name }} - {{ service.category }} - {{ formatCurrency(service.basePrice) }}
              </option>
            </select>
          </div>

          <div v-if="selectedExistingServiceId">
            <label for="customPrice" class="block text-sm font-medium text-gray-700">
              Precio Base para esta Hoja
            </label>
            <input
              id="customPrice"
              v-model.number="customBasePrice"
              type="number"
              min="0"
              step="0.01"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" @click="showServiceSelector = false">Cancelar</Button>
            <Button
              :disabled="!selectedExistingServiceId"
              @click="handleSelectExistingService"
            >
              Agregar Servicio
            </Button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Modal para crear/editar servicio -->
    <Modal
      :show="showServiceModal"
      :title="selectedService ? 'Editar Servicio' : 'Nuevo Servicio'"
      @close="handleModalClose"
    >
      <ServiceForm
        :service="selectedService"
        :sheet-id="sheet.id"
        @saved="handleServiceSaved"
        @cancelled="handleModalClose"
      />
    </Modal>
  </div>
</template>