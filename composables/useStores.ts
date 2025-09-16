import { useSiteStore } from '~/stores/site'
import { useCheckoutStore } from '~/stores/checkout'

export const useStores = () => {
  const siteStore = useSiteStore()
  const checkoutStore = useCheckoutStore()

  // Initialize stores on app startup
  const initializeStores = async () => {
    // Load cart from localStorage
    checkoutStore.loadCartFromStorage()

    // Load user location from localStorage
    if (process.client && typeof window !== 'undefined') {
      const storedLocation = window.localStorage.getItem('userLocation')
      if (storedLocation) {
        try {
          const userLocation = JSON.parse(storedLocation)
          siteStore.updateUserLocation(userLocation)
        } catch {
          // Error loading user location from storage
        }
      }
    }

    // Fetch initial data
    await Promise.all([siteStore.fetchCategories(), siteStore.fetchStates()])
  }

  return {
    siteStore,
    checkoutStore,
    initializeStores,
  }
}
