<script setup lang="ts">
/** This is the checkbox component */

interface CheckboxItem {
  name: string
  [key: string]: any
}

interface Props {
  /** This is array of checkbox items */
  items: CheckboxItem[]
  /** This is the value to bind with parent v-model */
  value?: string
  /** This is the checked items to persist checkbox state */
  checkedItems?: string[]
  /** This is the returned facets */
  facets?: any[]
  /** This checkbox theme (Primary / secondary) */
  theme?: 'primary' | 'secondary'
  /** This optional checkbox label */
  label?: string
  /** Custom style for the checkbox */
  inputOverrideStyles?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  checkedItems: () => [],
  facets: () => [],
  theme: 'primary',
  label: '',
  inputOverrideStyles: '',
})

const emit = defineEmits<{
  change: [value: string]
}>()

/**
 * Uses inputOverrideStyles when set
 * else uses default text-black for primary theme
 */
const computedStyle = computed(() => {
  return props.inputOverrideStyles ? props.inputOverrideStyles : 'text-black'
})

const handleChange = (itemName: string) => {
  emit('change', itemName)
}
</script>

<template>
  <div class="w-full border border-transparent bg-transparent">
    <ul class="flex space-x-4">
      <li
        v-for="(item, itemIndex) in items"
        :key="itemIndex"
        class="py-1"
      >
        <label class="inline-flex items-center">
          <input
            :class="`form-checkbox w-4 h-4 focus:outline-none focus:ring-transparent disabled:opacity-25 rounded border-grey-border mr-2 focus:border-blue ${theme === 'primary' ? 'text-primary' : 'text-black'}`"
            type="checkbox"
            :value="value"
            :checked="checkedItems.includes(item.name)"
            @change="handleChange(item.name)"
          />
          <span
            class="text-sm text-black"
            :class="theme === 'primary' ? computedStyle : 'text-black'"
          >
            {{ item.name }}
          </span>
        </label>
      </li>
    </ul>
  </div>
</template>
