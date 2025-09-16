<script setup lang="ts">
interface Props {
  cart: any[]
}

const props = defineProps<Props>()
</script>
<template>
  <div class="body pt-1 h-full overflow-y-auto">
    <template v-if="cart.length > 0">
      <div
        v-for="item in cart"
        :key="item.id"
      >
        <MoleculesProductCartItem :product="item" />
      </div>
    </template>
    <div
      v-else
      class="flex flex-col items-center justify-center py-40 lg:py-60"
    >
      <div class="h-24 lg:h-28 w-24 lg:w-28 bg-gray-100 rounded-full flex items-center justify-center text-blue-B500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </div>
      <h3 class="mt-3 text-lg font-medium">Your cart is empty</h3>
      <p class="mt-3 text-sm">Browse our categories and discover our best deals!</p>
      <div class="mt-5 w-full max-w-xs">
        <AtomsKlumpButton
          id="startShopingBtn"
          type="primary"
          radius="all"
          href="/"
          weight="normal"
        >
          Start Shopping
        </AtomsKlumpButton>
      </div>
    </div>
  </div>
</template>
