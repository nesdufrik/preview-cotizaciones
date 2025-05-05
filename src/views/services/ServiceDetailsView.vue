<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServiceSheetStore } from '@/stores/serviceSheet'
import type { ServiceSheet, Service } from '@/types'
import ServiceList from '@/components/services/ServiceList.vue'
import ServiceForm from '@/components/services/ServiceForm.vue'
import { showNotification } from '@/utils/notifications'

const route = useRoute()
const router = useRouter()
const serviceSheetStore = useServiceSheetStore()
const sheet = ref<ServiceSheet>()
const isLoading = ref(true)
const showServiceModal = ref(false)
const selectedService = ref<Service | undefined>()

const sheetId = computed(() => route.params.id as string)

onMounted(async () => {
  sheet.value = serviceSheetStore.sheets.find(s => s.id === sheetId.value)
  if (!sheet.value) {
    router.push('/services')
    showNotification({
      title: 'Error',
      message: 'Hoja de servicios no encontrada',
      type: 'error'
    })
    return
  }
  isLoading.value = false
})

function handleNewService() {
  selectedService.value = undefined
  showServiceModal.value = true
}

function handleEditService(service: Service) {
  selectedService.value = service
  showServiceModal.value = true
}

function handleServiceSaved(service: Service) {
  if (selectedService.value) {
    serviceSheetStore.updateServiceInSheet(sheetId.value, service.id, service)
  } else {
    serviceSheetStore.addServiceToSheet(sheetId.value, service)
  }
  showServiceModal.value = false
  showNotification({
    title: selectedService.value ? 'Servicio actualizado' : 'Servicio creado',
    message: `El servicio ${service.name} ha sido ${selectedService.value ? 'actualizado' : 'creado'} exitosamente`,
    type: 'success'
  })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="sheet" class="space-y-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ sheet.name }}</h1>
          <p v-if="sheet.description" class="mt-1 text-sm text-gray-500">
            {{ sheet.description }}
          </p>
        </div>
      </div>

      <ServiceList
        :sheet="sheet"
        :is-loading="isLoading"
        @edit="handleEditService"
      />
    </div>

    <Modal
      :show="showServiceModal"
      :title="selectedService ? 'Editar Servicio' : 'Nuevo Servicio'"
      @close="showServiceModal = false"
    >
      <ServiceForm
        :service="selectedService"
        @saved="handleServiceSaved"
        @cancelled="showServiceModal = false"
      />
    </Modal>
  </div>
</template>