<script setup lang="ts">
/**
 * Search page - displays search results for products
 * Migrated from Nuxt 2 to Nuxt 3 with Composition API
 */

// Types
interface ProductImage {
  url: string
  altText: string
}

interface ProductMerchant {
  name: string
  slug: string
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
  merchant: ProductMerchant
}

interface PageOptions {
  limit: number
  offset: number
  total: number
}

// Get route and API
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }

// Reactive data
const heading = ref<string>('Search Results')
const products = ref<Product[]>([])
const pageOptions = ref<PageOptions>({ limit: 12, offset: 0, total: 0 })
const loading = ref<boolean>(false)

// Get search term from query - this is the key part
const searchTerm = computed(() => route.query.q as string)

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

// Fetch products with search - similar to Nuxt 2 getProducts method
const getProducts = async (limit = 12, offset = 0, sortValue: any = null) => {
  if (!searchTerm.value) {
    products.value = []
    heading.value = 'Search Results'
    return
  }

  try {
    loading.value = true

    const sortQuery = sortValue !== null ? `&${sortValue.query}=${sortValue.value}` : ''
    const query = `products/?query=${searchTerm.value}&limit=${limit}&offset=${offset}${sortQuery}`

    const data = await $api(query)

    products.value = data.data.map(transformProduct)
    pageOptions.value = {
      limit: data.limit || 12,
      offset: data.offset || 0,
      total: data.total || 0,
    }
    heading.value = `Search Results for: "${searchTerm.value}"`

    // Update URL to maintain search term - similar to Nuxt 2 behavior
    await router.push({
      path: '/search',
      query: {
        q: searchTerm.value,
        page: route.query.page,
        offset: offset.toString(),
        limit: limit.toString(),
      },
    })
  } catch (error: any) {
    products.value = []
    heading.value = `Search Results for: "${searchTerm.value}"`
  } finally {
    loading.value = false
  }
}

// Sort items handler - similar to Nuxt 2
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

// Watch for route changes - similar to Nuxt 2 watch
watch(
  () => route.query,
  newQuery => {
    if ((newQuery.page && newQuery.offset && newQuery.limit) || newQuery.q) {
      const limit = Number(newQuery.limit) || 12
      const offset = Number(newQuery.offset) || 0
      getProducts(limit, offset)
    }
  },
  { immediate: true }
)

// Initial data fetch using useAsyncData - similar to Nuxt 2 asyncData
const { data: initialData } = await useAsyncData(
  'search-results',
  async () => {
    // Get search term from query - exactly like Nuxt 2
    const searchTermFromQuery = route.query.q as string

    if (!searchTermFromQuery) {
      return {
        products: [],
        pageOptions: { limit: 12, offset: 0, total: 0 },
        heading: 'Search Results',
      }
    }

    try {
      const data = await $api(`products/?query=${searchTermFromQuery}`)

      return {
        products: data.data.map(transformProduct),
        pageOptions: {
          limit: data.limit || 12,
          offset: data.offset || 0,
          total: data.total || 0,
        },
        heading: `Search Results for: "${searchTermFromQuery}"`,
      }
    } catch (error: any) {
      return {
        products: [],
        pageOptions: { limit: 12, offset: 0, total: 0 },
        heading: `Search Results for: "${searchTermFromQuery}"`,
      }
    }
  },
  {
    default: () => ({
      products: [],
      pageOptions: { limit: 12, offset: 0, total: 0 },
      heading: 'Search Results',
    }),
  }
)

// Set initial data
if (initialData.value) {
  products.value = initialData.value.products
  pageOptions.value = initialData.value.pageOptions
  heading.value = initialData.value.heading
}
</script>

<template>
  <div>
    <TemplatesKlumpSearch
      :heading="heading"
      :products="products"
      :page-options="pageOptions"
      :loading="loading"
      @sortItems="sortItems"
      @paginate="handlePagination"
    />
  </div>
</template>
