<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app'
import { ref } from 'vue'

/** This is the homepage template */

interface PropsImage {
  url: string
  altText: string
}

interface Props {
  /** This determine if the homepage carousel should autoplay */
  autoplay: boolean
  /** This determine the carousel slide interval */
  interval?: number
  /** This is the array of carousel images */
  images: PropsImage[]
  /** This the array of category objects */
  items: any[]
}

const props = withDefaults(defineProps<Props>(), {
  interval: 1000,
})

interface Merchant {
  id: string
  business_name: string
  slug: string
  logo?: string
}

interface FAQ {
  id: string
  title: string
  body: string
}

const merchants = ref<Merchant[]>([])
const faq = ref<FAQ[]>([])

const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }

// Fetch merchants data
const { data: merchantsData } = await useAsyncData('merchants', () =>
  $api('/merchants/directory', { query: { hasProduct: true } })
)

if (merchantsData.value?.data) {
  merchants.value = merchantsData.value.data.sort(() => (Math.random() > 0.5 ? 1 : -1)).slice(0, 9)
}

// Fetch FAQ data
const { data: faqData } = await useAsyncData('faqs', () => $api('/faqs'))

if (faqData.value?.data) {
  faq.value = faqData.value.data
}
</script>

<template>
  <div>
    <div class="promo-carousel w-full max-w-screen-xl mx-auto h-[100px] lg:h-[329px] mt-8 px-4 xl:px-0">
      <MoleculesKlumpCarousel
        :autoplay="true"
        :images="images"
        :interval="interval"
      />
    </div>
    <div class="w-full max-w-screen-xl mx-auto mt-6 lg:mt-12 space-y-6 lg:space-y-12 px-4">
      <OrganismsHomeCategoryWrapper
        :items="items"
        heading="Shop our selections"
        sub-heading="Curated collections hand-picked by Klump"
      />
      <section class="merchant-section w-full">
        <AtomsKlumpHeading
          text-size="xLarge"
          color="primary"
        >
          <nuxt-link
            to="/merchants"
            class="flex items-center space-x-2"
          >
            <span>Browse by merchant</span>
            <span>
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
          </nuxt-link>
        </AtomsKlumpHeading>
        <div
          class="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 gap-x-2 gap-y-4 md:gap-x-5 mt-5 md:mt-8"
        >
          <nuxt-link
            v-for="merchant in merchants"
            :key="merchant.id"
            :title="merchant.business_name"
            :to="`m/${merchant.slug}`"
            class="space-y-1"
          >
            <div
              to=""
              class="w-full h-32 md:w-32 rounded flex items-center justify-center border border-gray-200"
            >
              <div class="h-16 w-16 rounded flex items-center justify-center">
                <AtomsKlumpImage
                  v-if="merchant.logo && merchant.logo !== ''"
                  :url="merchant.logo"
                  :alt-text="merchant.business_name"
                  radius="all"
                />
                <AtomsKlumpHeading
                  v-else
                  type="xxLarge"
                  text-size="xxLarge"
                  override-styles="font-bold text-8xl text-primary"
                  >{{ merchant.business_name.split('')[0] }}</AtomsKlumpHeading
                >
              </div>
            </div>
            <p class="font-bold text-black text-sm md:text-base whitespace-nowrap truncate">
              {{ merchant.business_name }}
            </p>
          </nuxt-link>
        </div>
      </section>
    </div>
    <div
      v-if="faq.length > 0"
      class="w-full bg-[#2C86FF] mt-16 md:mt-20 px-4"
    >
      <div class="w-full max-w-screen-xl mx-auto pt-6 md:pt-12 pb-4 md:pb-12 text-white">
        <h2 class="font-bold text-xl md:text-3xl tracking-wide text-center">In case you missed anything</h2>
        <div class="divide-y divide-white">
          <OrganismsKlumpAccordion
            v-for="item in faq"
            :key="item.id"
            :title="item.title"
            :content="item.body"
          />
        </div>
      </div>
    </div>
  </div>
</template>
