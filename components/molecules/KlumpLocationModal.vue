<script setup lang="ts">
import { useSiteStore, type State, type City, type UserLocation } from '~/stores/site'

const siteStore = useSiteStore()

const cities = ref<City[]>([])
const selectedState = ref<Partial<State>>({})
const selectedCity = ref<Partial<City>>({})

const getStates = computed(() => siteStore.getStates)
const isOpen = computed(() => siteStore.getLocationModalIsOpen)

const states = computed(() => {
  return getStates.value.map((state: State) => ({
    name: state.name,
    value: state.id,
  }))
})

const citiesOptions = computed(() => {
  return cities.value.map((city: City) => ({
    name: city.name,
    value: city.id,
  }))
})

const disableButton = computed(() => {
  return !(Object.keys(selectedState.value).length > 0 && Object.keys(selectedCity.value).length > 0)
})

const getCities = (stateName: string) => {
  const item = getStates.value.find(item => item.name === stateName)
  if (item) {
    selectedState.value = item
    cities.value = item.cities
  }
}

const setCity = (cityName: string) => {
  const item = cities.value.find(item => item.name === cityName)
  if (item) {
    selectedCity.value = item
  }
}

const updateLocation = () => {
  // Update user location in store
  const userLocation: UserLocation = {
    state: selectedState.value as State,
    city: selectedCity.value as City,
  }
  siteStore.updateUserLocation(userLocation)

  // Save to localStorage
  if (process.client) {
    window.localStorage.setItem('userLocation', JSON.stringify(userLocation))
  }

  // Close modal
  siteStore.updateLocationModalIsOpen()
}

const closeModal = () => {
  siteStore.updateLocationModalIsOpen()
}

onMounted(() => {
  if (process.client) {
    const userLocationData = window.localStorage.getItem('userLocation')
    if (userLocationData) {
      const userLocation: UserLocation = JSON.parse(userLocationData)
      selectedState.value = userLocation.state
      selectedCity.value = userLocation.city
    }

    if (selectedState.value && selectedState.value.cities) {
      cities.value = selectedState.value.cities
    }
  }
})
</script>

<template>
  <dialog
    v-if="isOpen"
    class="fixed inset-0 w-full h-full min-h-screen max-h-screen bg-black/90 flex justify-center items-center z-50"
  >
    <div class="w-full max-w-lg bg-white shadow-lg p-5 rounded relative">
      <button
        class="absolute right-3 top-3"
        @click="closeModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div class="header border-b border-gray-200 pb-4 flex space-x-1">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </span>
        <h3 class="text-base font-semibold text-gray-700">Update your location</h3>
      </div>
      <div class="body space-y-4 mt-4">
        <div class="bg-gray-200 w-full py-2 px-4 rounded">
          <p class="text-sm text-gray-700">
            Update your location to see products available for shipping in your area. Please select your state and city
            from the dropdown menus below.
          </p>
        </div>
        <div class="h-10">
          <MoleculesKlumpSelect
            :items="states"
            radius-side="both"
            radius="normal"
            :label="Object.keys(selectedState).length > 0 ? selectedState.name : 'Select your State'"
            type="select"
            :additional-class="'border border-gray-300 h-10'"
            @change="getCities"
          />
        </div>
        <div class="h-10 relative z-10">
          <MoleculesKlumpSelect
            :items="citiesOptions"
            :label="Object.keys(selectedCity).length > 0 ? selectedCity.name : 'Select your City'"
            radius-side="both"
            type="select"
            radius="normal"
            :additional-class="'border border-gray-300 h-10'"
            @change="setCity"
          />
        </div>
        <div class="">
          <AtomsKlumpButton
            :disabled="disableButton"
            radius="all"
            weight="normal"
            @clicked="updateLocation"
          >
            Update location
          </AtomsKlumpButton>
        </div>
      </div>
    </div>
  </dialog>
</template>
