<script setup lang="ts">
/**
 * Payment success page - displays payment confirmation
 * Migrated from Nuxt 2 to Nuxt 3 with Composition API
 */

// Set layout
definePageMeta({
  layout: 'no-layout',
})

// Handle payment success
const goBack = () => {
  if (process.client && typeof window !== 'undefined') {
    window.parent.postMessage({ event: 'closePaymentModal' }, '*')
  }
}

// Handle URL parameters on mount
onMounted(() => {
  if (process.client && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get('status')
    const ref = urlParams.get('ref')

    if (status === 'success' && ref !== null) {
      const message = { event: 'paymentSuccess', message: ref }
      window.parent.postMessage(message, '*')
    }
  }
})
</script>

<template>
  <div class="flex items-center justify-center max-w-sm mx-auto bg-gray-100 rounded">
    <div class="px-6 py-12 max-w-sm bg-white rounded-md shadow-lg">
      <div class="flex flex-col items-center">
        <svg
          class="w-16 h-16 text-green-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 class="mb-2 text-lg font-medium text-gray-900">Payment Successful!</h3>
        <p class="text-gray-600 text-center">Your payment has been processed successfully.</p>
        <div class="mt-6 w-full">
          <AtomsKlumpButton
            type="primary"
            radius="all"
            @clicked="goBack"
            >Close</AtomsKlumpButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
