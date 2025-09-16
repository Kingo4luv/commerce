<script setup lang="ts">
/** This is the product details page image gallery components */

interface GalleryImage {
  url: string
  id?: string
  altText?: string
  [key: string]: any
}

interface Props {
  /** This is the array of images to display in the gallery */
  images: GalleryImage[]
  mode?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'column',
})

const show = ref(true)
const debounce = ref<NodeJS.Timeout | null>(null)
const currentIndex = ref(0)
const showLoader = ref(true)

const chooseCurrent = (index: number) => {
  if (debounce.value) {
    clearTimeout(debounce.value)
  }
  debounce.value = setTimeout(() => {
    currentIndex.value = index
  }, 300)
}

const handleImageLoaded = () => {
  showLoader.value = false
}
</script>

<template>
  <div
    class="w-full"
    :class="
      mode === 'column'
        ? 'h-full flex flex-col-reverse lg:flex-row space-x-0 lg:space-x-3'
        : 'flex flex-col-reverse space-x-0'
    "
  >
    <div
      class="w-full overflow-auto"
      :class="
        mode === 'column' ? 'lg:w-28 flex flex-row lg:flex-col space-x-1 lg:space-x-0' : 'flex flex-row space-x-1'
      "
    >
      <div
        v-for="(gallery, index) in images"
        :key="index"
        class="image-gallery flex-none mb-2 cursor-pointer"
        :class="{
          'opacity-100 border-2 border-black rounded-md': index === currentIndex,
          'opacity-40': index !== currentIndex,
          'w-1/5 lg:w-full h-16 md:h-32 lg:h-20': mode === 'column',
          'w-1/5 h-16': mode === 'row',
        }"
        @mouseenter="chooseCurrent(index)"
      >
        <AtomsKlumpImage
          :src="gallery.url"
          :alt-text="gallery.altText || gallery.id || 'Product image'"
          radius="all"
        />
      </div>
    </div>
    <div
      class="preview-image w-full mb-2 relative"
      :class="mode === 'column' ? 'h-[300px] md:h-[600px] lg:min-h-[600px] max-h-[600px]' : 'h-[200px] md:h-auto'"
    >
      <div
        v-if="showLoader"
        class="w-full h-full flex absolute inset-0 justify-center items-center z-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 lg:w-32 lg:h-32"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          style="display: block; margin: auto; shape-rendering: auto"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="#494243"
            stroke-width="10"
            r="35"
            stroke-dasharray="164.93361431346415 56.97787143782138"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="1s"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
            ></animateTransform>
          </circle>
        </svg>
      </div>
      <div class="w-full h-full bg-gray-50">
        <AtomsKlumpImage
          :src="images[currentIndex].url"
          :alt-text="images[currentIndex].altText || images[currentIndex].id || 'Product image'"
          class="object-scale-down"
          radius="all"
          @image-loaded="handleImageLoaded"
        />
      </div>
    </div>
  </div>
</template>
