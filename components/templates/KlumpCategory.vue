<script setup lang="ts">
/** This is the category listings template components */

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
  /** This is the page options for pagination */
  pageOptions?: PageOptions
  /** This determine if to display the loader or the product listings */
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
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
  <div class="px-4">
    <div class="w-full max-w-screen-xl mx-auto mt-6 lg:mt-12 space-y-6 lg:space-y-12">
      <p class="space-x-2 text-black">
        <nuxt-link to="/">Home</nuxt-link><span> > </span> <span class="text-[#868686]">{{ heading }}</span>
      </p>
      <OrganismsProductListings
        :heading="heading"
        :products="products"
        :page-options="pageOptions"
        :loading="loading"
        page-type="Category"
        @sortItems="sortItems"
        @paginate="handlePagination"
      />
    </div>
  </div>
</template>
