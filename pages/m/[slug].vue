<script setup lang="ts">
/**
 * Merchant details page - displays products by merchant
 */

// Types
interface ProductImage {
  url: string
  altText: string
}

interface Product {
  id: string | number
  name: string
  slug: string
  url: string
  price: number
  old_price?: number
  discount?: number
  image: ProductImage
  merchant: {
    name: string
    slug: string
  }
}

interface Merchant {
  id: string | number
  business_name: string
  slug: string
  logo?: string
  state: string
  phone?: string
  [key: string]: any
}

interface PageOptions {
  limit: number
  offset: number
  total: number
}

// Get route and API
const route = useRoute()
const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }

// Reactive data
const products = ref<Product[]>([])
const merchant = ref<Merchant>({ id: '', business_name: '', slug: '', state: '' })
const pageOptions = ref<PageOptions>({ limit: 12, offset: 0, total: 0 })
const loading = ref<boolean>(false)

// Transform product data
const transformProduct = (product: any): Product => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  url: `/p/${product.slug}`,
  price: product.price,
  old_price: product.old_price,
  discount: product.discount,
  image: {
    url: product.preview_image,
    altText: product.name,
  },
  merchant: {
    name: product.merchant.business_name,
    slug: product.merchant.slug,
  },
})

// Fetch products by merchant
const getProducts = async (limit = 12, offset = 0, sortValue: any = null) => {
  try {
    loading.value = true
    const slug = route.params.slug as string

    const sortQuery = sortValue !== null ? `&${sortValue.query}=${sortValue.value}` : ''
    const query = `products?merchant=${slug}&limit=${limit}&offset=${offset}${sortQuery}`

    const data = await $api(query)

    products.value = data.data.map(transformProduct)
    merchant.value = data?.group?.merchant ||
      data?.data[0]?.merchant || { id: '', business_name: '', slug: '', state: '' }
    pageOptions.value = {
      limit: data.limit,
      offset: data.offset,
      total: data.total,
    }
  } catch (error: any) {
    products.value = []
  } finally {
    loading.value = false
  }
}

// Sort items handler
const sortItems = (sortValue: any) => {
  if (sortValue !== 'Most Recent') {
    getProducts(12, 0, sortValue)
  } else {
    getProducts(12, 0)
  }
}

// Pagination handler
const handlePagination = (payload: { direction: string; jump?: number }) => {
  const limit = pageOptions.value.limit || 12
  const currentOffset = pageOptions.value.offset || 0
  const jump = payload.jump || 1

  let newOffset = currentOffset
  if (payload.direction === 'forward') {
    newOffset = currentOffset + limit * jump
  } else {
    newOffset = Math.max(0, currentOffset - limit * jump)
  }

  getProducts(limit, newOffset)
}

// Watch for route changes
watch(
  () => route.query,
  newQuery => {
    if (newQuery.page && newQuery.offset && newQuery.limit) {
      const limit = Number(newQuery.limit) || 12
      const offset = Number(newQuery.offset) || 0
      getProducts(limit, offset)
    }
  },
  { immediate: true }
)

// Initial data fetch using $fetch directly
const slug = route.params.slug as string

try {
  const data = await $api(`products?merchant=${slug}&limit=12&offset=0`)

  // Set the data directly
  products.value = data.data.map(transformProduct)
  merchant.value = data?.group?.merchant || data?.data[0]?.merchant || { id: '', business_name: '', slug: '' }
  pageOptions.value = {
    limit: data.limit,
    offset: data.offset,
    total: data.total,
  }
} catch (error: any) {
  // If it's already a createError, re-throw it
  if (error.statusCode) {
    throw error
  }
  // Otherwise, create a new error
  throw createError({
    statusCode: 404,
    statusMessage: 'Merchant not found',
  })
}


// Get runtime config outside of useHead
const config = useRuntimeConfig()

// SEO head configuration
useHead(() => {
  if (!merchant.value.business_name) return {}

  const baseUrl = config.public.browserUrlDomain || 'http://localhost:3000'

  return {
    title: `${merchant.value.business_name} Klump Commerce page`,
    meta: [
      {
        name: merchant.value.business_name,
        content: merchant.value.business_name,
      },
      {
        name: 'keywords',
        content:
          'Klump, BNPL, Buy Now Pay Later, Buy Now, Pay Later, Pay With Klump, Pay Small Small, 4 instalments, Useklump',
      },
      {
        property: 'og:title',
        content: merchant.value.business_name,
      },
      {
        property: 'og:description',
        content: merchant.value.business_name,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:url',
        content: `${baseUrl}/m/${merchant.value.id}`,
      },
      {
        name: 'twitter:url',
        content: `${baseUrl}/m/${merchant.value.id}`,
      },
      {
        name: 'twitter:title',
        content: merchant.value.business_name,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:description',
        content: merchant.value.business_name || '',
      },
      {
        name: 'twitter:image',
        content: merchant.value?.logo || '/favicon.ico',
      },
      {
        property: 'og:image',
        content: merchant.value?.logo || '/favicon.ico',
      },
    ],
  }
})
</script>

<template>
  <div v-if="merchant && merchant.business_name">
    <TemplatesKlumpMerchantProductListings
      :products="products"
      heading="Items"
      :merchant="merchant"
      :page-options="pageOptions"
      :loading="loading"
      @sortItems="sortItems"
      @paginate="handlePagination"
    />
  </div>
</template>
