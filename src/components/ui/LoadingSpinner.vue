<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div
    class="inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    :class="{
      'h-4 w-4': size === 'sm',
      'h-8 w-8': size === 'md' || !size,
      'h-12 w-12': size === 'lg'
    }"
    role="status"
  >
    <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Cargando...
    </span>
  </div>
</template>