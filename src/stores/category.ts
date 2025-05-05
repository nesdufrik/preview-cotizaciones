import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types/service'
import { mockCategories } from '@/services/mockData'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>(mockCategories)
  
  function addCategory(category: Category) {
    categories.value.push(category)
  }

  function updateCategory(id: string, category: Partial<Category>) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { 
        ...categories.value[index], 
        ...category,
        updatedAt: new Date()
      }
    }
  }

  function deleteCategory(id: string) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
  }

  function getCategoryByName(name: string): Category | undefined {
    return categories.value.find(c => c.name.toLowerCase() === name.toLowerCase())
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryByName
  }
})