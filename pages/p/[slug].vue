<script setup lang="ts">
/**
 * Product details page - displays individual product information
 * Migrated from Nuxt 2 to Nuxt 3 with Composition API
 */

// Types
interface ProductImage {
  url: string
  altText: string
}

interface ProductMerchant {
  id: string
  business_name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  quantity: number
  summary?: string
  preview_image: string
  merchant: ProductMerchant
  [key: string]: any
}

interface MerchantProduct {
  id: string
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

// Get route and API
const route = useRoute()
const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }

// Reactive data
const product = ref<Product>({} as Product)
const merchantProduct = ref<MerchantProduct[]>([])
const merchantShippingData = ref<any>({})

// Transform merchant product data
const transformMerchantProduct = (product: any): MerchantProduct => ({
  id: String(product.id),
  name: product.name,
  slug: product.slug,
  url: `/p/${product.slug}`,
  price: product.price,
  old_price: product.old_price,
  discount: product.discount,
  image: {
    url: product.preview_image,
    altText: product.name || 'Product image',
  },
  merchant: {
    name: product.merchant.business_name,
    slug: product.merchant.slug,
  },
})

// Initial data fetch using $fetch directly
const slug = route.params.slug as string

try {
  // Fetch product details
  const response = await $api(`/products/${slug}`)

  // Check if response has data property
  if (!response || !response.data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    })
  }

  // Extract product data from response wrapper
  const productData = response.data

  // Validate product data
  if (!productData || !productData.id) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    })
  }

  const transformedProduct = {
    ...productData,
    id: String(productData.id),
    merchant: {
      ...productData.merchant,
      id: String(productData.merchant.id),
    },
    // Use gallery images if available, otherwise fallback to preview_image
    images:
      productData.gallery && productData.gallery.length > 0
        ? productData.gallery.map((img: any) => ({
            url: img.url,
            altText: productData.name || 'Product image',
          }))
        : productData.preview_image
          ? [
              {
                url: productData.preview_image,
                altText: productData.name || 'Product image',
              },
            ]
          : [],
  }

  // Fetch merchant products (excluding current product)
  const merchantProductsResponse = await $api(`products?merchant=${productData.merchant.slug}`)

  let filteredProducts: MerchantProduct[] = []
  if (merchantProductsResponse && merchantProductsResponse.data) {
    const merchantProductsData = merchantProductsResponse.data
    filteredProducts = merchantProductsData
      .filter((p: any) => p.id !== productData.id)
      .map(transformMerchantProduct)
      .sort(() => (Math.random() > 0.5 ? 1 : -1))
  }

  // Fetch merchant shipping data
  let shippingData = {}
  try {
    const shippingResponse = await $api(`/merchants/${productData.merchant.id}/shipping`)
    shippingData = shippingResponse || {}
  } catch (shippingError) {
    shippingData = {}
  }

  // Set the data directly
  product.value = transformedProduct
  merchantProduct.value = filteredProducts
  merchantShippingData.value = shippingData
} catch (error: any) {
  // If it's already a createError, re-throw it
  if (error.statusCode) {
    throw error
  }
  // Otherwise, create a new error
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  })
}

// Watch for route changes and update data
watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      // Re-fetch data when route changes
      try {
        const response = await $api(`/products/${newSlug}`)
        if (response && response.data && response.data.id) {
          const productData = response.data
          const transformedProduct = {
            ...productData,
            id: String(productData.id),
            merchant: {
              ...productData.merchant,
              id: String(productData.merchant.id),
            },
            images:
              productData.gallery && productData.gallery.length > 0
                ? productData.gallery.map((img: any) => ({
                    url: img.url,
                    altText: productData.name || 'Product image',
                  }))
                : productData.preview_image
                  ? [
                      {
                        url: productData.preview_image,
                        altText: productData.name || 'Product image',
                      },
                    ]
                  : [],
          }
          product.value = transformedProduct
        }
      } catch (error) {
        // Handle route change errors
        throw createError({
          statusCode: 404,
          statusMessage: 'Product not found',
        })
      }
    }
  },
  { immediate: false }
)

// Get runtime config outside of useHead
const config = useRuntimeConfig()

// SEO head configuration
useHead(() => {
  if (!product.value || !product.value.name || !product.value.merchant) return {}

  const baseUrl = config.public.browserUrlDomain || 'http://localhost:3000'

  return {
    title: `${product.value.name} by ${product.value.merchant.business_name} | Klump Commerce`,
    meta: [
      {
        name: product.value.name,
        content: product.value.summary || '',
      },
      {
        name: 'keywords',
        content:
          'Klump, BNPL, Buy Now Pay Later, Buy Now, Pay Later, Pay With Klump, Pay Small Small, 4 instalments, Useklump',
      },
      {
        property: 'og:title',
        content: product.value.name,
      },
      {
        property: 'og:description',
        content: product.value.summary || '',
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:url',
        content: `${baseUrl}/p/${product.value.id}`,
      },
      {
        name: 'twitter:url',
        content: `${baseUrl}/p/${product.value.id}`,
      },
      {
        name: 'twitter:title',
        content: product.value.name,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:description',
        content: product.value.summary || '',
      },
      {
        name: 'twitter:image',
        content: product.value.preview_image || '/favicon.ico',
      },
      {
        property: 'og:image',
        content: product.value.preview_image || '/favicon.ico',
      },
    ],
  }
})
</script>

<template>
  <div v-if="product && product.name">
    <TemplatesKlumpProductDetails
      :product="product"
      :merchant-product="merchantProduct"
      :merchant-shipping-data="merchantShippingData"
    />
  </div>
</template>
