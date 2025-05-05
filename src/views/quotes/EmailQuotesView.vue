<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEmailQuoteStore } from '@/stores/emailQuote'
import { useQuoteStore } from '@/stores/quote'
import { useServiceStore } from '@/stores/service'
import { useCategoryStore } from '@/stores/category'
import { useCustomerStore } from '@/stores/customer'
import type { EmailQuote, DetectedService } from '@/types/emailQuote'
import type { Quote, QuoteService } from '@/types/quote'
import type { Service } from '@/types/service'
import { QuoteStatus } from '@/types/quote'
import { formatDate, formatCurrency } from '@/utils/formatters'
import { showNotification } from '@/utils/notifications'

const router = useRouter()
const emailQuoteStore = useEmailQuoteStore()
const quoteStore = useQuoteStore()
const serviceStore = useServiceStore()
const categoryStore = useCategoryStore()
const customerStore = useCustomerStore()

const emailQuotes = ref<EmailQuote[]>([])
const selectedQuote = ref<EmailQuote | null>(null)
const showDetailsModal = ref(false)
const numberOfPeople = ref<number>(1)
const editingServiceIndex = ref<number | null>(null)
const showServiceSelector = ref(false)

// Servicios editables
const editableServices = ref<
  Array<
    DetectedService & {
      isCustom?: boolean
      isEditing?: boolean
    }
  >
>([])

const availableServices = computed(() =>
  serviceStore.services.filter(
    (service) =>
      !editableServices.value.some((s) => s.name.toLowerCase() === service.name.toLowerCase())
  )
)

onMounted(() => {
  emailQuotes.value = emailQuoteStore.emailQuotes
})

function handleViewDetails(quote: EmailQuote) {
  selectedQuote.value = quote
  // Clonar los servicios detectados para poder editarlos
  editableServices.value = JSON.parse(JSON.stringify(quote.detectedServices)).map(
    (service: DetectedService) => ({
      ...service,
      isEditing: false
    })
  )
  showDetailsModal.value = true
}

function handleAddService() {
  const newService = {
    name: '',
    description: '',
    suggestedPrice: 0,
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    confidence: 1,
    isCustom: true,
    isEditing: true
  }
  editableServices.value.push(newService)
  editingServiceIndex.value = editableServices.value.length - 1
}

function handleEditService(index: number) {
  editableServices.value[index].isEditing = true
  editingServiceIndex.value = index
}

function handleSaveService(index: number) {
  editableServices.value[index].isEditing = false
  editingServiceIndex.value = null
}

function handleRemoveService(index: number) {
  if (confirm('¿Está seguro de eliminar este servicio?')) {
    editableServices.value.splice(index, 1)
    editingServiceIndex.value = null
  }
}

function handleAddToServices(index: number) {
  const service = editableServices.value[index]
  showServiceSelector.value = true

  // Get default category or first available
  const defaultCategory = categoryStore.categories[0]
  if (!defaultCategory) {
    showNotification({
      title: 'Error',
      message: 'No hay categorías disponibles',
      type: 'error'
    })
    return
  }

  // Crear nuevo servicio en el catálogo
  const newService: Service = {
    id: crypto.randomUUID(),
    name: service.name,
    category: defaultCategory.name,
    location: '',
    basePrice: service.suggestedPrice || 0,
    description: service.description || '',
    lastUpdated: new Date()
  }

  serviceStore.addService(newService)
  showNotification({
    title: 'Servicio agregado',
    message: 'El servicio ha sido agregado al catálogo exitosamente',
    type: 'success'
  })
}

function handleCreateQuote() {
  if (editableServices.value.length === 0) {
    showNotification({
      title: 'Error',
      message: 'Debe agregar al menos un servicio',
      type: 'error'
    })
    return
  }

  // Convertir los servicios editados a servicios de cotización
  const quoteServices: QuoteService[] = editableServices.value.map((service) => {
    // Buscar el servicio correspondiente en nuestro catálogo
    const catalogService = serviceStore.services.find(
      (s) => s.name.toLowerCase() === service.name.toLowerCase()
    )

    // Si no existe el servicio en el catálogo, lo creamos
    let serviceId: string
    if (!catalogService && service.isCustom) {
      const defaultCategory = categoryStore.categories[0]
      if (!defaultCategory) {
        throw new Error('No hay categorías disponibles')
      }

      const newService: Service = {
        id: crypto.randomUUID(),
        name: service.name,
        category: defaultCategory.name,
        location: '',
        basePrice: service.suggestedPrice || 0,
        description: service.description || '',
        lastUpdated: new Date()
      }
      serviceStore.addService(newService)
      serviceId = newService.id
    } else if (!catalogService) {
      throw new Error(`Servicio no encontrado: ${service.name}`)
    } else {
      serviceId = catalogService.id
    }

    return {
      serviceId,
      quantity: service.quantity || 1,
      price: service.suggestedPrice || 0,
      date: service.date ? new Date(service.date) : new Date()
    }
  })

  // Calcular el total
  const total = quoteServices.reduce((sum, service) => sum + service.price * service.quantity, 0)

  // Crear la nueva cotización
  const newQuote: Quote = {
    id: crypto.randomUUID(),
    customerId: '', // Se asignará después
    services: quoteServices,
    status: QuoteStatus.DRAFT,
    total,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  // Guardar la cotización
  quoteStore.addQuote(newQuote)

  // Actualizar el estado del email
  if (selectedQuote.value) {
    emailQuoteStore.updateEmailQuoteStatus(selectedQuote.value.id, 'processed')
  }

  showNotification({
    title: 'Cotización creada',
    message: 'La cotización se ha creado exitosamente',
    type: 'success'
  })

  router.push('/quotes')
}

function handleIgnoreQuote(quote: EmailQuote) {
  if (confirm('¿Está seguro de ignorar esta cotización?')) {
    emailQuoteStore.updateEmailQuoteStatus(quote.id, 'ignored')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Cotizaciones desde Correos</h1>
    </div>

    <div class="mt-8">
      <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                Asunto
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Remitente
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Fecha
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Servicios Detectados
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Estado
              </th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="quote in emailQuotes" :key="quote.id">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                {{ quote.subject }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ quote.sender }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ formatDate(quote.receivedAt) }}
              </td>
              <td class="px-3 py-4 text-sm text-gray-500">
                {{ quote.detectedServices.length }} servicios
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <Badge
                  :variant="
                    quote.status === 'processed'
                      ? 'success'
                      : quote.status === 'ignored'
                      ? 'error'
                      : 'warning'
                  "
                >
                  {{
                    quote.status === 'processed'
                      ? 'Procesado'
                      : quote.status === 'ignored'
                      ? 'Ignorado'
                      : 'Pendiente'
                  }}
                </Badge>
              </td>
              <td
                class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
              >
                <div class="flex justify-end space-x-2">
                  <Button variant="secondary" size="sm" @click="handleViewDetails(quote)">
                    Ver Detalles
                  </Button>
                  <Button
                    v-if="quote.status === 'pending'"
                    variant="danger"
                    size="sm"
                    @click="handleIgnoreQuote(quote)"
                  >
                    Ignorar
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de detalles -->
    <Modal
      :show="showDetailsModal"
      title="Detalles de la Cotización"
      @close="showDetailsModal = false"
    >
      <div v-if="selectedQuote" class="space-y-6">
        <!-- Correo original -->
        <div>
          <h3 class="text-sm font-medium text-gray-700">Correo Original</h3>
          <div
            class="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200"
            v-html="selectedQuote.originalHtml"
          ></div>
        </div>

        <!-- Cantidad de personas -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Cantidad de personas</label>
          <input
            v-model.number="numberOfPeople"
            type="number"
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <!-- Servicios -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-medium text-gray-700">Servicios</h3>
            <Button variant="secondary" size="sm" @click="handleAddService">
              Agregar otro servicio
            </Button>
          </div>

          <!-- Lista de servicios -->
          <div class="space-y-4">
            <div
              v-for="(service, index) in editableServices"
              :key="index"
              class="p-4 border border-gray-200 rounded-lg relative"
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex-grow">
                    <label class="block text-sm font-medium text-gray-700">Fecha</label>
                    <input
                      v-model="service.date"
                      type="date"
                      :disabled="!service.isEditing"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                    />
                  </div>
                  <div class="flex space-x-2 ml-4">
                    <button
                      v-if="!service.isEditing"
                      type="button"
                      class="text-gray-400 hover:text-gray-500"
                      @click="handleEditService(index)"
                    >
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      v-else
                      type="button"
                      class="text-green-600 hover:text-green-700"
                      @click="handleSaveService(index)"
                    >
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="text-gray-400 hover:text-gray-500"
                      @click="handleRemoveService(index)"
                    >
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    v-model="service.name"
                    type="text"
                    :disabled="!service.isEditing"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Descripción</label>
                  <input
                    v-model="service.description"
                    type="text"
                    :disabled="!service.isEditing"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Precio</label>
                  <input
                    v-model.number="service.suggestedPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    :disabled="!service.isEditing"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>

                <!-- Botón para agregar a servicios -->
                <div
                  v-if="!availableServices.some((s) => s.name === service.name)"
                  class="flex justify-end"
                >
                  <Button variant="secondary" size="sm" @click="handleAddToServices(index)">
                    Agregar a servicios
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" @click="showDetailsModal = false"> Cancelar </Button>
          <Button
            variant="primary"
            :disabled="editableServices.length === 0"
            @click="handleCreateQuote"
          >
            Crear Cotización
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
