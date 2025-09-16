<template>
  <img
    :src="url"
    :alt="altText"
    class="w-full h-full object-center z-10 relative"
    :class="`${rounded[radius]} object-${objectFit}`"
    @load="onImageLoaded"
  />
</template>

<script setup lang="ts">
/** This is the general purpose image components. All images uses this components */

// Define interfaces for props
interface Props {
  /** This is the source of the image */
  url?: string
  /** This is to add alt text to the image */
  altText: string
  /** This determines if the images has rounded edges */
  radius?: 'top' | 'bottom' | 'left' | 'right' | 'all' | 'none'
  /** This is the image object fit */
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  url: '',
  radius: 'none',
  objectFit: 'cover',
})

// Define emits
const emit = defineEmits<{
  'image-loaded': []
}>()

// Computed properties
const rounded = computed(() => ({
  top: 'rounded-t',
  bottom: 'rounded-b',
  left: 'rounded-l',
  right: 'rounded-r',
  all: 'rounded',
  none: '',
}))

// Methods
const onImageLoaded = () => {
  setTimeout(() => {
    emit('image-loaded')
  }, 8000)
}
</script>
