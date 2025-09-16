<script setup lang="ts">
interface Merchant {
  id: string | number
  business_name: string
  slug: string
  logo?: string
  [key: string]: any
}

interface Props {
  /** Merchant array */
  merchants: Merchant[]
}

const props = withDefaults(defineProps<Props>(), {
  merchants: () => [],
})
</script>

<template>
  <div class="merchant-listings w-full max-w-screen-xl mx-auto px-4">
    <p class="space-x-2 text-black">
      <nuxt-link to="/">Home</nuxt-link><span> > </span> <span class="text-[#868686]">Merchants</span>
    </p>
    <AtomsKlumpHeading
      text-size="xxLarge"
      color="primary"
      class="mt-12"
    >
      Merchants
    </AtomsKlumpHeading>
    <div class="w-full grid grid-cols-3 md:grid-cols-6 xl:grid-cols-9 gap-x-2 gap-y-4 md:gap-x-5 mt-5 md:mt-8">
      <nuxt-link
        v-for="merchant in merchants"
        :key="merchant.id"
        :title="merchant.business_name"
        :to="`m/${merchant.slug}`"
        class="link space-y-1"
      >
        <div
          to=""
          class="w-full h-32 md:w-32 rounded flex items-center justify-center border border-gray-200"
        >
          <div class="h-16 w-16 rounded flex items-center justify-center">
            <AtomsKlumpImage
              v-if="merchant.logo && merchant.logo !== ''"
              :url="merchant.logo"
              :alt-text="merchant.business_name"
              radius="all"
            />
            <AtomsKlumpHeading
              v-else
              type="xxLarge"
              text-size="xxLarge"
              override-styles="font-bold text-8xl text-primary"
              >{{ merchant.business_name.split('')[0] }}</AtomsKlumpHeading
            >
          </div>
        </div>
        <p class="font-bold text-black text-sm md:text-base whitespace-nowrap truncate">{{ merchant.business_name }}</p>
      </nuxt-link>
    </div>
  </div>
</template>
