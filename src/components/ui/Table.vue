<script setup lang="ts">
defineProps<{
  headers: Array<{
    key: string
    label: string
    class?: string
  }>
}>()
</script>

<template>
  <div class="overflow-hidden shadow-sm border border-border rounded-lg">
    <table class="min-w-full divide-y divide-border">
      <thead class="bg-muted">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            scope="col"
            :class="[
              'py-3.5 text-left text-sm font-semibold text-foreground',
              header.class || 'px-3'
            ]"
          >
            {{ header.label }}
          </th>
          <slot name="header-actions" />
        </tr>
      </thead>
      <tbody class="divide-y divide-border bg-background">
        <slot />
      </tbody>
    </table>
  </div>
</template>
