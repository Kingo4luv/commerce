<script setup lang="ts">
/**
 * Merchants listing page - displays all merchants
 * Migrated from Nuxt 2 to Nuxt 3 with Composition API
 */

// Types
interface Merchant {
  id: string | number
  business_name: string
  slug: string
  logo?: string
  [key: string]: any
}

// Get API
const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }

// Reactive data
const merchants = ref<Merchant[]>([])

// Initial data fetch using useAsyncData
const { data: initialData } = await useAsyncData(
  'merchants-directory',
  async () => {
    try {
      const data = await $api('merchants/directory?hasProduct=true&limit=100')

      return data.data
    } catch (error: any) {
      return []
    }
  },
  {
    default: () => [],
  }
)

// Set initial data
if (initialData.value) {
  merchants.value = initialData.value
}
</script>

<template>
  <div>
    <TemplatesKlumpMerchants :merchants="merchants" />
  </div>
</template>
