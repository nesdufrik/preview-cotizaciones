<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Quote } from '@/types'
import { QuoteStatus, QUOTE_STATUS_LABELS } from '@/types/quote'
import { useQuoteStore } from '@/stores/quote'
import { showNotification } from '@/utils/notifications'
import { getStatusVariant, getStatusButtonVariant, getStatusActionLabel } from '@/utils/quoteStatus'

const props = defineProps<{
  quote: Quote
}>()

const emit = defineEmits<{
  statusChanged: [Quote]
}>()

const quoteStore = useQuoteStore()
const isLoading = ref(false)

const statusTransitions = {
  [QuoteStatus.DRAFT]: [QuoteStatus.SENT],
  [QuoteStatus.SENT]: [QuoteStatus.APPROVED, QuoteStatus.REJECTED],
  [QuoteStatus.APPROVED]: [],
  [QuoteStatus.REJECTED]: [QuoteStatus.DRAFT]
}

const availableTransitions = computed(() => 
  statusTransitions[props.quote.status as QuoteStatus] || []
)

async function handleStatusChange(newStatus: QuoteStatus) {
  if (!confirm(`¿Está seguro de cambiar el estado a ${QUOTE_STATUS_LABELS[newStatus]}?`)) {
    return
  }

  isLoading.value = true
  try {
    const updatedQuote: Quote = {
      ...props.quote,
      status: newStatus,
      updatedAt: new Date()
    }

    quoteStore.updateQuote(props.quote.id, updatedQuote)
    
    showNotification({
      title: 'Estado actualizado',
      message: `La cotización ha sido ${QUOTE_STATUS_LABELS[newStatus].toLowerCase()} exitosamente`,
      type: 'success'
    })

    emit('statusChanged', updatedQuote)
  } catch (error) {
    showNotification({
      title: 'Error',
      message: 'No se pudo actualizar el estado de la cotización',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center space-x-4">
    <Badge :variant="getStatusVariant(quote.status)">
      {{ QUOTE_STATUS_LABELS[quote.status] }}
    </Badge>

    <div v-if="availableTransitions.length > 0" class="flex space-x-2">
      <Button
        v-for="status in availableTransitions"
        :key="status"
        :variant="getStatusButtonVariant(status)"
        size="sm"
        :disabled="isLoading"
        @click="handleStatusChange(status)"
      >
        {{ getStatusActionLabel(status) }}
      </Button>
    </div>
  </div>
</template>