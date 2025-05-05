<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false
  }
)

const classes = computed(() => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200'

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    danger:
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.disabled && 'opacity-50 cursor-not-allowed'
  ]
})
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
