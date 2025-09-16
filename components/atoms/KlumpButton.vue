<template>
  <div>
    <button
      v-if="href === ''"
      :id="id"
      :disabled="disabled"
      :aria-label="title"
      class="flex"
      :class="mainClass"
      @click="$emit('clicked')"
    >
      <slot></slot>
    </button>
    <a
      v-else
      :id="id"
      :href="href"
      :title="title"
      :target="target"
      class="inline-flex"
      :class="mainClass"
    >
      <slot></slot>
    </a>
  </div>
</template>

<script setup lang="ts">
/** The general purpose button components */

// Define interfaces for props
interface Props {
  /** This is an optional href props to turn a button to a link */
  href?: string
  /** The button type (primary or secondary) */
  type?: string
  /** This is to provide accessibility values for aria-label or title */
  title?: string
  /** This is to add custom styles to overwrite the button styles */
  overrideStyles?: string
  /** This is to add border radius to the button */
  radius?: 'top' | 'bottom' | 'left' | 'right' | 'all' | 'none'
  /** This determine the font weight of button */
  weight?: 'bold' | 'normal' | 'extrabold'
  /** This determines if the button is disabled or not */
  disabled?: boolean
  /** This props helps to determine where the link will open (self or blank) */
  target?: string
  /** This is the id of the button */
  id?: string
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  href: '',
  type: 'primary',
  title: '',
  overrideStyles: '',
  radius: 'none',
  weight: 'bold',
  disabled: false,
  target: '',
  id: '',
})

// Define emits
const emit = defineEmits<{
  clicked: []
}>()

// Computed properties
const btnClass = computed(() => {
  if (props.type === 'primary') {
    return 'bg-primary text-white hover:bg-deep-blue-500 focus:bg-deep-blue-500'
  }
  return 'bg-white text-primary border border-primary'
})

const defaultClass = computed(() => {
  return ' px-4 py-2 h-[50px] w-full rounded-sm inline-flex justify-center items-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed'
})

const rounded = computed(() => ({
  top: 'rounded-t',
  bottom: 'rounded-b',
  left: 'rounded-l',
  right: 'rounded-r',
  all: 'rounded',
  none: '',
}))

const fontWeight = computed(() => ({
  bold: 'font-bold',
  normal: 'font-normal',
  extrabold: 'font-extrabold',
}))

const mainClass = computed(() => {
  if (props.overrideStyles !== '') {
    return props.overrideStyles
  }
  return `${btnClass.value}${defaultClass.value} ${rounded.value[props.radius]} ${fontWeight.value[props.weight]}`
})
</script>
