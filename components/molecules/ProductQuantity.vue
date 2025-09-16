<script setup lang="ts">
/** This is the product quantity button components */

interface Props {
  /** This is the quantity value passed from parent */
  value: number
}

defineProps<Props>()

const emit = defineEmits<{
  decrement: []
  increment: []
}>()

const handleDecrement = () => {
  emit('decrement')
}

const handleIncrement = () => {
  emit('increment')
}
</script>

<template>
  <div
    id="quantityBtn"
    class="w-full h-full flex items-center border border-black rounded space-x-2"
  >
    <AtomsKlumpButton
      id="decrement"
      title="decrement"
      override-styles="w-full h-8 w-8 flex justify-center items-center rounded-none bg-transparent px-2 md:px-4"
      @clicked="handleDecrement"
    >
      <svg
        width="8"
        height="2"
        viewBox="0 0 8 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.5 0.5H7.5V1.5H0.5V0.5Z"
          fill="#171717"
        />
      </svg>
    </AtomsKlumpButton>
    <p class="w-full text-sm flex-1 text-center text-ellipsis whitespace-nowrap">{{ value }}</p>
    <AtomsKlumpButton
      id="increment"
      title="increment"
      override-styles="w-full h-8 w-8 flex justify-center items-center rounded-none bg-transparent px-2 md:px-4"
      @clicked="handleIncrement"
    >
      <svg
        width="8"
        height="8"
        viewBox="0 0 6 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.375 2.625V0H2.625V2.625H0V3.375H2.625V6H3.375V3.375H6V2.625H3.375Z"
          fill="#171717"
        />
      </svg>
    </AtomsKlumpButton>
  </div>
</template>
