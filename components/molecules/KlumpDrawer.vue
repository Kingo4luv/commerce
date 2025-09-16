<script setup lang="ts">
/** This is the general purpose drawer components used for cart and others */

type Position = 'left' | 'top' | 'bottom' | 'right'

interface Props {
  /** This determines if the drawer is open or closed */
  visible: boolean
  /** This is the title of the drawer */
  title?: string
  /** This is the confirm text of the drawer */
  confirmText?: string
  /** This is the general purpose heading components */
  closeText?: string
  /** This determines where the drawer is positioned */
  position?: Position
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  confirmText: '',
  closeText: '',
  position: 'right',
})

const emit = defineEmits<{
  close: []
}>()

const direction = computed(() => {
  if (props.position === 'left') {
    return 'top-0 left-0 h-full w-full md:w-3/5 xl:w-2/6'
  } else if (props.position === 'top') {
    return 'top-0 right-0 h-64 w-full'
  } else if (props.position === 'bottom') {
    return 'bottom-0 h-64 w-full'
  }
  return 'top-0 right-0 w-full md:w-3/5 xl:w-2/6 h-full'
})

const transitionEnter = computed(() => {
  if (props.position === 'left') {
    return '-translate-x-full'
  } else if (props.position === 'top') {
    return '-translate-y-full'
  } else if (props.position === 'bottom') {
    return 'translate-y-full'
  }
  return 'translate-x-full'
})

const transitionEnterTo = computed(() => {
  if (props.position === 'left') {
    return '-translate-x-0'
  } else if (props.position === 'top') {
    return '-translate-y-0'
  } else if (props.position === 'bottom') {
    return 'translate-y-0'
  }
  return 'translate-x-0'
})

const transitionLeaveFrom = computed(() => {
  if (props.position === 'left') {
    return '-translate-x-0'
  } else if (props.position === 'top') {
    return '-translate-y-0'
  } else if (props.position === 'bottom') {
    return 'translate-y-0'
  }
  return 'translate-x-0'
})

const transitionLeaveTo = computed(() => {
  if (props.position === 'left') {
    return '-translate-x-full'
  } else if (props.position === 'top') {
    return '-translate-y-full'
  } else if (props.position === 'bottom') {
    return 'translate-y-full'
  }
  return 'translate-x-full'
})

const close = () => {
  emit('close')
}
</script>

<template>
  <div class="z-40 relative">
    <transition
      enter-active-class="ease-in-out duration-500"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transform transition ease-in-out duration-500"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="props.visible"
        :tabindex="props.visible ? 0 : -1"
        class="fixed inset-0 w-full h-screen max-h-screen min-h-screen bg-black/50"
      >
        <transition
          enter-active-class="transform transition ease-in-out duration-500"
          :enter-from-class="transitionEnter"
          :enter-to-class="transitionEnterTo"
          leave-active-class="transform transition ease-in-out duration-500"
          :leave-from-class="transitionLeaveFrom"
          :leave-to-class="transitionLeaveTo"
        >
          <div
            v-if="props.visible"
            role="dialog"
            aria-label="checkout"
            :class="direction"
            class="absolute bg-white shadow-xl transform"
          >
            <AtomsKlumpButton
              id="close"
              override-styles="none absolute top-0 right-0 h-16 px-6 flex items-center justify-center"
              title="close"
              @clicked="close"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5625 2.31241L11.6874 0.4375L7 5.12509L2.31241 0.4375L0.4375 2.31241L5.12488 7L0.4375 11.6876L2.31241 13.5625L7 8.87491L11.6874 13.5625L13.5625 11.6876L8.87469 7L13.5625 2.31241Z"
                  fill="#171717"
                />
              </svg>
            </AtomsKlumpButton>
            <slot name="header" />
            <slot name="body" />
            <slot name="footer" />
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>
