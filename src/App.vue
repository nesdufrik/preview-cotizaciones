<script setup lang="ts">
import AppSidebar from './components/layout/AppSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppSidebar>
      <main class="p-4">
        <RouterView />
      </main>
    </AppSidebar>
  </div>
</template>

<style>
@import './style.css';
</style>
