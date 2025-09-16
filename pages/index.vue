<script setup lang="ts">
import { useSiteStore } from '~/stores/site'
import { useAsyncData, useNuxtApp } from 'nuxt/app'
import { computed } from 'vue'

const siteStore = useSiteStore()
const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }

// Fetch promotions for the carousel using $api
const { data: promoData } = await useAsyncData('promotions', async () => {
  const res = await $api('/promotions?type=web')
  return res.data
})

const images = computed(
  () =>
    promoData.value?.map((item: any) => ({
      name: item.name,
      url: item.banner,
      altText: item.name,
    })) || []
)

const curatedCategories = computed(() =>
  siteStore.getCategories
    .filter((item: any) => item.icon !== null)
    .map((category: any) => ({
      name: category.name,
      url: `/c/${category.slug}`,
      image: {
        url: category.icon,
        altText: category.name,
      },
    }))
)
</script>

<template>
  <TemplatesKlumpHome
    :autoplay="true"
    :interval="5000"
    :images="images"
    :items="curatedCategories"
  />
</template>
