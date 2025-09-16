<script setup lang="ts">
interface Merchant {
  business_name: string
  address: string
  city: string
  state: string
  phone: string
  [key: string]: any
}

interface Props {
  merchant: Merchant | null
}

const props = defineProps<Props>()
</script>

<template>
  <div
    v-if="props.merchant"
    class="pb-10 space-y-3"
  >
    <AtomsKlumpHeading
      text-size="base"
      weight="bold"
      >Merchant Address for Pickup</AtomsKlumpHeading
    >
    <div class="space-y-1">
      <p class="text-black text-sm font-bold">{{ props.merchant.business_name }}</p>

      <div class="space-y-0">
        <p class="text-black text-sm">
          {{ props.merchant.address }}, {{ props.merchant.city }}, {{ props.merchant.state }}
        </p>
      </div>
    </div>
    <dl>
      <dt class="font-bold text-black text-sm">Merchant Phone</dt>
      <dd class="text-black text-sm">{{ props.merchant.phone }}</dd>
    </dl>
  </div>
</template>
