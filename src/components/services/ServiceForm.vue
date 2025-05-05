<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Service } from '@/types/service'
import { useServiceStore } from '@/stores/service'
import { useCategoryStore } from '@/stores/category'
import { useForm } from '@/composables/useForm'
import { serviceSchema } from '@/types/service'

const props = defineProps<{
  service?: Service
  sheetId: string
}>()

const emit = defineEmits<{
  saved: [Service]
  cancelled: []
}>()

const serviceStore = useServiceStore()
const categoryStore = useCategoryStore()

const { data, errors, handleSubmit } = useForm<Service>(serviceSchema, {
  id: props.service?.id || crypto.randomUUID(),
  name: props.service?.name || '',
  category: props.service?.category || '',
  location: props.service?.location || '',
  basePrice: props.service?.basePrice || 0,
  description: props.service?.description || '',
  lastUpdated: new Date(),
  sheetId: props.sheetId
})

const categories = computed(() => categoryStore.categories)

async function onSubmit() {
  const serviceData = data.value as Service

  if (props.service) {
    serviceStore.updateService(props.service.id, serviceData)
  } else {
    serviceStore.addService(serviceData)
  }

  emit('saved', serviceData)
}
</script>

<template>
  <form @submit.prevent="() => handleSubmit(onSubmit)" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
      <input
        id="name"
        v-model="data.name"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'border-red-300': errors.name }"
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>

    <div>
      <label for="category" class="block text-sm font-medium text-gray-700">Categoría</label>
      <select
        id="category"
        v-model="data.category"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'border-red-300': errors.category }"
      >
        <option value="">Seleccione una categoría</option>
        <option v-for="category in categories" :key="category.id" :value="category.name">
          {{ category.name }}
        </option>
      </select>
      <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
    </div>

    <div>
      <label for="location" class="block text-sm font-medium text-gray-700">Ubicación</label>
      <input
        id="location"
        v-model="data.location"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'border-red-300': errors.location }"
      />
      <p v-if="errors.location" class="mt-1 text-sm text-red-600">{{ errors.location }}</p>
    </div>

    <div>
      <label for="basePrice" class="block text-sm font-medium text-gray-700">Precio Base</label>
      <input
        id="basePrice"
        v-model.number="data.basePrice"
        type="number"
        min="0"
        step="0.01"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'border-red-300': errors.basePrice }"
      />
      <p v-if="errors.basePrice" class="mt-1 text-sm text-red-600">{{ errors.basePrice }}</p>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea
        id="description"
        v-model="data.description"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'border-red-300': errors.description }"
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
    </div>

    <div class="flex justify-end space-x-3">
      <Button variant="secondary" @click="emit('cancelled')">Cancelar</Button>
      <Button type="submit">Guardar</Button>
    </div>
  </form>
</template>