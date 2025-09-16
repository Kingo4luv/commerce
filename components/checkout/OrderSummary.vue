<script setup lang="ts">
interface Props {
  cart: any[]
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  selectedCity: { name: string }
  selectedState: { name: string }
  checkedItems: string[]
  merchant: any
}

const props = defineProps<Props>()
</script>

<template>
  <div class="body pt-1 h-full overflow-y-auto">
    <div class="px-4 pt-4 pb-[100%]">
      <div
        v-if="checkedItems.includes('Shipping')"
        class="space-y-8"
      >
        <div class="space-y-3">
          <AtomsKlumpHeading
            text-size="xLarge"
            weight="bold"
          >
            Personal Details
          </AtomsKlumpHeading>
          <div class="flex items-center w-full text-gray-600">
            <span class="text-gray-500 w-1/2">Name</span>
            <span class="w-1/2">{{ firstName }} {{ lastName }}</span>
          </div>
          <div class="flex items-center w-full text-gray-600">
            <span class="text-gray-500 w-1/2">Email</span>
            <span class="w-1/2">{{ email }}</span>
          </div>
          <div class="flex items-center w-full text-gray-600">
            <span class="text-gray-500 w-1/2">Number</span>
            <span class="w-1/2">{{ phone }}</span>
          </div>
        </div>
        <div class="space-y-3">
          <AtomsKlumpHeading
            text-size="xLarge"
            weight="bold"
          >
            Shipping Details
          </AtomsKlumpHeading>
          <div class="flex items-center w-full text-gray-600">
            <span class="text-gray-500 w-1/2">Address</span>
            <span class="w-1/2">{{ address }}</span>
          </div>
          <div class="flex items-center w-full text-gray-600">
            <span class="text-gray-500 w-1/2">City</span>
            <span class="w-1/2">{{ selectedCity.name }}</span>
          </div>
          <div class="flex items-center w-full text-gray-600">
            <span class="text-gray-500 w-1/2">State</span>
            <span class="w-1/2">{{ selectedState.name }}</span>
          </div>
        </div>
      </div>
      <MoleculesKlumpMerchantAddress
        v-else
        :merchant="merchant"
      />

      <div v-if="cart.length > 0">
        <div class="mb-5">
          <AtomsKlumpHeading
            text-size="xLarge"
            weight="bold"
          >
            Order Items
          </AtomsKlumpHeading>
        </div>
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex justify-between items-center border-b border-gray-200 py-3"
        >
          <div class="w-auto md:w-1/2 flex space-x-2 items-center">
            <img
              :src="item.image_url"
              :alt="item.name"
              class="w-12 object-cover object-center border border-gray-200 p-1 rounded"
            />
            <p class="text-gray-500 max-w-[150px] text-sm lg:truncate">{{ item.name }}</p>
          </div>
          <p class="w-auto md:w-1/2 flex items-center text-gray-500 text-sm">Qty: {{ item.quantity }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
