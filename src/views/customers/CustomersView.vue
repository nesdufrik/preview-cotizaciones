<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import type { Customer } from '@/types'
import CustomerList from '@/components/customers/CustomerList.vue'
import CustomerForm from '@/components/customers/CustomerForm.vue'

const customerStore = useCustomerStore()
const customers = ref<Customer[]>([])
const isLoading = ref(true)
const showCustomerModal = ref(false)
const selectedCustomer = ref<Customer | undefined>()

onMounted(async () => {
  customers.value = customerStore.customers
  isLoading.value = false
})

function handleNewCustomer() {
  selectedCustomer.value = undefined
  showCustomerModal.value = true
}

function handleEditCustomer(customer: Customer) {
  selectedCustomer.value = customer
  showCustomerModal.value = true
}

function handleDeleteCustomer(customer: Customer) {
  if (confirm('¿Está seguro de eliminar este cliente?')) {
    // Delete customer logic here
  }
}

function handleCustomerSaved() {
  showCustomerModal.value = false
  // Refresh customers list
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
      <Button @click="handleNewCustomer">Nuevo Cliente</Button>
    </div>

    <div class="mt-8">
      <CustomerList
        :customers="customers"
        :is-loading="isLoading"
        @edit="handleEditCustomer"
        @delete="handleDeleteCustomer"
      />
    </div>

    <Modal
      :show="showCustomerModal"
      :title="selectedCustomer ? 'Editar Cliente' : 'Nuevo Cliente'"
      @close="showCustomerModal = false"
    >
      <CustomerForm
        :customer="selectedCustomer"
        @saved="handleCustomerSaved"
        @cancelled="showCustomerModal = false"
      />
    </Modal>
  </div>
</template>