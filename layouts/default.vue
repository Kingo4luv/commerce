<template>
  <div>
    <MoleculesKlumpNotification
      v-if="checkoutStore.getNotification.message !== '' && checkoutStore.getNotification.type !== null"
      :message="checkoutStore.getNotification.message"
      :visible="checkoutStore.getNotification.message !== '' && checkoutStore.getNotification.type !== null"
      :type="checkoutStore.getNotification.type"
    />
    <div
      class="w-full bg-red-700 text-[#EAD80F] text-center flex justify-center items-start lg:items-center py-3 px-4 text-sm lg:text-base font-bold space-x-1 lg:space-x-3"
    >
      <span class="mt-1 lg:mt-0">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 0C3.35813 0 0 3.35813 0 7.5C0 11.6419 3.35813 15 7.5 15C11.6419 15 15 11.6419 15 7.5C15 3.35813 11.6419 0 7.5 0ZM7.5 12.2875C6.91375 12.2875 6.5125 11.8356 6.5125 11.25C6.5125 10.6475 6.93062 10.2125 7.5 10.2125C8.10188 10.2125 8.4875 10.6475 8.4875 11.25C8.4875 11.8363 8.10188 12.2875 7.5 12.2875ZM7.88875 8.32563C7.73937 8.835 7.26875 8.84375 7.11187 8.32563C6.93125 7.72813 6.28937 5.46 6.28937 3.98688C6.28937 2.04313 8.72125 2.03375 8.72125 3.98688C8.72062 5.46875 8.04437 7.79563 7.88875 8.32563Z"
            fill="#EAD80F"
          />
        </svg>
      </span>
      <span>PRICES ON OUR WEBSITE MAY VARY DUE TO USD EXCHANGE RATE CHANGES.</span>
    </div>
    <OrganismsKlumpHeader :nav-links="navLinks" />
    <slot />
    <MoleculesKlumpLocationModal v-if="siteStore.getLocationModalIsOpen" />
    <OrganismsKlumpFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useSiteStore } from '~/stores/site'
import { useCheckoutStore } from '~/stores/checkout'

const siteStore = useSiteStore()
const checkoutStore = useCheckoutStore()

const navLinks = computed(() =>
  siteStore.getCategories.map((cat: any) => ({
    name: cat.name,
    slug: cat.slug,
    sub_categories: Array.isArray(cat.sub_categories)
      ? cat.sub_categories.map((sub: any) => ({ name: sub.name, slug: sub.slug }))
      : [],
  }))
)

onMounted(() => {
  checkoutStore.loadCartFromStorage()
  if (process.client) {
    const storedLocation = localStorage.getItem('userLocation')
    if (storedLocation) {
      try {
        const userLocation = JSON.parse(storedLocation)
        siteStore.updateUserLocation(userLocation)
      } catch (error) {
        // Error loading user location from storage
      }
    }
  }
})
</script>
