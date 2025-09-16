import { defineStore } from 'pinia'

// Export types directly from this store
export interface Category {
  id: number
  name: string
  slug: string
  sub_categories?: Category[]
  [key: string]: any
}

export interface State {
  id: number
  name: string
  cities: City[]
  [key: string]: any
}

export interface City {
  id: number
  name: string
  [key: string]: any
}

export interface UserLocation {
  state: State
  city: City
  firstName?: string
  lastName?: string
  email?: string
  address?: string
  phone?: string
  [key: string]: any
}
import { useNuxtApp } from 'nuxt/app'

interface SiteState {
  categories: Category[]
  states: State[]
  userLocation: UserLocation | null
  locationModalIsOpen: boolean
  distinct_id: number
}

export const useSiteStore = defineStore('site', {
  state: (): SiteState => ({
    categories: [],
    states: [],
    userLocation: null,
    locationModalIsOpen: false,
    distinct_id: Date.now(),
  }),

  getters: {
    getCategories: state => state.categories,
    getUserLocation: state => state.userLocation,
    getStates: state => state.states,
    getLocationModalIsOpen: state => state.locationModalIsOpen,
    getDistinctId: state => state.distinct_id,
  },

  actions: {
    async fetchCategories() {
      // eslint-disable-next-line no-unused-vars
      const { $api } = useNuxtApp() as unknown as { $api: (url: string) => Promise<any> }
      try {
        const { data } = await $api('/product-categories')
        this.categories = data || []
      } catch {
        this.categories = []
      }
    },

    async fetchStates() {
      // eslint-disable-next-line no-unused-vars
      const { $api } = useNuxtApp() as unknown as { $api: (url: string) => Promise<any> }
      try {
        const { data } = await $api('/states')
        this.states = data || []
      } catch {
        this.states = []
      }
    },

    updateUserLocation(userLocation: UserLocation) {
      this.userLocation = userLocation
    },

    updateLocationModalIsOpen() {
      this.locationModalIsOpen = !this.locationModalIsOpen
    },

    setLocationModalIsOpen(isOpen: boolean) {
      this.locationModalIsOpen = isOpen
    },
  },
})
