<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div
    class="bg-card text-card-foreground shadow-sm rounded-lg overflow-hidden border border-border"
  >
    <div v-if="title" class="px-4 py-5 sm:px-6 border-b border-border">
      <h3 class="text-lg font-medium">{{ title }}</h3>
    </div>
    <div class="px-4 py-5 sm:p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-4 py-4 sm:px-6 bg-muted border-t border-border">
      <slot name="footer" />
    </div>
  </div>
</template>
