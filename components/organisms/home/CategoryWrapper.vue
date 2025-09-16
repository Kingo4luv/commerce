/** * CategoryWrapper.vue * * This is the homepage category wrapper component. It displays a heading, optional
subheading, * and a grid of product/category cards. Each card uses a slot for custom content (e.g., name, badge, etc.).
*/
<script setup lang="ts">
/**
 * Props:
 * - heading: The main heading for the section
 * - subHeading: Optional subheading
 * - items: Array of category/product items to display
 */
interface ProductImage {
  url: string
  altText: string
}

interface CategoryItem {
  name: string
  url: string
  image: ProductImage
  description?: string
  price?: number
  [key: string]: any
}

interface Props {
  /** This is the heading of the wrapper */
  heading: string
  /** This is the optional wrapper subheading */
  subHeading?: string
  /** This is items that will display on the wrapper */
  items: CategoryItem[]
}

const props = withDefaults(defineProps<Props>(), {
  subHeading: '',
})
</script>

<template>
  <!-- Category section with heading and optional subheading -->
  <section class="category-wrapper w-full">
    <AtomsKlumpHeading
      text-size="xLarge"
      color="primary"
    >
      <div class="section-heading flex items-center space-x-2">
        <span>{{ heading }}</span>
        <span>
          <!-- Arrow icon -->
          <svg
            width="10"
            height="9"
            viewBox="0 0 10 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.41667 3.58333L10 4.16667L9.41667 4.75L6.08333 8.08333C5.75 8.41667 5.25 8.41667 4.91667 8.08333C4.58333 7.75 4.58333 7.25 4.91667 6.91667L6.83333 5H0.833334C0.333334 5 0 4.66667 0 4.16667C0 3.66667 0.333334 3.33333 0.833334 3.33333H6.83333L4.91667 1.41667C4.75 1.25 4.66667 1.08333 4.66667 0.833333C4.66667 0.333333 5 0 5.5 0C5.75 0 5.91667 0.0833335 6.08333 0.25L9.41667 3.58333Z"
              fill="#192C69"
            />
          </svg>
        </span>
      </div>
    </AtomsKlumpHeading>
    <!-- Optional subheading -->
    <p
      v-if="subHeading"
      class="section-sub-heading text-sm md:text-base text-black mt-1"
    >
      {{ subHeading }}
    </p>
    <!-- Product/category grid -->
    <div class="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 mt-4">
      <MoleculesProductCard
        v-for="item in items"
        :key="item.name"
        :product="item"
      >
        <!-- Default slot: displays the item name and arrow icon -->
        <div class="flex items-center">
          <AtomsKlumpHeading
            type="xLarge"
            text-size="base"
            >{{ item.name }}</AtomsKlumpHeading
          >
          <span style="margin-left: 10px">
            <svg
              width="9"
              height="7"
              viewBox="0 0 9 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.91002 3.01L8.40002 3.5L7.91002 3.99L5.11003 6.79C4.83003 7.07 4.41002 7.07 4.13002 6.79C3.85003 6.51 3.85003 6.09 4.13002 5.81L5.74002 4.2H0.700026C0.280025 4.2 2.57492e-05 3.92 2.57492e-05 3.5C2.57492e-05 3.08 0.280025 2.8 0.700026 2.8H5.74002L4.13002 1.19C3.99003 1.05 3.92003 0.91 3.92003 0.7C3.92003 0.28 4.20003 0 4.62003 0C4.83003 0 4.97003 0.0700001 5.11003 0.21L7.91002 3.01Z"
                fill="#171717"
              />
            </svg>
          </span>
        </div>
      </MoleculesProductCard>
    </div>
  </section>
</template>
