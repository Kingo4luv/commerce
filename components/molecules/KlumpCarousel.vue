<script setup lang="ts">
/** This is the homepage carousel */

interface CarouselImage {
  url: string
  [key: string]: any
}

interface Props {
  /** This is to determine if the carousel should autoplay */
  autoplay: boolean
  /** This is then interval between slides */
  interval?: number
  /** This is the array of images */
  images: CarouselImage[]
}

const props = withDefaults(defineProps<Props>(), {
  interval: 3000,
})

let timeout: NodeJS.Timeout | null = null

const show = ref(true)
const currentIndex = ref(0)

const activeOptionIndex = computed(() => {
  return props.images.findIndex((x, index) => index === currentIndex.value || index === currentIndex.value)
})

const prevOptionIndex = computed(() => {
  const next = activeOptionIndex.value - 1
  return next >= 0 ? next : props.images.length - 1
})

const nextOptionIndex = computed(() => {
  const next = activeOptionIndex.value + 1
  return next <= props.images.length - 1 ? next : 0
})

const makeInvisible = () => {
  if (props.autoplay) {
    timeout = setTimeout(() => {
      show.value = false
      makeVisible()
    }, props.interval)
  }
}

const makeVisible = () => {
  currentIndex.value = nextOptionIndex.value
  show.value = true
  makeInvisible()
}

const next = () => {
  show.value = false
  currentIndex.value = nextOptionIndex.value
  show.value = true
}

const prev = () => {
  show.value = false
  currentIndex.value = prevOptionIndex.value
  show.value = true
}

const selectCurrent = (index: number) => {
  show.value = false
  currentIndex.value = index
  show.value = true
  if (timeout) {
    clearTimeout(timeout)
  }
  continueTiming()
}

const clearTiming = () => {
  if (timeout) {
    clearTimeout(timeout)
  }
}

const continueTiming = () => {
  makeInvisible()
}

onMounted(() => {
  makeInvisible()
})

onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout)
  }
})
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full h-full relative overflow-hidden">
      <div
        v-show="show"
        class="w-full h-full absolute"
        @mouseenter="clearTiming"
        @mouseleave="continueTiming"
      >
        <img
          :src="images[currentIndex].url"
          class="w-full h-full object-center object-fill md:object-cover"
          alt="klump"
        />
      </div>
      <div class="absolute bottom-3 md:bottom-6 left-0 w-full flex justify-center items-center">
        <div class="flex space-x-2">
          <AtomsKlumpButton
            v-for="(img, i) in images"
            :key="i"
            :title="`${i}`"
            :override-styles="`block h-[7px] cursor-pointer rounded focus:outline-none ${currentIndex === i ? 'bg-white w-6' : 'bg-gray-200 w-3'}`"
            @clicked="selectCurrent(i)"
          ></AtomsKlumpButton>
        </div>
      </div>
    </div>
  </div>
</template>
