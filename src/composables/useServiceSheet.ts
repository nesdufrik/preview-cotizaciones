import { ref } from 'vue'
import type { ServiceSheet } from '@/types/serviceSheet'
import { useServiceSheetStore } from '@/stores/serviceSheet'
import { useForm } from './useForm'
import { serviceSheetSchema } from '@/types/serviceSheet'

export function useServiceSheet(initialSheet?: ServiceSheet) {
  const serviceSheetStore = useServiceSheetStore()
  
  const defaultData = {
    id: initialSheet?.id || crypto.randomUUID(),
    name: initialSheet?.name || '',
    description: initialSheet?.description || '',
    customerId: initialSheet?.customerId || null,
    isDefault: false,
    services: initialSheet?.services || [],
    createdAt: initialSheet?.createdAt || new Date(),
    updatedAt: new Date()
  }

  const { 
    data, 
    errors, 
    handleSubmit, 
    setData,
    validate 
  } = useForm<ServiceSheet>(serviceSheetSchema, defaultData)

  async function saveServiceSheet() {
    try {
      const sheetData = data.value as ServiceSheet
      
      if (initialSheet) {
        await serviceSheetStore.updateSheet(initialSheet.id, sheetData)
      } else {
        await serviceSheetStore.addSheet(sheetData)
      }
      
      return sheetData
    } catch (error) {
      console.error('Error al guardar la hoja:', error)
      throw error
    }
  }

  return {
    data,
    errors,
    handleSubmit,
    setData,
    validate,
    saveServiceSheet
  }
}