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

// Initialize stores on app startup (categories are now loaded in layouts)
onMounted(async () => {
  // Only load cart and location, categories are loaded in layouts
  const { checkoutStore, siteStore } = useStores()
  checkoutStore.loadCartFromStorage()
  
  if (process.client && typeof window !== 'undefined') {
    const storedLocation = window.localStorage.getItem('userLocation')
    if (storedLocation) {
      try {
        const userLocation = JSON.parse(storedLocation)
        siteStore.updateUserLocation(userLocation)
      } catch {
        // Error loading user location from storage
      }
    }
  }
})
</script>
