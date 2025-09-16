<script setup lang="ts">
/** A base text input label */

interface Props {
  /** This is the id of the label that binds the input to the for attributes */
  id?: string
  /** label text */
  text?: string
  /** Custom style for the label */
  overrideStyles?: string
  /** this help to check if dark theme is allowed for this input */
  allowDarkTheme?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  text: '',
  overrideStyles: '',
  allowDarkTheme: false,
})

const labelStyles = computed(() => {
  return props.overrideStyles !== '' ? props.overrideStyles : 'text-black text-sm font-bold'
})
</script>

<template>
  <label
    :for="id"
    :class="labelStyles"
    >{{ text }}</label
  >
</template>
