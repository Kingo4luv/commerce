<script setup lang="ts">
/** This is the header component */

interface NavLink {
  name: string
  slug: string
  sub_categories: {
    name: string
    slug: string
  }[]
}

interface Props {
  /** This is the array of nav links */
  navLinks: NavLink[]
}

const props = withDefaults(defineProps<Props>(), {
  navLinks: () => [],
})

// Reactive state
const showNavDrawer = ref(false)
const openCheckout = ref(false)
const currentNav = ref<string[]>([])
const searchResults = ref<any[]>([])
const debounce = ref<NodeJS.Timeout | null>(null)
const searchDropdown = ref<HTMLElement | null>(null)

// Get route information
const route = useRoute()
const router = useRouter()
const searchTerm = ref((route.query.q as string) || '')

import { useCheckoutStore } from '~/stores/checkout'
import { useNuxtApp } from 'nuxt/app'
import { onClickOutside } from '@vueuse/core'

const checkoutStore = useCheckoutStore()
const cart = computed(() => checkoutStore.getCart)

const cartAllItemsQuantity = computed(() => {
  return cart.value.map(item => item.quantity).reduce((a, b) => a + b, 0)
})

const toggleNavDrawer = () => {
  showNavDrawer.value = !showNavDrawer.value
}

const toggleCheckout = () => {
  openCheckout.value = !openCheckout.value
}

const close = () => {
  showNavDrawer.value = false
}

const closeCheckout = () => {
  openCheckout.value = false
}

const setCurrentNav = (nav: string) => {
  if (!currentNav.value.includes(nav)) {
    currentNav.value.push(nav)
  } else {
    currentNav.value = currentNav.value.filter(link => nav !== link)
  }
}

const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }

const search = () => {
  if (debounce.value) {
    clearTimeout(debounce.value)
  }

  debounce.value = setTimeout(async () => {
    if (searchTerm.value.length > 0) {
      try {
        const data = await $api(`/products/?query=${searchTerm.value}`)
        searchResults.value = data.data
      } catch (error) {
        searchResults.value = []
      }
    } else {
      searchResults.value = []
    }
  }, 500)
}

const clearSearch = () => {
  searchResults.value = []
}

// Close search dropdown when clicking outside
onClickOutside(searchDropdown, () => {
  if (searchResults.value.length > 0) {
    searchResults.value = []
  }
})

const handleSearch = () => {
  // Navigate to search page

  if (searchTerm.value && searchTerm.value.trim()) {
    // Try router.push first, fallback to window.location
    try {
      router.push(`/search?q=${encodeURIComponent(searchTerm.value.trim())}`)
    } catch (error) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.value.trim())}`
    }
  }
}
</script>

<template>
  <header class="w-full space-y-4">
    <div class="max-w-screen-xl mx-auto flex items-center justify-between space-x-6 pt-8 px-4">
      <div
        class="w-full flex flex-col lg:flex-row justify-between lg:space-x-6 space-y-3 md:space-y-4 lg:space-y-0 max-w-[1090px]"
      >
        <div class="w-full lg:w-auto flex justify-between items-center">
          <a
            href="/"
            class="logo"
          >
            <KlumpLogo />
            <span class="sr-only">Klump Logo</span>
          </a>
          <div class="flex lg:hidden space-x-2 items-center">
            <AtomsKlumpButton
              id="cartIcon"
              override-styles="relative flex  lg:hidden "
              @clicked="toggleCheckout"
            >
              <span class="absolute -top-1 -right-1 text-xs bg-red-400 text-white h-4 w-4 text-center rounded-full">{{
                cartAllItemsQuantity
              }}</span>
              <svg
                width="23"
                height="20"
                viewBox="0 0 23 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.4701 4.87398C22.369 4.72776 22.2338 4.60825 22.0764 4.52568C21.9189 4.44311 21.7438 4.39995 21.5659 4.39989H6.53265L5.26328 1.35297C5.09684 0.951724 4.81501 0.608936 4.45351 0.368067C4.09201 0.127198 3.66713 -0.00090312 3.23274 4.79284e-06H0.666504V2.19995H3.23274L8.451 14.7231C8.53458 14.9235 8.67559 15.0946 8.85625 15.215C9.03692 15.3354 9.24917 15.3996 9.46627 15.3996H18.266C18.7247 15.3996 19.135 15.1147 19.2967 14.6868L22.5966 5.88705C22.659 5.72054 22.6801 5.54139 22.658 5.36495C22.636 5.18851 22.5715 5.02004 22.4701 4.87398ZM17.5038 13.1997H10.2L7.45002 6.59983H19.9787L17.5038 13.1997Z"
                  fill="#171717"
                />
                <path
                  d="M10.0167 19.7995C10.9279 19.7995 11.6666 19.0607 11.6666 18.1495C11.6666 17.2383 10.9279 16.4995 10.0167 16.4995C9.10541 16.4995 8.3667 17.2383 8.3667 18.1495C8.3667 19.0607 9.10541 19.7995 10.0167 19.7995Z"
                  fill="#171717"
                />
                <path
                  d="M17.7164 19.7995C18.6276 19.7995 19.3663 19.0607 19.3663 18.1495C19.3663 17.2383 18.6276 16.4995 17.7164 16.4995C16.8051 16.4995 16.0664 17.2383 16.0664 18.1495C16.0664 19.0607 16.8051 19.7995 17.7164 19.7995Z"
                  fill="#171717"
                />
              </svg>
            </AtomsKlumpButton>
            <AtomsKlumpButton
              href="https://user.useklump.com"
              target="_blank"
              override-styles="inline lg:hidden text-xs lg:text-base font-bold text-primary mt-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </AtomsKlumpButton>
            <AtomsKlumpButton
              override-styles="inline lg:hidden"
              :title="showNavDrawer ? 'Close Mobile Nav' : 'Open Mobile Nav'"
              @clicked="toggleNavDrawer"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.25 4.33331H22.75V6.49998H3.25V4.33331ZM3.25 11.9166H22.75V14.0833H3.25V11.9166ZM3.25 19.5H22.75V21.6666H3.25V19.5Z"
                  fill="black"
                />
              </svg>
            </AtomsKlumpButton>
          </div>
        </div>
        <div class="w-full xl:max-w-4xl relative">
          <form
            id="searchForm"
            @submit.prevent="handleSearch"
          >
            <AtomsKlumpInput
              id="search"
              ref="searchInput"
              v-model="searchTerm"
              input-ref="search"
              placeholder="Search for anything"
              override-styles="search w-full rounded-full border border-black px-8"
              @esc="clearSearch"
              @input="search"
            >
              <div class="absolute right-0 top-0 inline-flex h-full px-6 justify-center items-center">
                <AtomsKlumpButton
                  id="searchBtn"
                  override-styles="none"
                  title="Search"
                  @clicked="handleSearch"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.75 15.75L12.3855 12.3795M14.25 7.875C14.25 9.56576 13.5784 11.1873 12.3828 12.3828C11.1873 13.5784 9.56576 14.25 7.875 14.25C6.18424 14.25 4.56274 13.5784 3.36719 12.3828C2.17165 11.1873 1.5 9.56576 1.5 7.875C1.5 6.18424 2.17165 4.56274 3.36719 3.36719C4.56274 2.17165 6.18424 1.5 7.875 1.5C9.56576 1.5 11.1873 2.17165 12.3828 3.36719C13.5784 4.56274 14.25 6.18424 14.25 7.875V7.875Z"
                      stroke="#171717"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </AtomsKlumpButton>
              </div>
            </AtomsKlumpInput>
          </form>
          <div
            v-if="searchResults.length > 0"
            ref="searchDropdown"
            class="absolute top-full left-0 right-0 bg-white w-full shadow-lg py-4 z-50 px-4 space-y-2 rounded-b-md mt-1"
          >
            <template v-if="searchResults.length > 0">
              <div @click="clearSearch">
                <nuxt-link
                  v-for="result in searchResults"
                  :key="result.id"
                  :to="`/p/${result.slug}`"
                  class="flex space-x-3"
                >
                  <div class="w-12 h-12 rounded-md">
                    <AtomsKlumpImage
                      :url="result.preview_image"
                      :alt-text="result.title || result.name || 'Product image'"
                    />
                  </div>
                  <div class="flex flex-col">
                    <p class="text-xs md:text-sm font-medium">{{ result.name }}</p>
                    <nuxt-link
                      class="text-gray-500 text-xs"
                      :to="`/m/${result.merchant.slug}`"
                      >By {{ result.merchant.business_name }}</nuxt-link
                    >
                  </div>
                </nuxt-link>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="items-center space-x-2 hidden lg:flex">
        <AtomsKlumpButton
          href="https://merchant.useklump.com/commerce"
          target="_blank"
          override-styles="setup-store text-xs lg:text-base font-bold text-primary whitespace-nowrap"
          >Setup store
        </AtomsKlumpButton>
        <span>|</span>
        <AtomsKlumpButton
          href="https://user.useklump.com"
          target="_blank"
          override-styles=" text-xs lg:text-base font-bold text-primary mt-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </AtomsKlumpButton>
        <span>|</span>
        <AtomsKlumpButton
          override-styles="cart-icon relative"
          @clicked="toggleCheckout"
        >
          <span
            id="cartLabel"
            class="absolute -top-1 -right-1 text-xs bg-red-400 text-white h-4 w-4 text-center rounded-full"
            >{{ cartAllItemsQuantity }}</span
          >
          <svg
            width="23"
            height="20"
            viewBox="0 0 23 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.4701 4.87398C22.369 4.72776 22.2338 4.60825 22.0764 4.52568C21.9189 4.44311 21.7438 4.39995 21.5659 4.39989H6.53265L5.26328 1.35297C5.09684 0.951724 4.81501 0.608936 4.45351 0.368067C4.09201 0.127198 3.66713 -0.00090312 3.23274 4.79284e-06H0.666504V2.19995H3.23274L8.451 14.7231C8.53458 14.9235 8.67559 15.0946 8.85625 15.215C9.03692 15.3354 9.24917 15.3996 9.46627 15.3996H18.266C18.7247 15.3996 19.135 15.1147 19.2967 14.6868L22.5966 5.88705C22.659 5.72054 22.6801 5.54139 22.658 5.36495C22.636 5.18851 22.5715 5.02004 22.4701 4.87398ZM17.5038 13.1997H10.2L7.45002 6.59983H19.9787L17.5038 13.1997Z"
              fill="#171717"
            />
            <path
              d="M10.0167 19.7995C10.9279 19.7995 11.6666 19.0607 11.6666 18.1495C11.6666 17.2383 10.9279 16.4995 10.0167 16.4995C9.10541 16.4995 8.3667 17.2383 8.3667 18.1495C8.3667 19.0607 9.10541 19.7995 10.0167 19.7995Z"
              fill="#171717"
            />
            <path
              d="M17.7164 19.7995C18.6276 19.7995 19.3663 19.0607 19.3663 18.1495C19.3663 17.2383 18.6276 16.4995 17.7164 16.4995C16.8051 16.4995 16.0664 17.2383 16.0664 18.1495C16.0664 19.0607 16.8051 19.7995 17.7164 19.7995Z"
              fill="#171717"
            />
          </svg>
        </AtomsKlumpButton>
      </div>
    </div>
    <nav class="max-w-screen-xl mx-auto hidden lg:block">
      <ul
        v-if="navLinks.length > 0"
        class="flex items-center text-base mx-4"
      >
        <li
          v-for="navLink in navLinks.slice(0, 11)"
          :key="navLink.name"
          class="navlink relative py-4 pr-8"
        >
          <nuxt-link
            :to="`/c/${navLink.slug}`"
            class="whitespace-nowrap"
            >{{ navLink.name }}</nuxt-link
          >
          <div
            v-if="navLink.sub_categories.length > 0"
            class="sub-navlink absolute top-12 w-64 shadow-lg py-4 rounded bg-white z-30"
          >
            <span class="absolute -top-4 left-4 w-6 h-6 rotate-45"></span>
            <ul class="w-full">
              <li
                v-for="innerNavLink in navLink.sub_categories"
                :key="innerNavLink.name"
                class="w-full hover:bg-neutral-N75 px-4"
              >
                <nuxt-link
                  :to="`/sc/${innerNavLink.slug}`"
                  class="flex text-sm py-3 space-x-2 items-center"
                >
                  <span>
                    {{ innerNavLink.name }}
                  </span>
                  <span>
                    <svg
                      width="8"
                      height="7"
                      viewBox="0 0 8 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.23205 2.99358L7.68005 3.44158L7.23205 3.88958L4.67205 6.44958C4.41605 6.70558 4.03205 6.70558 3.77605 6.44958C3.52005 6.19358 3.52005 5.80958 3.77605 5.55358L5.24805 4.08158H0.640054C0.256054 4.08158 5.38826e-05 3.82558 5.38826e-05 3.44158C5.38826e-05 3.05758 0.256054 2.80158 0.640054 2.80158H5.24805L3.77605 1.32958C3.64805 1.20158 3.58405 1.07358 3.58405 0.881577C3.58405 0.497577 3.84005 0.241577 4.22405 0.241577C4.41605 0.241577 4.54405 0.305577 4.67205 0.433577L7.23205 2.99358Z"
                        fill="#171717"
                      />
                    </svg>
                  </span>
                </nuxt-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
    <div
      tabindex="0"
      class="w-full py-2 md:py-3 bg-neutral-100 flex justify-center items-start md:items-center space-x-2 px-4 overflow-x-auto"
    >
      <span class="mt-[3px] md:mt-0">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.82406 11.5418L4.97179 11.9235C4.60115 12.0895 4.16488 11.9726 3.92689 11.6435L3.37967 10.8868C3.30811 10.7879 3.19774 10.7241 3.07625 10.7116L2.1473 10.6161C1.74331 10.5745 1.42393 10.2552 1.38238 9.85117L1.28684 8.92223C1.27434 8.80074 1.21062 8.69036 1.11166 8.6188L0.354936 8.07158C0.0258409 7.8336 -0.0910586 7.39733 0.0749548 7.02668L0.456686 6.17442C0.506606 6.06296 0.506606 5.93551 0.456686 5.82406L0.0749548 4.97179C-0.0910586 4.60115 0.0258409 4.16488 0.354936 3.92689L1.11166 3.37967C1.21062 3.30811 1.27434 3.19774 1.28684 3.07625L1.38238 2.1473C1.42393 1.74331 1.74331 1.42393 2.1473 1.38238L3.07625 1.28683C3.19774 1.27434 3.30811 1.21061 3.37967 1.11165L3.92689 0.354936C4.16488 0.025841 4.60115 -0.0910588 4.97179 0.0749549L5.82406 0.456683C5.93551 0.506604 6.06296 0.506604 6.17442 0.456683L7.02668 0.0749549C7.39733 -0.0910588 7.8336 0.025841 8.07158 0.354936L8.6188 1.11165C8.69036 1.21061 8.80074 1.27434 8.92223 1.28683L9.85117 1.38238C10.2552 1.42393 10.5745 1.74331 10.6161 2.1473L10.7116 3.07625C10.7241 3.19774 10.7879 3.30811 10.8868 3.37967L11.6435 3.92689C11.9726 4.16488 12.0895 4.60115 11.9235 4.97179L11.5418 5.82406C11.4919 5.93551 11.4919 6.06296 11.5418 6.17442L11.9235 7.02668C12.0895 7.39733 11.9726 7.8336 11.6435 8.07158L10.8868 8.6188C10.7879 8.69036 10.7241 8.80074 10.7116 8.92223L10.6161 9.85117C10.5745 10.2552 10.2552 10.5745 9.85117 10.6161L8.92223 10.7116C8.80074 10.7241 8.69036 10.7879 8.6188 10.8868L8.07158 11.6435C7.8336 11.9726 7.39733 12.0895 7.02668 11.9235L6.17442 11.5418C6.06296 11.4919 5.93551 11.4919 5.82406 11.5418ZM3.68377 5.18855L2.95649 5.91583L5.398 8.35734L9.14586 4.60948L8.41858 3.88219L5.398 6.90277L3.68377 5.18855Z"
            fill="#2C86FF"
          />
        </svg>
      </span>
      <span class="text-xs lg:text-sm text-black font-semibold text-center">
        100% CUSTOMER PROTECTION. ALL SELLERS ARE VERIFIED.
      </span>
    </div>
    <MoleculesKlumpDrawer
      position="left"
      title="Your Cart"
      :visible="showNavDrawer"
      @close="close"
    >
      <template v-slot:header>
        <div class="header py-4 border-b border-gray-200 px-4 flex justify-between items-center">
          <KlumpLogo />
        </div>
      </template>
      <template v-slot:body>
        <div class="body py-1 overflow-y-auto">
          <ul class="text-sm md:text-base max-h-screen overflow-y-auto">
            <li
              v-for="navLink in navLinks"
              :key="navLink.name"
              tabindex="0"
              class="navlink relative pl-4 pr-6 border-b border-gray-200 last:border-b-0"
            >
              <div class="flex py-4 lg:py-6 items-center justify-between">
                <a :href="`/c/${navLink.slug}`">
                  {{ navLink.name }}
                </a>
                <span
                  v-if="navLink.sub_categories.length > 0"
                  class="z-30"
                  @click="setCurrentNav(navLink.name)"
                >
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3484 1.25855L12.0674 0L6.71906 5.46067L1.25839 0.11236L0 1.41573L6.76405 8L13.3484 1.25855Z"
                      fill="#8D8D8D"
                    />
                  </svg>
                </span>
              </div>
              <ul
                v-if="navLink.sub_categories.length > 0 && currentNav.includes(navLink.name)"
                class="w-full pl-4"
              >
                <li
                  v-for="innerNavLink in navLink.sub_categories"
                  :key="innerNavLink.name"
                  class="w-full hover:bg-neutral-N75 px-4 border-b border-gray-200 last:border-b-0"
                >
                  <a
                    :href="`/sc/${innerNavLink.slug}`"
                    class="flex text-sm py-4"
                  >
                    {{ innerNavLink.name }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </template>
    </MoleculesKlumpDrawer>
    <OrganismsKlumpCheckout
      :open="openCheckout"
      @close-checkout="closeCheckout"
    />
  </header>
</template>

<style lang="css">
.sub-navlink {
  display: none;
}

.navlink:focus .sub-navlink {
  display: block;
}

.navlink:hover .sub-navlink {
  display: block;
}
</style>
