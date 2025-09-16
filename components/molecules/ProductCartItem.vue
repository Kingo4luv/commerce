<script setup lang="ts">
/** This is the product cart item components. Used to display cart products */

interface Merchant {
  business_name: string
  slug: string
  [key: string]: any
}

interface Product {
  image_url: string
  name: string
  slug: string
  price: number
  merchant: Merchant
  quantity: number
  limit: number
  product_id: string
  [key: string]: any
}

interface Props {
  /** This is the product object */
  product: Product
}

const props = defineProps<Props>()

const value = ref(props.product.quantity)

import { useCheckoutStore } from '~/stores/checkout'
import { useFormatCurrency } from '~/composables/useFormatCurrency'

const checkoutStore = useCheckoutStore()
const { formatCurrency } = useFormatCurrency()

const increment = () => {
  if (props.product.limit > value.value) {
    value.value = value.value + 1
    checkoutStore.updateCart({ product_id: props.product.product_id, quantity: value.value })
  } else {
    checkoutStore.setNotification({ type: 'error', message: 'You have exceeded quantity allowed' })
  }
}

const decrement = () => {
  if (value.value !== 0) {
    value.value = value.value - 1
  }
  checkoutStore.updateCart({ product_id: props.product.product_id, quantity: value.value })
}

const removeItem = () => {
  checkoutStore.updateCart({ product_id: props.product.product_id, quantity: 0 })
}
</script>

<template>
  <article
    id="cartItem"
    class="px-2 md:px-3 py-2 bg-white"
  >
    <div class="flex items-center space-x-2 md:space-x-3">
      <div class="w-[100px] h-[100px] flex-none">
        <AtomsKlumpImage
          :url="product.image_url"
          :alt-text="product.name"
          radius="all"
        />
      </div>
      <div class="w-full flex items-center justify-between space-y-2">
        <div class="max-w-[140px] md:w-[300px] truncate">
          <NuxtLink :to="`/p/${product.slug}`">
            <AtomsKlumpHeading
              type="large"
              text-size="small"
              >{{ product.name }}</AtomsKlumpHeading
            >
          </NuxtLink>
          <p class="md:text-base text-sm mt-1 text-black">{{ formatCurrency(product.price) }}</p>
          <NuxtLink
            class="mt-2 text-xs text-neutral-N500 truncate"
            :to="`/m/${product.merchant.slug}`"
          >
            By {{ product.merchant.business_name }}
          </NuxtLink>
        </div>
        <div
          id="cartQtyBtn"
          class="h-[30px] md:h-[38px] flex-none"
        >
          <MoleculesProductQuantity
            :value="value"
            @decrement="decrement"
            @increment="increment"
          />
        </div>
        <div>
          <AtomsKlumpButton
            id="removeItem"
            override-styles="nothing"
            @clicked="removeItem"
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </AtomsKlumpButton>
        </div>
      </div>
    </div>
  </article>
</template>
