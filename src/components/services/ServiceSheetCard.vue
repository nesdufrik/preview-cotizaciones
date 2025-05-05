<script setup lang="ts">
import type { ServiceSheet } from '@/types'
import { formatDate } from '@/utils/formatters'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import { computed } from 'vue'

const router = useRouter()
const customerStore = useCustomerStore()

const props = defineProps<{
  sheet: ServiceSheet
}>()

const emit = defineEmits<{
  edit: [ServiceSheet]
  delete: [ServiceSheet]
}>()

const customerName = computed(() => {
  if (!props.sheet.customerId) return null
  const customer = customerStore.customers.find(c => c.id === props.sheet.customerId)
  return customer?.name
})

function handleViewServices(sheet: ServiceSheet) {
  router.push(`/services/${sheet.id}`)
}
</script>

<template>
  <Card>
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-medium text-gray-900">
          {{ sheet.name }}
          <Badge v-if="sheet.isDefault" variant="success" size="sm" class="ml-2">Default</Badge>
        </h3>
        <p v-if="sheet.description" class="mt-1 text-sm text-gray-500">
          {{ sheet.description }}
        </p>
        <p v-if="customerName" class="mt-2 text-sm text-gray-500">
          Cliente: {{ customerName }}
        </p>
        <p class="mt-2 text-sm text-gray-500">
          Servicios: {{ sheet.services.length }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Última actualización: {{ formatDate(sheet.updatedAt) }}
        </p>
      </div>
      <div class="flex space-x-2">
        <Button variant="secondary" size="sm" @click="handleViewServices(sheet)">
          Ver Servicios
        </Button>
        <Button 
          v-if="!sheet.isDefault" 
          variant="secondary" 
          size="sm" 
          @click="emit('edit', sheet)"
        >
          Editar
        </Button>
        <Button 
          v-if="!sheet.isDefault" 
          variant="danger" 
          size="sm" 
          @click="emit('delete', sheet)"
        >
          Eliminar
        </Button>
      </div>
    </div>
  </Card>
</template>