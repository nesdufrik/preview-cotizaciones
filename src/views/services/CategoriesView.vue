<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/types/service'
import CategoryList from '@/components/categories/CategoryList.vue'
import CategoryForm from '@/components/categories/CategoryForm.vue'
import { showNotification } from '@/utils/notifications'

const categoryStore = useCategoryStore()
const categories = ref<Category[]>([])
const isLoading = ref(true)
const showCategoryModal = ref(false)
const selectedCategory = ref<Category | undefined>()

onMounted(async () => {
  categories.value = categoryStore.categories
  isLoading.value = false
})

function handleNewCategory() {
  selectedCategory.value = undefined
  showCategoryModal.value = true
}

function handleEditCategory(category: Category) {
  selectedCategory.value = category
  showCategoryModal.value = true
}

function handleDeleteCategory(category: Category) {
  if (confirm('¿Está seguro de eliminar esta categoría?')) {
    categoryStore.deleteCategory(category.id)
    showNotification({
      title: 'Categoría eliminada',
      message: 'La categoría ha sido eliminada exitosamente',
      type: 'success'
    })
    categories.value = categoryStore.categories
  }
}

function handleCategorySaved(category: Category) {
  showCategoryModal.value = false
  showNotification({
    title: selectedCategory.value ? 'Categoría actualizada' : 'Categoría creada',
    message: `La categoría ha sido ${selectedCategory.value ? 'actualizada' : 'creada'} exitosamente`,
    type: 'success'
  })
  categories.value = categoryStore.categories
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Categorías de Servicios</h1>
      <Button @click="handleNewCategory">Nueva Categoría</Button>
    </div>

    <div class="mt-8">
      <CategoryList
        :categories="categories"
        :is-loading="isLoading"
        @edit="handleEditCategory"
        @delete="handleDeleteCategory"
      />
    </div>

    <Modal
      :show="showCategoryModal"
      :title="selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'"
      @close="showCategoryModal = false"
    >
      <CategoryForm
        :category="selectedCategory"
        @saved="handleCategorySaved"
        @cancelled="showCategoryModal = false"
      />
    </Modal>
  </div>
</template>