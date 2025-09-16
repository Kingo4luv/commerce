<script setup lang="ts">
/** This is the general product listings component */

interface ProductImage {
  url: string
  altText: string
}

interface ProductForListing {
  slug: string
  url: string
  image: ProductImage
  name?: string
  description?: string
  price?: number
  [key: string]: any
}

interface PageOptions {
  offset?: number
  limit?: number
  [key: string]: any
}

interface Props {
  /** This is the heading of the listings */
  heading: string
  /** This is the array of product to be listed */
  products: ProductForListing[]
  /** This is the page options for pagination */
  pageOptions?: PageOptions
  /** This determine if to display the loader or the product listings */
  loading: boolean
  /** This is to identify what the listing is for. e.g Category, or merchant listings */
  pageType: string
}

const props = withDefaults(defineProps<Props>(), {
  pageOptions: () => ({}),
  loading: false,
  pageType: '',
})

// Define emits
const emit = defineEmits<{
  sortItems: [value: any]
  paginate: [payload: { direction: string; jump?: number }]
}>()

// Get route and router
const route = useRoute()
const router = useRouter()

// Reactive state
const label = ref('Most Recent')
const showProductModal = ref(false)
const selectedProduct = ref<any>(null)

const items = [
  { name: 'Highest Price', value: 'pRice', query: 'sortByField' },
  { name: 'From Oldest', value: 'ASC', query: 'sortOrder' },
]

const currentPage = ref(Number(route.query.page) || 1)
const currentOffset = ref(props.pageOptions?.offset || 0)

import { useCheckoutStore } from '~/stores/checkout'
import { useSiteStore } from '~/stores/site'

const checkoutStore = useCheckoutStore()
const siteStore = useSiteStore()

const cart = computed(() => checkoutStore.getCart)
const userLocation = computed(() => siteStore.getUserLocation)
const distinctId = computed(() => siteStore.getDistinctId)

import { useFormatCurrency } from '~/composables/useFormatCurrency'

const { formatCurrency } = useFormatCurrency()

const showSort = computed(() => {
  return props.pageType !== 'Search'
})

/** Pagination */
const movePage = (args: { direction: string; jump?: number }) => {
  const numPages = args.jump ? args.jump : 1

  if (args.direction === 'forward') {
    currentPage.value = currentPage.value + numPages
    currentOffset.value = currentPage.value - 1
  } else {
    currentPage.value = currentPage.value - numPages
    currentOffset.value = currentPage.value - 1
  }

  // Emit pagination event to parent
  emit('paginate', args)

  router.push({
    query: {
      ...route.query,
      page: String(currentPage.value),
      offset: String(currentOffset.value),
      limit: String(props.pageOptions?.limit || 10),
    },
  })
}

const updateSort = (value: string) => {
  if (value === 'Most Recent') {
    emit('sortItems', value)
    label.value = value
  } else {
    const sortValue = items.filter(item => item.name === value)[0]
    emit('sortItems', sortValue)
    label.value = sortValue?.name || 'Most Recent'
  }
  router.push({ query: {} })
}

const showModal = async (product: ProductForListing) => {
  try {
    const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }
    const response = await $api(`/products/${product.slug}`)
    const shippingResponse = await $api(`/merchants/${response.data.merchant.id}/shipping`)

    response.data.shippingData = shippingResponse.data
    selectedProduct.value = response.data
    showProductModal.value = true
  } catch (error) {
    // Error loading product details
  }
}

const closeModal = () => {
  showProductModal.value = false
  selectedProduct.value = null
}
</script>

<template>
  <section class="product-listings w-full">
    <div class="flex justify-between items-start sm:items-center mb-6">
      <AtomsKlumpHeading
        text-size="xLarge"
        color="primary"
        >{{ heading }}</AtomsKlumpHeading
      >
      <div
        v-if="products.length > 0 && showSort"
        class="max-w-[138px] md:max-w-[250px] h-[30px] md:h-[44px] w-full"
      >
        <MoleculesKlumpSelect
          :items="items"
          radius="full"
          radius-side="both"
          type="sort"
          :label="label"
          :allow-default-option="true"
          @change="updateSort"
        />
      </div>
    </div>
    <div
      v-if="loading"
      class="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
    >
      <AtomsKlumpCardLoader
        v-for="i in 8"
        :key="i"
        :numbers-of-cards="8"
      />
    </div>
    <div
      v-else-if="products.length > 0"
      class="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 mt-4"
    >
      <MoleculesProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      >
        <template v-slot:cartIcon>
          <button
            class="absolute top-2 right-2 z-20 bg-white text-primary border border-primary p-2 rounded lg:group-hover:block lg:hidden hover:bg-primary hover:text-white"
            @click="showModal(product)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.9"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </template>
        <div>
          <AtomsKlumpHeading
            type="xLarge"
            text-size="small"
            weight="normal"
            >{{ product.name }}</AtomsKlumpHeading
          >
          <div>
            <div class="flex space-x-2 items-center mt-1">
              <p class="text-base md:text-xl font-bold text-black">{{ formatCurrency(product.price) }}</p>
              <span
                v-if="product.discount > 0.9"
                class="text-green-700 text-xs p-[2px] rounded bg-green-200"
                >{{ Math.round(product.discount) }}%</span
              >
            </div>
            <p
              v-if="product.discount > 0.9"
              class="-mt-1"
            >
              <s class="text-gray-500 text-sm">{{ formatCurrency(product.old_price) }}</s>
            </p>
          </div>
          <client-only>
            <nuxt-link
              :to="`/m/${product.merchant.slug}`"
              class="text-xs text-neutral-N500 mt-1"
              >By {{ product.merchant.name }}
            </nuxt-link>
          </client-only>
        </div>
      </MoleculesProductCard>
    </div>
    <div
      v-else
      class="w-full h-96 flex flex-col space-y-3 justify-center items-center"
    >
      <div class="w-56 h-56 flex justify-center items-center bg-neutral-N75 rounded">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
            stroke="#D4D4D8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <AtomsKlumpHeading
        type="xxLarge"
        text-size="large"
        >No products found</AtomsKlumpHeading
      >
      <div class="text-center">
        <p>We couldn't find any products in this {{ pageType.toLowerCase() }}.</p>
        <p class="mt-3 text-sm">Browse other {{ pageType }} and discover our best deals!</p>
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
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && products.length > 0 && pageOptions?.total > (pageOptions?.limit || 12)"
      class="flex justify-center mt-8"
    >
      <MoleculesKlumpPagination
        :page="currentPage"
        :num-pages="Math.ceil((pageOptions?.total || 0) / (pageOptions?.limit || 12))"
        @paginate="movePage"
      />
    </div>

    <MoleculesQuickCartModal
      v-if="showProductModal && selectedProduct !== null"
      :selected-product="selectedProduct"
      @closeModal="closeModal"
    />
  </section>
</template>
