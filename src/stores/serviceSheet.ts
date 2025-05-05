import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ServiceSheet, Service } from '@/types'
import { mockServices } from '@/services/mockData'

export const useServiceSheetStore = defineStore('serviceSheet', () => {
  // Initialize with default sheet
  const defaultSheet: ServiceSheet = {
    id: crypto.randomUUID(),
    name: 'Hoja de Servicios Default',
    description: 'Hoja de servicios predeterminada del sistema',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    services: mockServices.map((service) => ({
      ...service,
      sheetId: crypto.randomUUID()
    }))
  }

  const sheets = ref<ServiceSheet[]>([defaultSheet])

  function addSheet(sheet: ServiceSheet) {
    sheets.value.push(sheet)
  }

  function updateSheet(id: string, sheet: Partial<ServiceSheet>) {
    const index = sheets.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      sheets.value[index] = {
        ...sheets.value[index],
        ...sheet,
        updatedAt: new Date()
      }
    }
  }

  function deleteSheet(id: string) {
    const index = sheets.value.findIndex((s) => s.id === id)
    if (index !== -1 && !sheets.value[index].isDefault) {
      sheets.value.splice(index, 1)
    }
  }

  function getSheetById(id: string) {
    return sheets.value.find((s) => s.id === id)
  }

  function addServiceToSheet(sheetId: string, service: Service) {
    const sheet = sheets.value.find((s) => s.id === sheetId)
    if (sheet) {
      sheet.services.push({ ...service, sheetId })
      sheet.updatedAt = new Date()
    }
  }

  function updateServiceInSheet(sheetId: string, serviceId: string, service: Partial<Service>) {
    const sheet = sheets.value.find((s) => s.id === sheetId)
    if (sheet) {
      const index = sheet.services.findIndex((s) => s.id === serviceId)
      if (index !== -1) {
        sheet.services[index] = { ...sheet.services[index], ...service }
        sheet.updatedAt = new Date()
      }
    }
  }

  function deleteServiceFromSheet(sheetId: string, serviceId: string) {
    const sheet = sheets.value.find((s) => s.id === sheetId)
    if (sheet) {
      sheet.services = sheet.services.filter((s) => s.id !== serviceId)
      sheet.updatedAt = new Date()
    }
  }

  function getDefaultSheet() {
    return sheets.value.find((sheet) => sheet.isDefault)
  }

  return {
    sheets,
    addSheet,
    updateSheet,
    deleteSheet,
    getSheetById,
    addServiceToSheet,
    updateServiceInSheet,
    deleteServiceFromSheet,
    getDefaultSheet
  }
})
