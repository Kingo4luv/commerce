<script setup lang="ts">
import { nanoid } from 'nanoid'
import { onClickOutside } from '@vueuse/core'

/** This is the select dropdown component */

interface SelectItem {
  name: string
  value: string | number
  [key: string]: any
}

type RadiusType = 'normal' | 'full'
type RadiusSide = 'both' | 'left' | 'right' | 'none'

interface Props {
  /** This is select dropdown items */
  items: SelectItem[]
  /** This is the label of the select box */
  label?: string
  /** Id of the select input */
  id?: string
  /** This is the value to bind to v-model on parent */
  value?: string
  /** This is additional class for custom design */
  additionalClass?: string
  /** This determine what the select will be used for */
  type?: string
  /** This is select border radius */
  radius?: RadiusType
  /** This is select border radius position */
  radiusSide?: RadiusSide
  /** this help to check if dark theme is allowed for this input */
  allowDarkTheme?: boolean
  allowDefaultOption?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Lowest Price',
  id: '',
  value: '',
  additionalClass: '',
  type: 'sort',
  radius: 'full',
  radiusSide: 'none',
  allowDarkTheme: false,
  allowDefaultOption: false,
})

const emit = defineEmits<{
  change: [value: string]
}>()

const isOpen = ref(false)
const focusedIndex = ref(0)
const selectedItem = ref('')
const inputId = ref('')
const dropdown = ref<HTMLElement | null>(null)

const radiusPosition: Record<RadiusSide, string> = {
  left: 'rounded-l',
  right: 'rounded-r',
  both: 'rounded',
  none: '',
}

const rounded = computed(() => {
  return {
    full: `${radiusPosition[props.radiusSide]}-full`,
    normal: `${radiusPosition[props.radiusSide]}`,
  }
})

const options = computed(() => {
  /** Adds a default all selected option selectable options */
  const defaultOption = props.allowDefaultOption ? [{ name: 'All', value: '' }] : []
  return [...defaultOption, ...props.items]
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  // Announce dropdown state to screen readers
  if (isOpen.value) {
    // Focus first option when opening
    nextTick(() => {
      if (dropdown.value && dropdown.value.children[0]) {
        ;(dropdown.value.children[0] as HTMLElement).focus()
      }
    })
  } else {
    // Return focus to button when closing
    nextTick(() => {
      const button = document.getElementById(inputId.value)
      if (button) {
        button.focus()
      }
    })
  }
}

const closeDropdown = () => {
  isOpen.value = false
}

/** This triggers arrow key navigation */
const startArrowKeys = () => {
  if (isOpen.value && dropdown.value) {
    const firstChild = dropdown.value.children[0] as HTMLElement
    if (firstChild) {
      firstChild.focus()
    }
  }
}

/** This handle previous element focus */
const focusPrevious = (isArrowKey: boolean) => {
  if (focusedIndex.value > 0) {
    focusedIndex.value = focusedIndex.value - 1
    focusItem()
  }
}

/** This handle next element focus */
const focusNext = (isArrowKey: boolean) => {
  if (isOpen.value && focusedIndex.value < options.value.length - 1) {
    focusedIndex.value = focusedIndex.value + 1
    focusItem()
  }
}

const focusItem = () => {
  if (dropdown.value) {
    const targetChild = dropdown.value.children[focusedIndex.value] as HTMLElement
    if (targetChild) {
      targetChild.focus()
    }
  }
}

const selectItem = (item: SelectItem, index: number) => {
  emit('change', item.name)
  selectedItem.value = item.name
  focusedIndex.value = index
  closeDropdown()
  // Return focus to the button after selection
  nextTick(() => {
    const button = document.getElementById(inputId.value)
    if (button) {
      button.focus()
    }
  })
}

const selectFocusedItem = () => {
  if (options.value[focusedIndex.value]) {
    selectItem(options.value[focusedIndex.value], focusedIndex.value)
  }
}

onMounted(() => {
  inputId.value = props.id !== '' ? props.id : nanoid()
})

// Close dropdown when clicking outside
onClickOutside(dropdown, () => {
  if (isOpen.value) {
    closeDropdown()
  }
})
</script>

<template>
  <button
    :id="inputId"
    type="button"
    aria-label="filter"
    :aria-expanded="isOpen"
    :aria-haspopup="true"
    :aria-labelledby="`${inputId}-label`"
    class="w-full bg-white h-full relative flex items-center z-20 border border-gray-200"
    :class="`${radius === 'full' && radiusSide === 'left' ? 'rounded-l-full' : ''} ${rounded[radius]} ${additionalClass}`"
    @click="toggleDropdown"
    @keydown.esc.exact="closeDropdown"
    @keydown.up.exact.prevent="startArrowKeys"
    @keydown.down.exact.prevent="startArrowKeys"
  >
    <div class="w-full flex justify-between items-center text-black px-4">
      <div class="flex items-center space-x-2">
        <p
          :id="`${inputId}-label`"
          class="text-xs md:text-sm xl:block text-black"
        >
          <span class="hidden md:inline">{{ type === 'sort' ? 'Sort by: ' : '' }}</span
          >{{ selectedItem !== '' ? selectedItem : label }}
        </p>
      </div>
      <span aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </span>
    </div>

    <ul
      v-show="isOpen"
      ref="dropdown"
      role="listbox"
      :aria-labelledby="`${inputId}-label`"
      :tabindex="isOpen ? '0' : '-1'"
      class="absolute top-[30px] lg:top-[40px] left-0 right-0 rounded w-full max-h-72 py-2 border border-gray-200 overflow-y-auto bg-white shadow-lg z-30"
    >
      <li
        v-for="(item, i) in options"
        :key="i"
        role="option"
        :aria-selected="selectedItem === item.name"
        :tabindex="isOpen ? '0' : '-1'"
        :class="`px-3 md:pl-6 md:pr-0 text-left text-sm text-black py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center justify-between ${focusedIndex === i ? 'bg-gray-200' : ''}`"
        @click.stop="selectItem(item, i)"
        @keydown.up.exact.prevent="focusPrevious(true)"
        @keydown.down.exact.prevent="focusNext(true)"
        @keydown.esc.exact="closeDropdown"
        @keydown.enter.exact="selectFocusedItem"
        @keydown.space.exact.prevent="selectFocusedItem"
      >
        <span class="text-sm md:text-base">{{ item.name }}</span>
        <span
          v-if="selectedItem === item.name"
          class="pr-0 sm:pr-4"
          aria-hidden="true"
        >
          <svg
            width="9"
            height="8"
            viewBox="0 0 9 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.96997 0.969986C7.11084 0.835875 7.2983 0.761733 7.49279 0.763205C7.68728 0.764677 7.8736 0.841647 8.01242 0.977874C8.15124 1.1141 8.23172 1.29893 8.23686 1.49336C8.242 1.68779 8.1714 1.87661 8.03997 2.01999L4.04997 7.00999C3.98137 7.08389 3.89856 7.14319 3.80651 7.18435C3.71445 7.22552 3.61505 7.2477 3.51423 7.24956C3.41341 7.25143 3.31324 7.23295 3.21973 7.19522C3.12622 7.15749 3.04127 7.10129 2.96997 7.02999L0.323975 4.38399C0.250288 4.31532 0.191186 4.23252 0.150194 4.14052C0.109202 4.04853 0.0871596 3.94921 0.0853828 3.84851C0.083606 3.74781 0.102131 3.64778 0.139852 3.55439C0.177573 3.461 0.233718 3.37617 0.304936 3.30495C0.376155 3.23373 0.460989 3.17758 0.554377 3.13986C0.647765 3.10214 0.747794 3.08362 0.848497 3.08539C0.9492 3.08717 1.04851 3.10921 1.14051 3.15021C1.23251 3.1912 1.31531 3.2503 1.38397 3.32399L3.47797 5.41699L6.95097 0.991987C6.95723 0.984288 6.9639 0.976943 6.97097 0.969986H6.96997Z"
              fill="#171717"
            />
          </svg>
        </span>
      </li>
    </ul>
  </button>
</template>
