<script setup lang="ts">
interface Props {
  checkedItems: string[]
  merchant: any
}

const props = defineProps<Props>()
</script>
<template>
  <div class="h-full px-6">
    <div
      class="max-w-lg flex flex-col"
      :class="
        checkedItems.includes('Shipping')
          ? 'h-1/2 justify-center items-center mx-auto'
          : 'h-auto py-12 border-b border-gray-200'
      "
    >
      <div
        class="bg-gray-100 rounded-full flex items-center justify-center text-green-G600"
        :class="checkedItems.includes('Shipping') ? 'h-20 w-20 lg:h-24 lg:w-24' : 'h-16 w-16 lg:h-20 lg:w-20'"
      >
        <svg
          width="24"
          height="23"
          viewBox="0 0 24 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
            stroke="#4FA45C"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
            stroke="#4FA45C"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
            stroke="#4FA45C"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h1
        class="font-bold text-black"
        :class="checkedItems.includes('Shipping') ? 'text-xl text-center mt-8' : 'text-base mt-4'"
      >
        Your Order has been Confirmed
      </h1>
      <p
        class="mt-1"
        :class="checkedItems.includes('Shipping') ? 'text-lg text-black text-center ' : 'text-base'"
      >
        Thanks for shopping with us.
      </p>
    </div>
    <div
      v-if="!checkedItems.includes('Shipping')"
      class="py-12"
    >
      <div class="bg-[#ECF0FF] rounded-full flex items-center justify-center text-green-G600 h-16 w-16 lg:h-20 lg:w-20">
        <svg
          width="24"
          height="22"
          viewBox="0 0 24 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 5V21L8 17L16 21L23 17V1L16 5L8 1L1 5Z"
            stroke="#192C69"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 1V17"
            stroke="#192C69"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16 5V21"
            stroke="#192C69"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h1 class="font-bold text-black text-base mt-6">Pick-up Address & Contact</h1>
      <p class="text-base mt-1">{{ merchant?.address }}, {{ merchant?.city }}, {{ merchant?.state }}</p>
      <p class="text-base mt-1">
        <a
          :href="`tel:${merchant?.phone}`"
          class="text-black hover:underline"
        >
          {{ merchant?.phone }}
        </a>
      </p>
    </div>
    <div class="mt-4">
      <AtomsKlumpButton
        id="startShopingBtn"
        type="primary"
        radius="all"
        href="/"
        weight="normal"
      >
        Continue Shopping
      </AtomsKlumpButton>
    </div>
  </div>
</template>
