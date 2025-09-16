<script setup lang="ts">
/**
 * Sub-category page - displays products by sub-category
 * Migrated from Nuxt 2 to Nuxt 3 with Composition API
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

interface SubCategory {
  name: string
  slug: string
  icon?: string
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
const heading = ref<string>('')
const subcategory = ref<SubCategory>({ name: '', slug: '' })
const products = ref<Product[]>([])
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

// Fetch products by sub-category
const getProducts = async (limit = 12, offset = 0, sortValue: any = null) => {
  try {
    loading.value = true
    const slug = route.params.slug as string

    const sortQuery = sortValue !== null ? `&${sortValue.query}=${sortValue.value}` : ''
    const query = `products?subCategory=${slug}&limit=${limit}&offset=${offset}${sortQuery}`

    const data = await $api(query)

    products.value = data.data.map(transformProduct)
    subcategory.value = data.group.sub_category
    heading.value = data.group.sub_category.name
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

// Initial data fetch using useAsyncData
const { data: initialData } = await useAsyncData(
  'subcategory-products',
  async () => {
    const slug = route.params.slug as string

    try {
      const data = await $api(`products?subCategory=${slug}&limit=12&offset=0`)

      return {
        products: data.data.map(transformProduct),
        subcategory: data.group.sub_category,
        heading: data.group.sub_category.name,
        pageOptions: {
          limit: data.limit,
          offset: data.offset,
          total: data.total,
        },
      }
    } catch (error: any) {
      throw createError({
        statusCode: error?.response?.statusCode ?? 404,
        statusMessage: error?.response?.data?.message ?? 'Sub-category not found',
      })
    }
  },
  {
    default: () => ({
      products: [],
      subcategory: { name: '', slug: '' },
      heading: '',
      pageOptions: { limit: 12, offset: 0, total: 0 },
    }),
  }
)

// Set initial data
if (initialData.value) {
  products.value = initialData.value.products
  subcategory.value = initialData.value.subcategory
  heading.value = initialData.value.heading
  pageOptions.value = initialData.value.pageOptions
}

// Get runtime config outside of useHead
const config = useRuntimeConfig()

// SEO head configuration
useHead(() => {
  if (!heading.value) return {}

  const baseUrl = config.public.browserUrlDomain || 'http://localhost:3000'

  return {
    title: `${heading.value} sub-category page | Klump Commerce`,
    meta: [
      {
        name: heading.value,
        content: heading.value,
      },
      {
        name: 'keywords',
        content:
          'Klump, BNPL, Buy Now Pay Later, Buy Now, Pay Later, Pay With Klump, Pay Small Small, 4 instalments, Useklump',
      },
      {
        property: 'og:title',
        content: heading.value,
      },
      {
        property: 'og:description',
        content: heading.value,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:url',
        content: `${baseUrl}/sc/${subcategory.value.slug}`,
      },
      {
        name: 'twitter:url',
        content: `${baseUrl}/sc/${subcategory.value.slug}`,
      },
      {
        name: 'twitter:title',
        content: heading.value,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:description',
        content: heading.value || '',
      },
      {
        name: 'twitter:image',
        content: subcategory.value?.icon || '/favicon.ico',
      },
      {
        property: 'og:image',
        content: subcategory.value?.icon || '/favicon.ico',
      },
    ],
  }
})
</script>

<template>
  <div>
    <TemplatesKlumpCategory
      :heading="heading"
      :products="products"
      :page-options="pageOptions"
      :loading="loading"
      @sortItems="sortItems"
    />
  </div>
</template>
