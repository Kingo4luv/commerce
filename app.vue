<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useStores } from '~/composables/useStores'

const { initializeStores } = useStores()

// Initialize stores on app startup
onMounted(async () => {
  await initializeStores()
})
</script>
