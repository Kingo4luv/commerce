<script setup lang="ts">
import { useCheckoutStore } from '~/stores/checkout'
import { useSiteStore } from '~/stores/site'
import { useFormatCurrency } from '~/composables/useFormatCurrency'
import { useRuntimeConfig } from '#app'

interface Merchant {
  id: string | number
  business_name: string
  slug: string
  [key: string]: any
}

interface Product {
  id: string | number
  name: string
  slug: string
  price: number
  quantity: number
  discount: number
  old_price?: number
  summary: string
  preview_image: string
  merchant: Merchant
  gallery: { url: string }[]
  shippingData: Record<string, Array<{ city: string; [key: string]: any }>>
  [key: string]: any
}

interface CartItem {
  product_id: string | number
  quantity: number
  merchant: Merchant
  [key: string]: any
}

interface UserLocation {
  state: { name: string }
  city: { name: string }
  [key: string]: any
}

interface Props {
  selectedProduct: Product
}

const props = defineProps<Props>()

const emit = defineEmits<{
  closeModal: []
}>()

const quantity = ref(1)

const checkoutStore = useCheckoutStore()
const siteStore = useSiteStore()
const { formatCurrency } = useFormatCurrency()
const config = useRuntimeConfig()

const cart = computed(() => checkoutStore.getCart)
const userLocation = computed(() => siteStore.getUserLocation)
const distinctId = computed(() => siteStore.getDistinctId)

// Check if user location is set
const isUserLocationSet = computed(() => {
  return userLocation.value && Object.keys(userLocation.value).length > 0
})

// Get shipping data for user location
const productShippingData = computed(() => {
  if (isUserLocationInMerchantShippingData.value && userLocation.value) {
    // Handle nested data structure from backend
    const shippingData = (props.selectedProduct.shippingData as any).data || props.selectedProduct.shippingData
    const shippedToState = Object.keys(shippingData)
    const isUserLocationInShippedToState = shippedToState.includes(userLocation.value.state.name)

    if (isUserLocationInShippedToState) {
      const shippedToStateData = shippingData[userLocation.value.state.name]
      const shippedCity = shippedToStateData.find((item: any) => item.city === userLocation.value!.city.name)
      return shippedCity
    }
  }
  return null
})

const isUserLocationInMerchantShippingData = computed(() => {
  if (
    isUserLocationSet.value &&
    props.selectedProduct.shippingData &&
    Object.keys(props.selectedProduct.shippingData).length > 0
  ) {
    // Handle nested data structure from backend
    const shippingData = (props.selectedProduct.shippingData as any).data || props.selectedProduct.shippingData
    const shippedToState = Object.keys(shippingData)
    const isUserLocationInShippedToState = shippedToState.includes(userLocation.value!.state.name)

    if (isUserLocationInShippedToState) {
      const shippedToStateData = shippingData[userLocation.value!.state.name]
      const shippedToCities = shippedToStateData.map((item: any) => item.city)
      const isUserLocationInShippedToCity = shippedToCities.includes(userLocation.value!.city.name)
      return isUserLocationInShippedToCity
    }
  }
  return false
})

const openLocationModal = () => {
  siteStore.updateLocationModalIsOpen()
}

const increment = () => {
  if (props.selectedProduct.quantity > quantity.value) {
    quantity.value = quantity.value + 1
  }
}

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value = quantity.value - 1
  }
}

const addToCart = () => {
  const product = props.selectedProduct
  const merchantIds = [...new Set(cart.value.map(item => item.merchant.slug))]

  // Check if merchant ID array has two unique merchant IDs and if the current product's merchant ID is not in the array
  if (merchantIds.length === 1 && !merchantIds.includes(product.merchant.slug)) {
    checkoutStore.setNotification({
      type: 'error',
      message: 'You can only add products from one merchant to your cart',
    })
    return
  }

  const currentItem = cart.value.find(item => String(product.id) === String(item.product_id))
  if (currentItem) {
    if (cart.value.length > 0 && product.quantity < currentItem.quantity + 1) {
      checkoutStore.setNotification({
        type: 'error',
        message: 'You have exceeded quantity allowed',
      })
      return
    }
  }

  const item = {
    product_id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    limit: product.quantity,
    quantity: quantity.value,
    merchant: {
      id: product.merchant.id || product.merchant.slug,
      business_name: product.merchant.business_name,
      slug: product.merchant.slug,
      address: product.merchant.address,
      city: product.merchant.city,
      state: product.merchant.state,
      phone: product.merchant.phone,
      is_live: product.merchant.is_live,
      credential: product.merchant.credential,
    },
    image_url: product.preview_image,
    item_url: encodeURI(window.location.href),
  }

  checkoutStore.addToCart(item)
  checkoutStore.setNotification({ type: 'success', message: 'Product added to cart' })

  // Track analytics event
  const data = {
    environment: config.public.nodeEnv,
    distinct_id: distinctId.value,
    product_id: product.id,
    product_slug: product.slug,
    product_name: product.name,
    product_price: product.price,
    product_limit: product.quantity,
    product_quantity: quantity.value,
    product_merchant_name: product.merchant.business_name,
    product_image_url: product.preview_image,
    product_item_url: encodeURI(window.location.href),
  }

  // TODO: Implement analytics tracking when mixpanel plugin is migrated
  // this.$mixpanel.track('A - Product Added to Cart - KC', data)
}

const closeModal = () => {
  emit('closeModal')
}
</script>

<template>
  <dialog
    class="fixed inset-0 min-h-screen h-screen w-screen bg-black/10 z-40 flex flex-col items-center justify-center"
  >
    <div
      class="relative w-full max-w-3xl bg-white rounded shadow-2xl z-50 grid grid-cols-1 md:grid-cols-2 overflow-y-auto py-2"
    >
      <button
        class="absolute right-3 top-3 z-20"
        @click="closeModal"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div class="w-full h-full px-4 py-4">
        <MoleculesProductGallery
          mode="row"
          :images="
            selectedProduct.gallery.length > 0
              ? selectedProduct.gallery.map((img, index) => ({
                  url: img.url,
                  id: (img as any).id || img.url || `gallery-${index}`,
                }))
              : [{ url: selectedProduct.preview_image, id: selectedProduct.preview_image }]
          "
        />
      </div>
      <div>
        <div class="py-0 lg:py-8 px-4">
          <div class="w-full max-w-lg space-y-1 lg:space-y-4">
            <p class="text-primary text-base font-bold">
              <NuxtLink :to="`/m/${selectedProduct.merchant.slug}`">{{
                selectedProduct.merchant.business_name
              }}</NuxtLink>
            </p>
            <AtomsKlumpHeading
              weight="normal"
              text-size="xLarge"
              >{{ selectedProduct.name }}</AtomsKlumpHeading
            >
            <div>
              <div class="flex space-x-3 items-center">
                <p class="text-base md:text-2xl font-bold text-black">{{ formatCurrency(selectedProduct.price) }}</p>
                <span
                  v-if="selectedProduct.discount > 0.9"
                  class="text-green-700 text-xs p-1 rounded bg-green-200"
                  >{{ Math.round(selectedProduct.discount) }}%</span
                >
              </div>
              <div v-if="selectedProduct.discount > 0.9">
                <p class="font-bold">
                  <s class="text-gray-500 text-sm">{{ formatCurrency(selectedProduct.old_price || 0) }}</s>
                </p>
              </div>
            </div>
            <p class="text-sm leading-6">{{ selectedProduct.summary }}</p>
          </div>
          <div
            v-if="selectedProduct.quantity > 0"
            class="lg:max-w-lg w-full mt-4 lg:mt-10"
          >
            <div class="h-[46px]">
              <!-- <MoleculesKlumpSelect :items="[]" type="select" label="Select Size" radius="normal" radius-side="both" :allow-default-option="true"/> -->
              <MoleculesProductQuantity
                :value="quantity"
                @decrement="decrement"
                @increment="increment"
              />
            </div>
          </div>
          <div
            id="cartToCartWrapper"
            class="mt-4 lg:mt-10"
          >
            <AtomsKlumpButton
              type="primary"
              :disabled="selectedProduct.quantity === 0 || !isUserLocationInMerchantShippingData"
              radius="all"
              @clicked="addToCart"
            >
              {{ selectedProduct.quantity === 0 ? 'Out of stock' : 'Add to cart' }}
            </AtomsKlumpButton>

            <div
              v-if="isUserLocationSet && isUserLocationInMerchantShippingData"
              class="text-xs mt-2 text-green-700 flex items-center space-x-1"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="3"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </span>
              <p>
                This item can be shipped to
                <span class="font-bold">{{ userLocation?.city.name }}, {{ userLocation?.state.name }} State.</span>
              </p>
            </div>
            <div v-else-if="isUserLocationSet && !isUserLocationInMerchantShippingData">
              <p class="text-xs mt-2 text-red-600">
                This item cannot be shipped to
                <span class="font-bold">{{ userLocation?.city.name }}, {{ userLocation?.state.name }} state,</span>
                Please choose a different delivery location.
              </p>
            </div>
            <div v-else>
              <p class="text-sm mt-2 text-red-600">
                Please set your location to see if this product can be shipped to you
              </p>
            </div>
            <button
              class="flex space-x-1 text-gray-600 text-sm items-center mt-1 md:mt-3"
              @click="openLocationModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span class="ml-2">{{ isUserLocationSet ? 'Change your location' : 'Set your location' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
