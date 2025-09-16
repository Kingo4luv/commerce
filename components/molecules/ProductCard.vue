/** This is the general purpose card components used for product and categories */
<script setup lang="ts">
interface Props {
  /** This is the product object */
  product: any
}

const props = withDefaults(defineProps<Props>(), {
  product: () => ({}),
})
</script>

<template>
  <article class="w-full bg-white p-2 md:p-4 hover:shadow-xl border border-gray-100 rounded-md relative group">
    <slot name="cartIcon" />
    <nuxt-link
      :to="product.url"
      class="w-full block space-y-1"
    >
      <div class="md:h-60 h-48 mb-3">
        <AtomsKlumpImage
          :url="product.image.url"
          :alt-text="product.image.altText"
          class="object-scale-down"
          radius="all"
        />
      </div>
      <slot />
    </nuxt-link>
  </article>
</template>
