<script setup lang="ts">
/** This is the product details template component */
import DOMPurify from 'dompurify'
import { useRuntimeConfig } from '#app'

interface Merchant {
  id: string | number
  business_name: string
  slug: string
  address?: string
  city?: string
  state?: string
  phone?: string
  is_live?: boolean
  credential?: any[]
  [key: string]: any
}

interface Product {
  id: string
  slug: string
  name: string
  description: string
  summary?: string
  price: number
  quantity: number
  old_price?: number
  discount?: number
  merchant: Merchant
  preview_image: string
  gallery?: Array<{ url: string; altText?: string }>
  category?: {
    name: string
    slug: string
  }
  sub_category?: {
    name: string
    slug: string
  }
  [key: string]: any
}

interface MerchantProduct {
  id: string
  name: string
  price: number
  discount?: number
  old_price?: number
  url: string
  image: {
    url: string
    altText: string
  }
  merchant: {
    name: string
    slug: string
  }
  [key: string]: any
}

interface ShippingData {
  [key: string]: any
}

interface Props {
  /** This is the current product to display */
  product: Product
  /** This is the current merchant's products to display in the carousel */
  merchantProduct: MerchantProduct[]
  /** This is the current merchant's shipping data */
  merchantShippingData: ShippingData
}

const props = withDefaults(defineProps<Props>(), {
  product: () => ({}) as Product,
  merchantProduct: () => [],
  merchantShippingData: () => ({}),
})

// Reactive state
const quantity = ref(1)

import { useCheckoutStore } from '~/stores/checkout'
import { useSiteStore } from '~/stores/site'

const checkoutStore = useCheckoutStore()
const siteStore = useSiteStore()

const cart = computed(() => checkoutStore.getCart)
const userLocation = computed(() => siteStore.getUserLocation)
const distinctId = computed(() => siteStore.getDistinctId)

import { useFormatCurrency } from '~/composables/useFormatCurrency'

const { formatCurrency } = useFormatCurrency()

const sanitizedProductDescription = computed(() => {
  if (process.client) {
    return DOMPurify.sanitize(props.product.description)
  } else {
    return props.product.description
  }
})

// Check if user location is set
const isUserLocationSet = computed(() => {
  return userLocation.value && Object.keys(userLocation.value).length > 0
})

// Get shipping data for user location
const productShippingData = computed(() => {
  if (isUserLocationInMerchantShippingData.value && userLocation.value) {
    // Handle nested data structure from backend
    const shippingData = props.merchantShippingData.data || props.merchantShippingData
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
  if (isUserLocationSet.value && props.merchantShippingData && Object.keys(props.merchantShippingData).length > 0) {
    // Handle nested data structure from backend
    const shippingData = props.merchantShippingData.data || props.merchantShippingData
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

const addToCart = () => {
  const merchantIds = [...new Set(cart.value.map(item => item.merchant.slug))]

  // Check if merchant ID array has two unique merchant IDs and if the current product's merchant ID is not in the array
  if (merchantIds.length === 1 && !merchantIds.includes(props.product.merchant.slug)) {
    checkoutStore.setNotification({
      type: 'error',
      message: 'You can only add products from one merchants to your cart',
    })
    return
  }

  const currentItem = cart.value.find(item => String(props.product.id) === String(item.product_id))
  if (currentItem) {
    if (cart.value.length > 0 && props.product.quantity < currentItem.quantity + quantity.value) {
      checkoutStore.setNotification({ type: 'error', message: 'You have exceeded quantity allowed' })
      return
    }
  }

  const product = {
    product_id: props.product.id,
    slug: props.product.slug,
    name: props.product.name,
    price: props.product.price,
    limit: props.product.quantity,
    quantity: quantity.value,
    merchant: {
      id: props.product.merchant.id,
      business_name: props.product.merchant.business_name || props.product.merchant.name,
      slug: props.product.merchant.slug,
      address: props.product.merchant.address || '',
      city: props.product.merchant.city || '',
      state: props.product.merchant.state || '',
      phone: props.product.merchant.phone || '',
      is_live: props.product.merchant.is_live,
      credential: props.product.merchant.credential,
    },
    image_url: props.product.preview_image,
    item_url: encodeURI(window.location.href),
  }

  checkoutStore.addToCart(product)
  checkoutStore.setNotification({ type: 'success', message: 'Product added to cart' })

  const config = useRuntimeConfig()
  const data = {
    environment: config.public.nodeEnv,
    distinct_id: distinctId.value,
    product_id: props.product.id,
    product_slug: props.product.slug,
    product_name: props.product.name,
    product_price: props.product.price,
    product_limit: props.product.quantity,
    product_quantity: quantity.value,
    product_merchant_name: props.product.merchant.business_name,
    product_image_url: props.product.preview_image,
    product_item_url: encodeURI(window.location.href),
  }

  // TODO: Update when mixpanel plugin is migrated
  // $mixpanel.track('A - Product Added to Cart - KC', data)
}

const increment = () => {
  if (props.product.quantity > quantity.value) {
    quantity.value = quantity.value + 1
  }
}

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value = quantity.value - 1
  }
}
</script>

<template>
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <!-- Breadcrumb Navigation -->
    <p class="space-x-2 text-black">
      <nuxt-link to="/">Home</nuxt-link>
      <span> > </span>
      <nuxt-link :to="`/c/${product.category?.slug}`">{{ product.category?.name }}</nuxt-link>
      <span> > </span>
      <nuxt-link :to="`/sc/${product.sub_category?.slug}`">{{ product.sub_category?.name }}</nuxt-link>
      <span> > </span>
      <span class="text-[#868686]">{{ product.name }}</span>
    </p>

    <!-- Main Product Grid -->
    <div class="w-full mt-6 lg:mt-12 grid grid-cols-12 gap-0 md:gap-8">
      <!-- Product Gallery -->
      <div class="w-full col-span-12 md:col-span-7">
        <MoleculesProductGallery
          :images="product.gallery && product.gallery.length > 0 ? product.gallery : [{ url: product.preview_image }]"
        />
      </div>

      <!-- Product Details -->
      <div
        id="productDetails"
        class="w-full py-6 col-span-12 md:col-span-5"
      >
        <div class="w-full max-w-lg space-y-3">
          <!-- Merchant Name -->
          <p class="text-primary text-base font-bold">
            <nuxt-link :to="`/m/${product.merchant.slug}`">{{ product.merchant.business_name }}</nuxt-link>
          </p>

          <!-- Product Name -->
          <AtomsKlumpHeading
            weight="normal"
            text-size="xLarge"
            >{{ product.name }}</AtomsKlumpHeading
          >

          <!-- Price Section -->
          <div>
            <div class="flex space-x-3 items-center">
              <p class="text-base md:text-2xl font-bold text-black">{{ formatCurrency(product.price) }}</p>
              <span
                v-if="product.discount && product.discount > 0.9"
                class="text-green-700 text-xs p-1 rounded bg-green-200"
              >
                {{ Math.round(product.discount) }}%
              </span>
            </div>
            <div v-if="product.discount && product.discount > 0.9">
              <p class="font-bold">
                <s class="text-gray-500 text-sm">{{ formatCurrency(product.old_price || 0) }}</s>
              </p>
            </div>
          </div>

          <!-- Product Summary -->
          <p class="text-sm leading-6">{{ product.summary }}</p>
        </div>

        <!-- Quantity Section -->
        <div
          v-if="product.quantity > 0"
          class="max-w-lg w-full mt-6"
        >
          <div class="h-[46px]">
            <MoleculesProductQuantity
              :value="quantity"
              @increment="increment"
              @decrement="decrement"
            />
          </div>
        </div>

        <!-- Add to Cart Section -->
        <div
          id="cartToCartWrapper"
          class="mt-6"
        >
          <AtomsKlumpButton
            type="primary"
            :disabled="product.quantity === 0 || !isUserLocationInMerchantShippingData"
            radius="all"
            @clicked="addToCart"
          >
            {{ product.quantity === 0 ? 'Out of stock' : 'Add to cart' }}
          </AtomsKlumpButton>

          <!-- Shipping Status Messages -->
          <div
            v-if="isUserLocationSet && isUserLocationInMerchantShippingData"
            class="text-sm mt-2 text-green-700 flex items-center space-x-1"
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
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </span>
            <p>
              This item can be shipped to
              <span class="font-bold">{{ userLocation?.city?.name }}, {{ userLocation?.state?.name }} State.</span>
            </p>
          </div>
          <div v-else-if="isUserLocationSet && !isUserLocationInMerchantShippingData">
            <p class="text-sm mt-2 text-red-600">
              This item cannot be shipped to
              <span class="font-bold">{{ userLocation?.city?.name }}, {{ userLocation?.state?.name }} state,</span>
              Please choose a different delivery location.
            </p>
          </div>
          <div v-else>
            <p class="text-sm mt-2 text-red-600">
              Please set your location to see if this product can be shipped to you
            </p>
          </div>

          <!-- Location Button -->
          <button
            class="flex space-x-1 text-gray-600 text-sm items-center mt-3"
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

        <!-- Product Description -->
        <div class="max-w-lg w-full mt-6">
          <AtomsKlumpHeading
            weight="bold"
            text-size="base"
            >Product Details</AtomsKlumpHeading
          >
          <div
            class="text-sm leading-6 space-y-2 px-4 mt-3 wysiwyg"
            v-html="sanitizedProductDescription"
          />
        </div>
      </div>
    </div>

    <!-- More Products from Merchant -->
    <div
      v-if="merchantProduct.length > 0"
      class="mt-10 space-y-4"
    >
      <AtomsKlumpHeading
        weight="bold"
        text-size="xLarge"
        >More from {{ product.merchant.business_name }}</AtomsKlumpHeading
      >
      <OrganismsKlumpCarousel :merchant-product="merchantProduct" />
    </div>
  </div>
</template>

<style lang="postcss">
.wysiwyg ul {
  margin-left: 12px;
  list-style-type: disc;
}
</style>
