<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuoteStore } from '@/stores/quote'
import type { Quote } from '@/types'
import QuoteList from '@/components/quotes/QuoteList.vue'
import QuoteForm from '@/components/quotes/QuoteForm.vue'
import { showNotification } from '@/utils/notifications'

const quoteStore = useQuoteStore()
const quotes = ref<Quote[]>([])
const isLoading = ref(true)
const showQuoteModal = ref(false)
const selectedQuote = ref<Quote | undefined>()

onMounted(async () => {
  quotes.value = quoteStore.quotes
  isLoading.value = false
})

function handleNewQuote() {
  selectedQuote.value = undefined
  showQuoteModal.value = true
}

function handleEditQuote(quote: Quote) {
  selectedQuote.value = quote
  showQuoteModal.value = true
}

function handleDeleteQuote(quote: Quote) {
  if (confirm('¿Está seguro de eliminar esta cotización?')) {
    // Delete quote logic here
    showNotification({
      title: 'Cotización eliminada',
      message: 'La cotización ha sido eliminada exitosamente',
      type: 'success'
    })
  }
}

function handleQuoteSaved(quote: Quote) {
  showQuoteModal.value = false
  showNotification({
    title: selectedQuote.value ? 'Cotización actualizada' : 'Cotización creada',
    message: `La cotización ha sido ${selectedQuote.value ? 'actualizada' : 'creada'} exitosamente`,
    type: 'success'
  })
  // Refresh quotes list
  quotes.value = quoteStore.quotes
}

function handleStatusChanged(quote: Quote) {
  // Actualizar la lista de cotizaciones
  const index = quotes.value.findIndex(q => q.id === quote.id)
  if (index !== -1) {
    quotes.value[index] = quote
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Cotizaciones</h1>
      <Button @click="handleNewQuote">Nueva Cotización</Button>
    </div>

    <div class="mt-8">
      <QuoteList
        :quotes="quotes"
        :is-loading="isLoading"
        @edit="handleEditQuote"
        @delete="handleDeleteQuote"
        @status-changed="handleStatusChanged"
      />
    </div>

    <Modal
      :show="showQuoteModal"
      :title="selectedQuote ? 'Editar Cotización' : 'Nueva Cotización'"
      @close="showQuoteModal = false"
    >
      <QuoteForm
        :quote="selectedQuote"
        @saved="handleQuoteSaved"
        @cancelled="showQuoteModal = false"
      />
    </Modal>
  </div>
</template>