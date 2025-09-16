<script setup lang="ts">
/** This is the product detail page more product from merchant carousel */

import { useFormatCurrency } from '~/composables/useFormatCurrency'

interface ProductImage {
  url: string
  altText: string
}

interface MerchantProduct {
  id: string
  name: string
  price: number
  discount?: number
  old_price?: number
  url: string
  image: ProductImage
  merchant: {
    name: string
    slug: string
  }
  [key: string]: any
}

interface Props {
  /** This is the array of product objects */
  merchantProduct: MerchantProduct[]
}

const props = withDefaults(defineProps<Props>(), {
  merchantProduct: () => [],
})

const { formatCurrency } = useFormatCurrency()

// Horizontal scroll functionality
const scrollContainer = ref<HTMLElement>()
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const checkScrollButtons = () => {
  if (!scrollContainer.value) return

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1

  // Also check if we have enough products to scroll
  if (props.merchantProduct.length > 3) {
    canScrollRight.value = true
  }
}

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

// Check scroll buttons on mount and when products change
onMounted(() => {
  nextTick(() => {
    checkScrollButtons()
  })
})

watch(
  () => props.merchantProduct,
  () => {
    nextTick(() => {
      checkScrollButtons()
    })
  },
  { deep: true }
)
</script>

<template>
  <div class="relative group">
    <!-- Left Scroll Button -->
    <button
      v-show="canScrollLeft"
      @click="scrollLeft"
      class="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 cursor-pointer"
      aria-label="Scroll left"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>

    <!-- Right Scroll Button -->
    <button
      v-show="canScrollRight"
      @click="scrollRight"
      class="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 cursor-pointer"
      aria-label="Scroll right"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>

    <!-- Scrollable Container -->
    <div
      ref="scrollContainer"
      class="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
      @scroll="checkScrollButtons"
      style="scroll-behavior: smooth"
    >
      <div
        v-for="product in merchantProduct"
        :key="product.id"
        class="flex-shrink-0 w-64"
      >
        <MoleculesProductCard :product="product">
          <div class="px-2 pb-2 rounded-b-md">
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
                  v-if="product.discount && product.discount > 0"
                  class="text-green-700 text-xs p-[2px] rounded bg-green-200"
                  >{{ Math.round(product.discount) }}%</span
                >
              </div>
              <p
                v-if="product.old_price && product.old_price > 0"
                class="-mt-1"
              >
                <s class="text-gray-500 text-sm">{{ formatCurrency(product.old_price) }}</s>
              </p>
            </div>
            <p class="text-xs text-neutral-500 mt-1">By {{ product.merchant.name }}</p>
          </div>
        </MoleculesProductCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
