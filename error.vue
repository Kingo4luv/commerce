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
            d="M7.5 0C3.35813 0 0 3.35813 0 7.5C0 11.6419 3.35813 15 7.5 15C11.6419 15 15 11.6419 15 7.5C15 3.35813 11.6419 0 7.5 0ZM7.5 12.2875C6.91375 12.2875 6.5125 11.8356 6.5125 11.25C6.5125 10.6475 6.93062 10.2125 7.5 10.2125C8.10188 10.2125 8.4875 10.6475 8.4875 11.25C8.4875 11.8363 8.10188 12.2875 7.5 12.2875ZM7.88875 8.32563C7.73937 8.835 7.26875 8.84375 7.11187 8.32563C7.93125 7.72813 7.28937 5.46 7.28937 3.98688C7.28937 2.04313 8.72125 2.03375 8.72125 3.98688C8.72062 5.46875 8.04437 7.79563 7.88875 8.32563Z"
            fill="#EAD80F"
          />
        </svg>
      </span>
      <span>PRICES ON OUR WEBSITE MAY VARY DUE TO USD EXCHANGE RATE CHANGES.</span>
    </div>
    <OrganismsKlumpHeader :nav-links="navLinks" />
    <div class="py-16 lg:py-32 w-full flex flex-col justify-center items-center space-y-4 px-4 xl:px-0">
      <h1 class="text-4xl lg:text-7xl font-bold text-primary tracking-wider">Oops!</h1>
      <h3 class="text-xl lg:text-3xl font-semibold uppercase">{{ error.statusCode }} - This page could not be found</h3>
      <p class="max-w-2xl text-center text-sm lg:text-base text-black">
        The page you are looking might have been removed or have it name changed. Kindly confirm with the merchant to get
        a valid link
      </p>
      <div class="pt-3 w-full max-w-xs">
        <AtomsKlumpButton
          type="primary"
          radius="all"
          href="/"
          weight="normal"
          >Continue Shopping</AtomsKlumpButton
        >
      </div>
    </div>
    <MoleculesKlumpLocationModal v-if="siteStore.getLocationModalIsOpen" />
    <OrganismsKlumpFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from 'nuxt/app'
import { useSiteStore } from '~/stores/site'
import { useCheckoutStore } from '~/stores/checkout'

const props = defineProps<{ error: { statusCode: number; message: string } }>()

const siteStore = useSiteStore()
const checkoutStore = useCheckoutStore()

// Ensure categories are loaded during SSR
await siteStore.fetchCategories()

const navLinks = computed(() =>
  siteStore.getCategories.map((cat: any) => ({
    name: cat.name,
    slug: cat.slug,
    sub_categories: Array.isArray(cat.sub_categories)
      ? cat.sub_categories.map((sub: any) => ({ name: sub.name, slug: sub.slug }))
      : [],
  }))
)

useHead({
  title: 'Klump Commerce - 404 - Page not found',
  meta: [
    {
      name: 'description',
      content:
        'The page you are looking might have been removed or have its name changed. Kindly confirm with the merchant to get a valid link',
    },
  ],
})
</script>
