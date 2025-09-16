<template>
  <div class="py-16 lg:py-32 w-full flex flex-col justify-center items-center space-y-4 px-4 xl:px-0">
    <h1 class="text-4xl lg:text-7xl font-bold text-primary tracking-wider">Oops!</h1>
    <h3 class="text-xl lg:text-3xl font-semibold uppercase">{{ error.statusCode }} - {{ error.message }}</h3>
    <p class="max-w-2xl text-center text-sm lg:text-base text-black">
      The page you are looking might have been removed or have its name changed. Kindly confirm with the merchant to get
      a valid link
    </p>
    <div class="pt-3 w-full max-w-xs">
      <AtomsKlumpButton
        type="primary"
        radius="all"
        href="/"
        weight="normal"
        >Continue Shopping</AtomsKlumpButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'
const props = defineProps<{ error: { statusCode: number; message: string } }>()

useHead({
  title: 'Klump Commerce - 404 - Page not found',
  meta: [
    {
      name: 'description',
      content:
        'The page you are looking might have been removed or have its name changed. Kindly confirm with the merchant to get a valid link',
    },
  ],
})
</script>
