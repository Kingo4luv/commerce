<script setup lang="ts">
/** The is a product listing loader components, to visualize the page's loading state */

interface Props {
  /** The props determines the numbers cards to display */
  numbersOfCards?: number
}

const props = withDefaults(defineProps<Props>(), {
  numbersOfCards: 4,
})

const cardsNumberArray = computed(() => {
  const cards = []
  for (let i = 1; i <= props.numbersOfCards; i++) {
    cards.push(i)
  }
  return cards
})
</script>

<template>
  <div
    v-for="i in cardsNumberArray"
    :key="i"
    class="w-full bg-white shadow-sm rounded-lg overflow-hidden animate-pulse"
  >
    <!-- Product Image Skeleton -->
    <div class="w-full h-48 bg-neutral-200"></div>

    <!-- Product Info Skeleton -->
    <div class="p-4 space-y-3">
      <!-- Product Name -->
      <div class="h-4 bg-neutral-200 rounded w-3/4"></div>

      <!-- Price -->
      <div class="h-5 bg-neutral-200 rounded w-1/2"></div>

      <!-- Merchant Name -->
      <div class="h-3 bg-neutral-200 rounded w-2/3"></div>
    </div>
  </div>
</template>
