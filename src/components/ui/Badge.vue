<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'success' | 'warning' | 'error' | 'info'
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'info',
    size: 'md'
  }
)

const classes = computed(() => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium'
  
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm'
  }

  return [baseClasses, variantClasses[props.variant], sizeClasses[props.size]]
})
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>