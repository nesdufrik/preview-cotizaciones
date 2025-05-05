<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '@/types/service'
import { useCategoryStore } from '@/stores/category'
import { useForm } from '@/composables/useForm'
import { categorySchema } from '@/types/service'

const props = defineProps<{
  category?: Category
}>()

const emit = defineEmits<{
  saved: [Category]
  cancelled: []
}>()

const categoryStore = useCategoryStore()

const { data, errors, handleSubmit } = useForm<Category>(categorySchema, {
  id: props.category?.id || crypto.randomUUID(),
  name: props.category?.name || '',
  description: props.category?.description || '',
  createdAt: props.category?.createdAt || new Date(),
  updatedAt: new Date()
})

async function onSubmit() {
  const categoryData = data.value as Category

  if (props.category) {
    categoryStore.updateCategory(props.category.id, categoryData)
  } else {
    categoryStore.addCategory(categoryData)
  }

  emit('saved', categoryData)
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