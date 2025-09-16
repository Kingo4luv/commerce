<script setup lang="ts">
/** This is the accordion component */

interface Props {
  /** The title of the accordion */
  title: string
  /** The content of the accordion */
  content: string
}

const props = defineProps<Props>()

const open = ref(false)

const toggle = () => {
  open.value = !open.value
}
</script>

<template>
  <div class="w-full space-y-3 py-6 md:py-8">
    <button
      class="w-full flex justify-between items-center"
      @click="toggle"
    >
      <span class="text-lg md:text-xl font-semibold">
        {{ title }}
      </span>
      <span>
        <svg
          v-if="!open"
          width="25"
          height="25"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.01614 15C1.01614 7.27694 7.27694 1.01614 15 1.01614C22.7231 1.01614 28.9839 7.27694 28.9839 15C28.9839 22.7231 22.7231 28.9839 15 28.9839C7.27694 28.9839 1.01614 22.7231 1.01614 15Z"
            stroke="white"
            stroke-width="2.1"
          />
          <path
            d="M10.6453 13.5483L14.5162 17.4193L18.3872 13.5483"
            stroke="white"
            stroke-width="2.1"
          />
        </svg>
        <svg
          v-else
          width="25"
          height="25"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.01614 15C1.01614 22.7231 7.27694 28.9839 15 28.9839C22.7231 28.9839 28.9839 22.7231 28.9839 15C28.9839 7.27691 22.7231 1.01611 15 1.01611C7.27694 1.01611 1.01614 7.27691 1.01614 15Z"
            stroke="white"
            stroke-width="2.1"
          />
          <path
            d="M10.6453 16.4517L14.5162 12.5807L18.3872 16.4517"
            stroke="white"
            stroke-width="2.1"
          />
        </svg>
      </span>
    </button>
    <p
      v-if="open"
      class="text-base leading-7 max-w-6xl"
    >
      {{ content }}
    </p>
  </div>
</template>
