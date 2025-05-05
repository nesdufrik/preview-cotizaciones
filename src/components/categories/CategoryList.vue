<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@/types/service'

const props = defineProps<{
  categories: Category[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  edit: [Category]
  delete: [Category]
}>()

const tableHeaders = computed(() => [
  { key: 'name', label: 'Nombre', class: 'pl-4 pr-3 sm:pl-6' },
  { key: 'description', label: 'Descripción' }
])
</script>

<template>
  <Table :headers="tableHeaders">
    <template #header-actions>
      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
        <span class="sr-only">Acciones</span>
      </th>
    </template>

    <tr v-if="isLoading">
      <td colspan="3" class="text-center py-4">
        <LoadingSpinner size="sm" />
      </td>
    </tr>
    <tr v-else-if="categories.length === 0">
      <td colspan="3" class="text-center py-4 text-muted-foreground">
        No hay categorías registradas
      </td>
    </tr>

    <tr v-for="category in categories" :key="category.id">
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
        {{ category.name }}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
        {{ category.description }}
      </td>
      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <Button variant="secondary" size="sm" class="mr-2" @click="emit('edit', category)">
          Editar
        </Button>
        <Button variant="danger" size="sm" @click="emit('delete', category)"> Eliminar </Button>
      </td>
    </tr>
  </Table>
</template>
