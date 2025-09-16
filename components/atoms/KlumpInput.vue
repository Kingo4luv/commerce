<script setup lang="ts">
import { nanoid } from 'nanoid'

/** A base text input that can be set to multiple types. */

type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'

interface Props {
  /** input type */
  type?: InputType
  /** Value from parent to bind with */
  modelValue?: string
  /** Id of the input */
  id?: string
  /** Placeholder of the input */
  placeholder?: string
  /** label of the input */
  label?: string
  /** Custom style for the input */
  overrideStyles?: string
  /** this help to check if dark theme is allowed for this input */
  allowDarkTheme?: boolean
  /** This is for the input ref */
  inputRef?: string
  /** This is for the error message */
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  id: '',
  placeholder: '',
  label: '',
  overrideStyles: '',
  allowDarkTheme: false,
  inputRef: '',
  error: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  blur: []
  esc: []
}>()

// unique ID for the input. used to programmatically link instructions, label, and errors
const inputId = ref('')

onMounted(() => {
  inputId.value = props.id !== '' ? props.id : nanoid()
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', target.value)
}

const handleBlur = () => {
  emit('blur')
}

const handleEsc = () => {
  emit('esc')
}
</script>

<template>
  <div class="w-full relative">
    <input
      :id="inputId"
      :ref="inputRef"
      :value="modelValue"
      :disabled="disabled"
      :type="type"
      :placeholder="placeholder"
      :aria-label="label !== '' ? 'text-input' : ''"
      class="block w-full h-[44px] lg:h-[52px] text-sm md:texl-text-base px-3 focus:outline-none | bg-white placeholder-[#9b9b9b] border border-neutral-100 text-black focus:ring-blue focus:border-blue"
      :class="`${overrideStyles} text-black`"
      @input="handleInput"
      @blur="handleBlur"
      @keydown.esc="handleEsc"
    />
    <span
      v-if="error !== ''"
      class="text-sm text-red-600 mt-1"
      >{{ error }}</span
    >
    <slot />
  </div>
</template>
