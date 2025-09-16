<script setup lang="ts">
/** This is the merchant product listings template components */

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

interface Merchant {
  business_name: string
  logo?: string
  state: string
  phone?: string
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
  /** This is the current merchant object */
  merchant?: Merchant
  /** This is the page options for pagination */
  pageOptions?: PageOptions
  /** This determine if to display the loader or the product listings */
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
  merchant: undefined,
  pageOptions: () => ({}),
  loading: false,
})

const emit = defineEmits<{
  sortItems: [sortValue: any]
  paginate: [payload: { direction: string; jump?: number }]
}>()

const sortItems = (sortValue: any) => {
  emit('sortItems', sortValue)
}

const handlePagination = (payload: { direction: string; jump?: number }) => {
  emit('paginate', payload)
}
</script>

<template>
  <div class="w-full max-w-screen-xl mx-auto px-4">
    <p class="space-x-2 text-black">
      <nuxt-link to="/">Home</nuxt-link><span> > </span><nuxt-link to="/merchants">Merchants</nuxt-link
      ><span> > </span> <span class="text-[#868686]">{{ merchant.business_name }}</span>
    </p>
    <div class="flex items-center justify-items-center space-x-3 border-b border-neutral-100 py-6 lg:py-12">
      <div
        class="w-[80px] md:w-[100px] h-[80px] md:h-[100px] border border-neutral-100 rounded flex justify-center items-center"
      >
        <AtomsKlumpImage
          v-if="merchant.logo && merchant.logo !== ''"
          :url="merchant.logo"
          :alt-text="merchant.business_name"
        />
        <AtomsKlumpHeading
          v-else
          type="xxLarge"
          text-size="xxLarge"
          override-styles="font-bold text-6xl text-primary"
          >{{ merchant.business_name.split('')[0] }}</AtomsKlumpHeading
        >
      </div>
      <div>
        <AtomsKlumpHeading
          type="xxLarge"
          text-size="xxLarge"
          color="primary"
          >{{ merchant.business_name }}</AtomsKlumpHeading
        >
        <div class="flex items-center space-x-1">
          <span>
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 0.583252C7.39239 0.583252 8.72774 1.13638 9.71231 2.12094C10.6969 3.10551 11.25 4.44087 11.25 5.83325C11.25 8.00675 9.59333 10.2841 6.35 12.7166C6.24903 12.7923 6.12622 12.8333 6 12.8333C5.87378 12.8333 5.75097 12.7923 5.65 12.7166C2.40667 10.2841 0.75 8.00675 0.75 5.83325C0.75 4.44087 1.30312 3.10551 2.28769 2.12094C3.27226 1.13638 4.60761 0.583252 6 0.583252ZM6 4.08325C5.53587 4.08325 5.09075 4.26763 4.76256 4.59582C4.43437 4.924 4.25 5.36912 4.25 5.83325C4.25 6.29738 4.43437 6.7425 4.76256 7.07069C5.09075 7.39888 5.53587 7.58325 6 7.58325C6.46413 7.58325 6.90925 7.39888 7.23744 7.07069C7.56563 6.7425 7.75 6.29738 7.75 5.83325C7.75 5.36912 7.56563 4.924 7.23744 4.59582C6.90925 4.26763 6.46413 4.08325 6 4.08325Z"
                fill="#171717"
              />
            </svg>
          </span>
          <p class="font-semibold text-base">{{ merchant.state }}, Nigeria</p>
        </div>
        <p class="mt-1 text-base">{{ merchant.phone ?? '' }}</p>
      </div>
    </div>
    <div class="mt-6 lg:mt-12 space-y-6 lg:space-y-12">
      <OrganismsProductListings
        :heading="heading"
        :products="products"
        :page-options="pageOptions"
        :loading="loading"
        page-type="Merchant"
        @sortItems="sortItems"
        @paginate="handlePagination"
      />
    </div>
  </div>
</template>
