<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Quote, Settlement, AdditionalCharge } from '@/types'
import { useSettlementStore } from '@/stores/settlement'
import { useServiceStore } from '@/stores/service'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps<{
  quote: Quote
}>()

const emit = defineEmits<{
  saved: [Settlement]
  cancelled: []
}>()

const settlementStore = useSettlementStore()
const serviceStore = useServiceStore()

const form = ref({
  services: props.quote.services.map(service => ({
    ...service,
    actualPrice: service.price,
    notes: ''
  })),
  additionalCharges: [] as AdditionalCharge[]
})

const servicesWithDetails = computed(() => {
  return form.value.services.map(service => {
    const serviceDetails = serviceStore.services.find(s => s.id === service.serviceId)
    return {
      ...service,
      name: serviceDetails?.name || 'Servicio no encontrado'
    }
  })
})

const total = computed(() => {
  const servicesTotal = form.value.services.reduce((sum, service) => {
    return sum + ((service.actualPrice || service.price) * service.quantity)
  }, 0)
  
  const additionalChargesTotal = form.value.additionalCharges.reduce((sum, charge) => {
    return sum + charge.amount
  }, 0)

  return servicesTotal + additionalChargesTotal
})

function addAdditionalCharge() {
  form.value.additionalCharges.push({
    id: crypto.randomUUID(),
    description: '',
    amount: 0
  })
}

function removeAdditionalCharge(index: number) {
  form.value.additionalCharges.splice(index, 1)
}

async function handleSubmit() {
  const settlementData: Settlement = {
    id: crypto.randomUUID(),
    quoteId: props.quote.id,
    customerId: props.quote.customerId,
    services: form.value.services,
    additionalCharges: form.value.additionalCharges,
    total: total.value,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  settlementStore.addSettlement(settlementData)
  emit('saved', settlementData)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <h3 class="text-lg font-medium text-gray-900">Servicios</h3>
      <div class="mt-4 space-y-4">
        <div v-for="service in servicesWithDetails" :key="service.serviceId" class="space-y-2">
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Servicio</label>
              <input
                type="text"
                :value="service.name"
                disabled
                class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>
            <div class="w-32">
              <label class="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                v-model.number="service.quantity"
                class="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div class="w-32">
              <label class="block text-sm font-medium text-gray-700">Precio Real</label>
              <input
                type="number"
                v-model.number="service.actualPrice"
                class="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              v-model="service.notes"
              rows="2"
              class="mt-1 block w-full rounded-md border-gray-300"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Cargos Adicionales</h3>
        <Button variant="secondary" size="sm" @click="addAdditionalCharge">
          Agregar Cargo
        </Button>
      </div>
      <div class="mt-4 space-y-4">
        <div
          v-for="(charge, index) in form.additionalCharges"
          :key="charge.id"
          class="flex gap-4 items-start"
        >
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              v-model="charge.description"
              class="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>
          <div class="w-32">
            <label class="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              v-model.number="charge.amount"
              class="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>
          <Button
            variant="danger"
            size="sm"
            class="mt-6"
            @click="removeAdditionalCharge(index)"
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t">
      <div class="text-lg font-medium">Total: {{ formatCurrency(total) }}</div>
      <div class="flex gap-3">
        <Button variant="secondary" @click="emit('cancelled')">Cancelar</Button>
        <Button type="submit">Generar Liquidación</Button>
      </div>
    </div>
  </form>
</template>