<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useServiceSheetStore } from '@/stores/serviceSheet'
import type { ServiceSheet } from '@/types'
import ServiceSheetCard from '@/components/services/ServiceSheetCard.vue'
import ServiceList from '@/components/services/ServiceList.vue'
import ServiceSheetForm from '@/components/services/ServiceSheetForm.vue'
import { showNotification } from '@/utils/notifications'

const serviceSheetStore = useServiceSheetStore()
const sheets = ref<ServiceSheet[]>([])
const isLoading = ref(true)
const showSheetModal = ref(false)
const selectedSheet = ref<ServiceSheet | undefined>()

onMounted(async () => {
  sheets.value = serviceSheetStore.sheets
  isLoading.value = false
})

function handleNewSheet() {
  selectedSheet.value = undefined
  showSheetModal.value = true
}

function handleEditSheet(sheet: ServiceSheet) {
  selectedSheet.value = sheet
  showSheetModal.value = true
}

function handleDeleteSheet(sheet: ServiceSheet) {
  if (confirm('¿Está seguro de eliminar esta hoja de servicios?')) {
    serviceSheetStore.deleteSheet(sheet.id)
    showNotification({
      title: 'Hoja de servicios eliminada',
      message: `La hoja ${sheet.name} ha sido eliminada`,
      type: 'success'
    })
    sheets.value = serviceSheetStore.sheets
  }
}

function handleSheetSaved(sheet: ServiceSheet) {
  showSheetModal.value = false
  showNotification({
    title: selectedSheet.value ? 'Hoja actualizada' : 'Hoja creada',
    message: `La hoja ${sheet.name} ha sido ${selectedSheet.value ? 'actualizada' : 'creada'} exitosamente`,
    type: 'success'
  })
  sheets.value = serviceSheetStore.sheets
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Hojas de Servicios</h1>
      <Button @click="handleNewSheet">Nueva Hoja de Servicios</Button>
    </div>

    <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-if="isLoading" class="col-span-full text-center py-12">
        <LoadingSpinner />
      </div>
      
      <template v-else>
        <ServiceSheetCard
          v-for="sheet in sheets"
          :key="sheet.id"
          :sheet="sheet"
          @edit="handleEditSheet"
          @delete="handleDeleteSheet"
        />
      </template>
    </div>

    <Modal
      :show="showSheetModal"
      :title="selectedSheet ? 'Editar Hoja de Servicios' : 'Nueva Hoja de Servicios'"
      @close="showSheetModal = false"
    >
      <ServiceSheetForm
        :sheet="selectedSheet"
        @saved="handleSheetSaved"
        @cancelled="showSheetModal = false"
      />
    </Modal>
  </div>
</template>