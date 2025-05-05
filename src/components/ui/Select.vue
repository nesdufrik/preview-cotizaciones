<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label?: string
  error?: string
  required?: boolean
}>()

defineEmits<{
  'update:modelValue': [string | number]
}>()
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :value="modelValue"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      :class="{ 'border-red-300': error }"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>