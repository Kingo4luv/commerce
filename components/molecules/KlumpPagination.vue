<script setup lang="ts">
/** This is the general purpose pagination components */

interface Props {
  /** The current page */
  page: number
  /** The total number of pages */
  numPages: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  paginate: [payload: { direction: string; jump?: number }]
}>()

/** Creates the page links based on the number of pages */
const createPagingLinks = () => {
  if (props.page > 3) {
    const pages: (number | string)[] = []
    if (props.page - 2 > 0) {
      pages.push(props.page - 2)
    }
    if (props.page - 1 > 0) {
      pages.push(props.page - 1)
    }
    pages.push(props.page)
    if (props.page + 1 <= props.numPages) {
      pages.push(props.page + 1)
    }
    if (props.page + 2 <= props.numPages) {
      pages.push(props.page + 2)
    }
    if (!pages.includes(1)) {
      if (!pages.includes(2)) {
        if (!pages.includes('...')) {
          pages.unshift('...')
        }
      }
      pages.unshift(1)
    }
    if (!pages.includes(props.numPages - 1)) {
      if (!pages.includes('...')) {
        pages.push('...')
      }
    }
    if (!pages.includes(props.numPages)) {
      pages.push(props.numPages)
    }
    return pages
  } else {
    return [1, 2, 3, 4, 5, '...', props.numPages]
  }
}

const navigatePage = (pageNum: number) => {
  if (props.page === pageNum) {
    return
  }
  emit('paginate', {
    direction: pageNum < props.page ? 'back' : 'forward',
    jump: Math.abs(pageNum - props.page),
  })
}

const handlePrevious = () => {
  emit('paginate', { direction: 'back' })
}

const handleNext = () => {
  emit('paginate', { direction: 'forward' })
}

const handlePageClick = (n: number | string) => {
  if (typeof n === 'number') {
    emit('paginate', {
      direction: n < props.page ? 'back' : 'forward',
      jump: Math.abs(n - props.page),
    })
  }
}
</script>

<template>
  <nav aria-label="Pagination">
    <ul class="flex justify-center items-center space-x-2">
      <li
        v-if="page > 1"
        class="text-black bg-neutral-75 hover:bg-neutral-100 rounded-full cursor-pointer h-8 w-8 flex items-center justify-center"
      >
        <a
          title="Previous page"
          tabindex="0"
          class="flex items-center justify-center w-full h-full"
          @click.prevent="handlePrevious"
          @keyup.space="handlePrevious"
          @keyup.enter="handlePrevious"
        >
          <svg
            width="9"
            height="7"
            viewBox="0 0 9 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.088 3.07182L0.639999 3.51982L1.088 3.96782L3.648 6.52782C3.904 6.78382 4.288 6.78382 4.544 6.52782C4.8 6.27182 4.8 5.88782 4.544 5.63182L3.072 4.15982H7.68C8.064 4.15982 8.32 3.90382 8.32 3.51982C8.32 3.13582 8.064 2.87982 7.68 2.87982H3.072L4.544 1.40782C4.672 1.27982 4.736 1.15182 4.736 0.959824C4.736 0.575824 4.48 0.319824 4.096 0.319824C3.904 0.319824 3.776 0.383824 3.648 0.511824L1.088 3.07182Z"
              fill="#171717"
            />
          </svg>
        </a>
      </li>
      <li
        v-for="n in numPages > 5 ? createPagingLinks() : numPages"
        :key="n"
      >
        <a
          v-if="n !== page && n !== '...'"
          class="bg-neutral-50 hover:bg-neutral-100 text-black transition-colors duration-300 cursor-pointer rounded-full h-8 w-8 flex items-center justify-center"
          :title="`Page ${n}`"
          tabindex="0"
          @click.prevent="handlePageClick(n)"
          @keyup.space="handlePageClick(n)"
          @keyup.enter="handlePageClick(n)"
        >
          {{ n }}
        </a>
        <div
          v-else-if="n === '...'"
          class="inline-flex items-center justify-center text-black cursor-default bg-neutral-75 rounded-full h-8 w-8"
        >
          <span>{{ n }}</span>
        </div>
        <span
          v-else
          class="bg-neutral-200 text-black rounded-full h-8 w-8 flex items-center justify-center"
          >{{ n }}</span
        >
      </li>
      <li
        v-if="page < numPages"
        class="text-black cursor-pointer bg-neutral-50 hover:bg-neutral-100 rounded-full h-8 w-8 flex items-center justify-center"
      >
        <a
          title="Next page"
          tabindex="0"
          class="flex items-center justify-center w-full h-full"
          @click.prevent="handleNext"
          @keyup.space="handleNext"
          @keyup.enter="handleNext"
        >
          <svg
            width="9"
            height="7"
            viewBox="0 0 9 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.06575 3.07182L8.51375 3.51982L8.06575 3.96782L5.50575 6.52782C5.24975 6.78382 4.86575 6.78382 4.60975 6.52782C4.35375 6.27182 4.35375 5.88782 4.60975 5.63182L6.08175 4.15982H1.47375C1.08975 4.15982 0.833748 3.90382 0.833748 3.51982C0.833748 3.13582 1.08975 2.87982 1.47375 2.87982H6.08175L4.60975 1.40782C4.48175 1.27982 4.41775 1.15182 4.41775 0.959824C4.41775 0.575824 4.67375 0.319824 5.05775 0.319824C5.24975 0.319824 5.37775 0.383824 5.50575 0.511824L8.06575 3.07182Z"
              fill="#171717"
            />
          </svg>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
li {
  @apply inline-block;
}

a,
span {
  @apply flex items-center justify-center text-center text-sm font-medium;
}
</style>
