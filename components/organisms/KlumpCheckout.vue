<script setup lang="ts">
/** This is the checkout and cart components  */
// Import klump-vue-3 using dynamic import to avoid CommonJS/ESM issues
const { KlumpCheckout } = await import('klump-vue-3')

// Import the new shipping form component
import ShippingForm from '~/components/checkout/ShippingForm.vue'

// Import the new cart section component
import CartSection from '~/components/checkout/CartSection.vue'

// Import the new order summary component
import OrderSummary from '~/components/checkout/OrderSummary.vue'

// Import the new acknowledgement component
import Acknowledgement from '~/components/checkout/Acknowledgement.vue'

// Global Klump class declaration for TypeScript
declare global {
  class Klump {
    constructor(config: {
      publicKey: string
      merchantId?: string
      data: any
      onSuccess?: (data: any) => void
      onError?: (data: any) => void
      onClose?: (data: any) => void
      onLoad?: (data: any) => void
      onOpen?: (data: any) => void
    })
  }
}

interface Props {
  /** This determines if the checkout is open or not */
  open: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<{
  'close-checkout': []
}>()

import { useCheckoutStore } from '~/stores/checkout'
import { useSiteStore } from '~/stores/site'
import { useRuntimeConfig } from '#app'
import { useFormatCurrency } from '~/composables/useFormatCurrency'

const checkoutStore = useCheckoutStore()
const siteStore = useSiteStore()
const config = useRuntimeConfig()
const { formatCurrency } = useFormatCurrency()

// Add type declaration for window properties
declare global {
  interface Window {
    removePaymentModal?: () => void
  }
}

const cart = computed(() => checkoutStore.getCart)
const userLocation = computed(() => siteStore.getUserLocation)
const getMerchant = computed(() => checkoutStore.getMerchant)
const distinctId = computed(() => siteStore.getDistinctId)

// Access route and router
const route = useRoute()
const router = useRouter()

// Reactive data
const isOpen = ref(false)
const screen = ref(1)
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const email = ref('')
const address = ref('')
const recipientFirstName = ref('')
const recipientLastName = ref('')
const recipient_phone = ref('')
const recipient_email = ref('')
const contact_email = ref('')
const city = ref('')
const note = ref('')
const state = ref('')
const sameContact = ref(false)
const notify = ref(false)
const reference = ref<string | null>(null)
const paymentStatus = ref<string | null>(null)
const showAcknowledgement = ref<boolean | null>(null)
const errors = ref<Record<string, string>>({})
const selectedState = ref<any>(null)
const selectedCity = ref<any>(null)
const shippingData = ref<any[]>([])
const shippingFee = ref(0)
const checkedItems = ref(['Shipping'])
const paymentType = ref(route.query.payment_method && route.query.payment_method === 'onetime' ? ['Full Payment'] : [])
const storeAddress = ref(false)
const merchantCredentials = ref<any>(null)
const isProcessingPayment = ref(false)

// Computed properties
const cartItemsTotal = computed(() => {
  return cart.value.map(item => item.price * item.quantity).reduce((a, b) => a + b, 0)
})

const grandTotal = computed(() => {
  return cartItemsTotal.value + shippingFee.value
})

const cartAllItemsQuantity = computed(() => {
  return cart.value.map(item => item.quantity).reduce((a, b) => a + b, 0)
})

const storedAddressChecked = computed(() => {
  return [storeAddress.value]
})

const isDevMode = computed(() => {
  return config.public.nodeEnv !== 'production'
})

const displayPaymentText = computed(() => {
  const formattedTotal = formatCurrency(grandTotal.value)
  return paymentType.value.includes('Instalments') ? 'Pay in installments' : `Pay ${formattedTotal}`
})

const paymentReference = computed(() => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i <= 11; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
})

const isShippingAddressSet = computed(() => {
  if (process.client && typeof window !== 'undefined') {
    const userLocationData = JSON.parse(window.localStorage.getItem('userLocation') || '{}')
    if (userLocationData) {
      return (
        userLocationData.address !== '' &&
        userLocationData.address !== undefined &&
        userLocationData.firstName !== '' &&
        userLocationData.firstName !== undefined &&
        userLocationData.lastName !== '' &&
        userLocationData.lastName !== undefined &&
        userLocationData.email !== '' &&
        userLocationData.email !== undefined &&
        userLocationData.phone !== '' &&
        userLocationData.phone !== undefined
      )
    }
  }
  return false
})

const getMerchantKey = computed(() => {
  let environment
  if (config.public.nodeEnv === 'development' || config.public.nodeEnv === 'staging') {
    environment = getMerchant.value?.is_live ? 'live' : 'test'
  } else {
    environment = 'live'
  }
  return getMerchant.value?.credential?.find(key => key.environment === environment)
})

const isUserLocationSet = computed(() => {
  return userLocation.value && Object.keys(userLocation.value).length > 0
})

const PAYSTACK_PK = computed(() => {
  return config.public.paystackPk
})

// Helper functions

// Methods
const close = () => {
  showAcknowledgement.value = false
  checkoutStore.clearPreservedMerchant()
  emit('close-checkout')
}

const handleShippingType = (type: string) => {
  if (type === 'Merchant Shop Pickup') {
    checkedItems.value = ['Merchant Shop Pickup']
  } else if (type === 'Shipping') {
    checkedItems.value = ['Shipping']
  }
}

const handleSameContact = () => {
  sameContact.value = !sameContact.value
  if (sameContact.value) {
    recipient_phone.value = phone.value
    recipient_email.value = email.value
    recipientFirstName.value = firstName.value
    recipientLastName.value = lastName.value
  } else {
    recipient_phone.value = ''
    recipient_email.value = ''
    recipientFirstName.value = ''
    recipientLastName.value = ''
  }
}

const setShippingDataToStorage = () => {
  if (storeAddress.value && process.client && typeof window !== 'undefined') {
    const userLocation = JSON.parse(window.localStorage.getItem('userLocation') || '{}')
    userLocation.firstName = firstName.value ?? ''
    userLocation.lastName = lastName.value ?? ''
    userLocation.email = email.value ?? ''
    userLocation.address = address.value ?? ''
    userLocation.phone = phone.value ?? ''
    window.localStorage.setItem('userLocation', JSON.stringify(userLocation))
  }
}

const unsetShippingDataToStorage = () => {
  if (process.client && typeof window !== 'undefined') {
    const userLocation = JSON.parse(window.localStorage.getItem('userLocation') || '{}')
    userLocation.firstName = ''
    userLocation.lastName = ''
    userLocation.email = ''
    userLocation.address = ''
    userLocation.phone = ''
    window.localStorage.setItem('userLocation', JSON.stringify(userLocation))
  }
}

const handleStoreAddress = () => {
  storeAddress.value = !storeAddress.value
  if (process.client && typeof window !== 'undefined') {
    window.localStorage.setItem('storeAddress', storeAddress.value.toString())
  }
}

const buttonText = computed(() => {
  let textValue = ''
  if (screen.value === 1) {
    textValue = 'Checkout'
  }
  if (screen.value === 2) {
    textValue = 'Continue'
  }
  if (screen.value === 3) {
    textValue = 'Pay'
  }
  return textValue
})

const handlePaymentType = (type: string) => {
  if (type === 'Instalments') {
    paymentType.value = ['Instalments']
  } else {
    paymentType.value = ['Full Payment']
  }
}

const checkForErrors = () => {
  // Reset errors at the start
  errors.value = {}

  // Define a helper to simplify field presence checks
  const requireField = (field: string, message: string) => {
    if (!firstName.value || firstName.value === '') {
      errors.value[field] = message
    }
  }

  // Email validation helper
  const validateEmail = (email: string, field: string = 'email') => {
    const emailRegex = /\S+@\S+\.\S+/
    if (email && email !== '' && !emailRegex.test(email)) {
      errors.value[field] = 'Email is invalid'
    }
  }

  // Phone validation helper
  const validatePhone = (phone: string, field: string = 'phone') => {
    if (phone && phone.length !== 11) {
      errors.value[field] = 'Phone number must be 11 digits'
    }
  }

  // Common validations
  if (!firstName.value || firstName.value === '') {
    errors.value.firstName = 'First name is required'
  }
  if (!lastName.value || lastName.value === '') {
    errors.value.lastName = 'Last name is required'
  }
  if (!phone.value || phone.value === '') {
    errors.value.phone = 'Phone number is required'
  }
  validatePhone(phone.value)
  if (!email.value || email.value === '') {
    errors.value.email = 'Email is required'
  }
  validateEmail(email.value)

  // Conditional validations based on `checkedItems`
  if (checkedItems.value.includes('Shipping')) {
    if (!address.value || address.value === '') {
      errors.value.address = 'Address is required'
    }
    if (!recipientFirstName.value || recipientFirstName.value === '') {
      errors.value.recipientFirstName = 'Recipient first name is required'
    }
    if (!recipientLastName.value || recipientLastName.value === '') {
      errors.value.recipientLastName = 'Recipient last name is required'
    }
    validateEmail(recipient_email.value, 'recipient_email')
    if (!recipient_phone.value || recipient_phone.value === '') {
      errors.value.recipient_phone = 'Recipient phone is required'
    }
    validatePhone(recipient_phone.value, 'recipient_phone')
  }

  // Return true if there are no errors
  return Object.keys(errors.value).length === 0
}

const goForward = async () => {
  if (screen.value === 2) {
    if (checkForErrors()) {
      if (checkedItems.value.includes('Shipping')) {
        // Filter out undefined/null items and safely access cost property
        const validShippingData = shippingData.value.filter(item => item && typeof item === 'object')
        shippingFee.value = validShippingData.map(item => item.cost || 0).reduce((a, b) => a + b, 0)
        setShippingDataToStorage()
      } else {
        shippingFee.value = 0
      }
      screen.value++
    }
  }
  if (screen.value === 1 && isUserLocationSet.value) {
    // Get merchant id from cart item and use it to create an object of key value pairs of merchantId as key and productIds array as value
    const merchantProducts = cart.value.reduce((acc: any, item: any) => {
      if (!acc[item.merchant.id]) {
        acc[item.merchant.id] = []
      }
      const product = {
        id: item.product_id,
        quantity: item.quantity,
      }
      acc[item.merchant.id].push(product)
      return acc
    }, {})
    const merchantIds = Object.keys(merchantProducts)

    // Loop through merchant ids and get shipping data for each merchant
    shippingData.value = []
    for (const merchantId of merchantIds) {
      const productIds = merchantProducts[merchantId]
      await getShippingData(productIds, merchantId)
    }

    screen.value++
  }
}

const goBack = () => {
  screen.value--
}

const handlePayment = async () => {
  if (paymentType.value.length < 1) {
    checkoutStore.setNotification({
      type: 'error',
      message: 'Please select a payment method',
    })
    return
  }

  if (isProcessingPayment.value) {
    return // Prevent multiple clicks
  }

  isProcessingPayment.value = true

  try {
    if (cart.value.length > 0) {
      if (paymentType.value.includes('Full Payment')) {
        completePurchase()
      }
      if (paymentType.value.includes('Instalments')) {
        await payWithInstalments()
      }
    }
  } catch (error) {
    checkoutStore.setNotification({
      type: 'error',
      message: 'An error occurred during payment processing',
    })
  } finally {
    isProcessingPayment.value = false
  }
}

const setupMessageListener = () => {
  window.addEventListener('message', handleMessage)
}

const handleMessage = (event: MessageEvent) => {
  // Parse string data if needed
  let parsedData = event.data
  if (typeof event.data === 'string') {
    try {
      parsedData = JSON.parse(event.data)
    } catch (error) {
      return
    }
  }

  // Check for Paystack payment success (object format)
  if (parsedData.event === 'success' && parsedData.data && parsedData.data.status === 'success') {
    if (parsedData.data.reference === reference.value) {
      showAcknowledgement.value = true
      window.localStorage.removeItem('cart')
      checkoutStore.clearCart()
      if ((window as any).removePaymentModal) {
        ;(window as any).removePaymentModal()
      }
    }
  }

  // Check for Paystack payment success (string format)
  if (typeof event.data === 'string' && event.data.includes('"status":"success"')) {
    try {
      const successData = JSON.parse(event.data)
      if (successData.reference === reference.value) {
        showAcknowledgement.value = true
        window.localStorage.removeItem('cart')
        checkoutStore.clearCart()
        if ((window as any).removePaymentModal) {
          ;(window as any).removePaymentModal()
        }
      }
    } catch (error) {
      // Silent error handling
    }
  }

  // Check for Paystack payment success (any format) - use Paystack's reference
  if (
    (typeof event.data === 'string' && event.data.includes('"status":"success"')) ||
    (parsedData.event === 'success' && parsedData.data && parsedData.data.status === 'success')
  ) {
    let paystackReference = null

    // Extract reference from string format
    if (typeof event.data === 'string' && event.data.includes('"status":"success"')) {
      try {
        const successData = JSON.parse(event.data)
        paystackReference = successData.reference
      } catch (error) {
        // Silent error handling
      }
    }

    // Extract reference from object format
    if (parsedData.event === 'success' && parsedData.data && parsedData.data.status === 'success') {
      paystackReference = parsedData.data.reference
    }

    if (paystackReference) {
      showAcknowledgement.value = true

      // Clear cart and localStorage
      checkoutStore.clearCart()
      if (process.client && typeof window !== 'undefined') {
        window.localStorage.removeItem('cart')
      }

      // Close modal safely
      try {
        if ((window as any).removePaymentModal) {
          ;(window as any).removePaymentModal()
        }
      } catch (error) {
        // Modal already removed
      }

      // Prevent further processing
      return
    }
  }

  // Check for custom payment success from any origin (iframe might be from different domain)
  if (parsedData.event === 'paymentSuccess') {
    if (parsedData.message === reference.value) {
      showAcknowledgement.value = true
      window.localStorage.removeItem('cart')
      checkoutStore.clearCart()
    }
  }

  // Check for close modal from any origin
  if (parsedData.event === 'closePaymentModal') {
    if ((window as any).removePaymentModal) {
      ;(window as any).removePaymentModal()
    }
  }
}

const setPayload = () => {
  const products = cart.value.map(({ product_id }) => ({ id: product_id }))
  reference.value = paymentReference.value

  const payload = {
    products,
    firstname: firstName.value,
    lastname: lastName.value,
    email: email.value,
    phone: `+234${phone.value.slice(1)}`,
    shipping_data: {
      address: address.value,
      city_id: selectedCity.value?.id,
      state: selectedState.value?.id,
      country: 'Nigeria',
      contact_info: {
        name: `${firstName.value} ${lastName.value}`,
        phone: `+234${recipient_phone.value.slice(1)}`,
        email: recipient_email.value,
      },
    },
    meta_data: {
      redirect_url: `${window.location.origin}/payment?ref=${paymentReference.value}&status=success`,
      source: route.query.source,
      item_id: route.query.item_id,
      email: route.query.email,
      name: route.query.name,
    },
  }

  return { payload, products }
}

const initiatePaymentAsync = async () => {
  const txn = {
    live: false,
    ref: paymentReference.value,
    amount: grandTotal.value,
    customer: {
      firstname: firstName.value,
      lastname: lastName.value,
      email: email.value,
    },
    fees: [],
    publicKey: 'sb-pk-Emrv5IsQjine964WPpTKeOOCjXsHDP5m',
    description: 'Payment description',
    currency: 'NGN',
    callback: async (res: any) => {
      if (res.event === 'success' && res.reference === paymentReference.value) {
        const data = setPayload()
        let payload = data.payload
        const products = data.products

        if (checkedItems.value.includes('Merchant Shop Pickup')) {
          const { meta_data } = payload
          payload = {
            firstname: firstName.value,
            lastname: lastName.value,
            phone: `+234${phone.value.slice(1)}`,
            products,
            email: email.value,
            meta_data,
            shipping_data: {
              address: address.value,
              city_id: selectedCity.value?.id,
              state: selectedState.value?.id,
              country: 'Nigeria',
              contact_info: {
                name: `${firstName.value} ${lastName.value}`,
                phone: `+234${recipient_phone.value.slice(1)}`,
                email: recipient_email.value,
              },
            },
          }
        }

        try {
          const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }
          const { data } = await $api('/products/purchase', {
            method: 'POST',
            body: payload,
          })
          showAcknowledgement.value = true
          window.localStorage.removeItem('cart')
          checkoutStore.clearCart()
        } catch (error: any) {
          checkoutStore.setNotification({
            type: 'error',
            message: error?.response?.data?.message || 'An error occurred while processing your payment',
          })
        }
      }
    },
    options: [],
  }
}

const completePurchase = async () => {
  const data = setPayload()
  let payload: any = data.payload
  const products = data.products

  if (checkedItems.value.includes('Merchant Shop Pickup')) {
    const { meta_data } = payload
    payload = {
      firstname: firstName.value,
      lastname: lastName.value,
      phone: `+234${phone.value.slice(1)}`,
      products,
      email: email.value,
      meta_data,
      transaction_type: 'full_payment',
    }
  }

  try {
    const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }
    const response = await $api('/products/purchase', {
      method: 'POST',
      body: payload,
    })

    // Try different possible response structures
    let checkoutUrl = null

    // Structure 1: response.data.checkout_url (Nuxt 3 style)
    if (response?.data?.checkout_url) {
      checkoutUrl = response.data.checkout_url
    }
    // Structure 2: response.checkout_url (direct property)
    else if (response?.checkout_url) {
      checkoutUrl = response.checkout_url
    }
    // Structure 3: response.data (if the entire data is the checkout URL)
    else if (response?.data && typeof response.data === 'string' && response.data.startsWith('http')) {
      checkoutUrl = response.data
    }

    if (checkoutUrl) {
      createModal(checkoutUrl)
      // Don't clear cart here - wait for payment success message
    } else {
      // Only clear cart and show acknowledgement if no checkout URL (fallback)
      showAcknowledgement.value = true
      if (process.client && typeof window !== 'undefined') {
        window.localStorage.removeItem('cart')
      }
      checkoutStore.clearCart()
    }
  } catch (error: any) {
    checkoutStore.setNotification({
      type: 'error',
      message: error?.response?.data?.message || 'An error occurred while processing your payment',
    })
  }
}

const createModal = (redirectUrl: string) => {
  try {
    // Create the modal container with styles for overlaying the entire viewport
    const modal = document.createElement('div')
    Object.assign(modal.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: '1000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    })

    // Create the iframe to embed in the modal with styles
    const iframe = document.createElement('iframe')
    Object.assign(iframe.style, {
      width: '80%',
      height: '80%',
      border: 'none',
    })
    iframe.src = redirectUrl

    // Add polling to check iframe URL for payment success
    const checkPaymentSuccess = () => {
      try {
        const currentUrl = iframe.src
        if (currentUrl.includes('/payment?status=success')) {
          showAcknowledgement.value = true
          if (process.client && typeof window !== 'undefined') {
            window.localStorage.removeItem('cart')
          }
          checkoutStore.clearCart()
          if ((window as any).removePaymentModal) {
            ;(window as any).removePaymentModal()
          }
          return true
        }
        return false
      } catch (error) {
        return false
      }
    }

    // Poll every 2 seconds for payment success
    const pollInterval = setInterval(() => {
      if (checkPaymentSuccess()) {
        clearInterval(pollInterval)
      }
    }, 2000)

    // Clean up polling when modal is closed
    const originalRemoveModal = (window as any).removePaymentModal
    ;(window as any).removePaymentModal = () => {
      clearInterval(pollInterval)
      if (originalRemoveModal) {
        originalRemoveModal()
      }
    }

    // Create a close button for the modal
    const closeButton = document.createElement('button')
    closeButton.textContent = 'Close'
    Object.assign(closeButton.style, {
      position: 'absolute',
      top: '20px',
      right: '20px',
      padding: '5px 10px',
      fontSize: '16px',
      cursor: 'pointer',
      color: 'white',
    })

    // Append iframe and close button to the modal
    modal.appendChild(iframe)
    modal.appendChild(closeButton)

    // Append the modal to the body
    document.body.appendChild(modal)
    ;(window as any).removePaymentModal = () => document.body.removeChild(modal)

    // Adjust the event listeners to use the new global function
    const removeModal = () => {
      if ((window as any).removePaymentModal) {
        ;(window as any).removePaymentModal()
      }
    }

    closeButton.addEventListener('click', removeModal)

    modal.addEventListener('click', event => {
      if (event.target === modal) {
        removeModal()
      }
    })

    const keyListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        removeModal()
        document.removeEventListener('keydown', keyListener) // Cleanup listener
      }
    }
    document.addEventListener('keydown', keyListener)
  } catch (error) {
    // Fallback to direct success if modal creation fails
    showAcknowledgement.value = true
    if (process.client && typeof window !== 'undefined') {
      window.localStorage.removeItem('cart')
    }
    checkoutStore.clearCart()
  }
}

const payWithInstalments = async () => {
  // You can run your validation checks here

  if (cart.value.length > 0) {
    const data: any = {
      first_name: firstName.value,
      last_name: lastName.value,
      phone: phone.value,
      email: email.value,
      amount: grandTotal.value,
      shipping_fee: shippingFee.value,
      currency: 'NGN',
      items: cart.value.map(item => ({
        unit_price: parseFloat(item.price.toString()),
        product_id: item.product_id,
        name: item.name,
        quantity: Number(item.quantity),
        image_url: item?.image_url,
        item_url: item?.item_url,
      })),
      shipping_data: {
        address: address.value,
        city_id: selectedCity.value?.id,
        state: selectedState.value?.id,
        country: 'Nigeria',
        contact_info: {
          name: `${recipientFirstName.value} ${recipientLastName.value}`,
          phone: recipient_phone.value,
        },
        shipping_type: 'doorstep',
      },
      mixpanel_distinct_id: distinctId.value,
    }

    // Mixpanel tracking
    const { $mixpanel } = useNuxtApp() as unknown as { $mixpanel: any }
    if ($mixpanel) {
      $mixpanel.track('B - Klump Checkout Button Clicked - KC', {
        ...data,
        distinct_id: distinctId.value,
        environment: config.public.nodeEnv,
      })
    }

    // Check if merchant is Paga
    if (getMerchant.value?.id === config.public.pagaMerchantId) {
      data.merchant = 'Paga'
    }

    if (!checkedItems.value.includes('Shipping')) {
      delete data.shipping_fee
      data.shipping_data = {
        shipping_type: 'pickup',
      }
    }

    if (recipient_email.value !== '' && checkedItems.value.includes('Shipping')) {
      data.shipping_data.contact_info.email = recipient_email.value
    }

    // @ts-ignore
    new Klump({
      publicKey: merchantCredentials.value.public_key,
      merchantId: getMerchant.value?.id?.toString(),
      data,
      onSuccess: onSuccess,
      onError: onError,
      onClose: onClose,
      onLoad: onLoad,
      onOpen: onOpen,
    })
  }
}

// Payment callback functions
const onSuccess = (data: any) => {
  // handles on success callback
  // This checks if success data contains reference and success status
  if (data?.data?.data?.status === 'successful' && data?.data?.data?.reference !== null) {
    reference.value = data?.data?.data?.data?.reference
    paymentStatus.value = data?.data?.data?.status
    showAcknowledgement.value = true
  }
  window.localStorage.removeItem('cart')
  checkoutStore.clearCart()
  return data
}

const onLoad = (data: any) => {
  // handles on load callback
}

const onOpen = (data: any) => {
  // handles on open callback
}

const onClose = (data: any) => {
  if (reference.value && paymentStatus.value) {
    location.reload()
  }
  // handles on close callback
}

const onError = (data: any) => {
  // handles on error callback
  // Klump Widget already displays its own errors to the user
}

const getShippingData = async (productIds: any[], merchantId: string) => {
  try {
    const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }
    const { data } = await $api(`/merchants/${merchantId}/shipping/calc`, {
      method: 'POST',
      body: {
        productData: productIds,
        city_id: selectedCity.value?.id,
      },
    })

    // Only push valid shipping data to shippingData array
    // Handle both response structures: {data: {...}} and direct {...}
    const shippingResponse = data?.data || data
    if (data && shippingResponse && typeof shippingResponse === 'object' && shippingResponse.cost !== undefined) {
      shippingData.value.push(shippingResponse)
    }
    return true
  } catch (error: any) {
    checkoutStore.setNotification({
      type: 'error',
      message: error?.response?.data?.message || 'Error calculating shipping',
    })
    return false
  }
}

const fetchMerchantCredentials = async () => {
  if (process.client && typeof window !== 'undefined') {
    const cartData = JSON.parse(window.localStorage.getItem('cart') || '[]')
    if (cartData.length === 0) {
      return
    }

    let environment
    const slug = cartData[0].slug
    const { $api } = useNuxtApp() as unknown as { $api: (url: string, options?: any) => Promise<any> }
    const response = await $api(`products/${slug}`, { method: 'GET' })

    if (config.public.nodeEnv === 'development' || config.public.nodeEnv === 'staging') {
      environment = response?.data?.merchant?.is_live ? 'live' : 'test'
    } else {
      environment = 'live'
    }
    merchantCredentials.value = response?.data?.merchant?.credential?.find(
      (key: any) => key.environment === environment
    )
    return merchantCredentials.value
  }
}

// Watch properties
watch(
  () => props.open,
  val => {
    if (val && cart.value.length > 0) {
      fetchMerchantCredentials()
    }
    isOpen.value = val
  },
  { immediate: true }
)

// Watch user location
watch(userLocation, () => {
  if (userLocation.value) {
    selectedState.value = userLocation.value.state
    selectedCity.value = userLocation.value.city

    firstName.value = userLocation.value.firstName ?? ''
    lastName.value = userLocation.value.lastName ?? ''
    email.value = userLocation.value.email ?? ''
    address.value = userLocation.value.address ?? ''
    phone.value = userLocation.value.phone ?? ''

    if (process.client && typeof window !== 'undefined') {
      storeAddress.value = window.localStorage.getItem('storeAddress') === 'true'
    }
  }
})

// Watch cart changes to fetch credentials when cart is updated
watch(
  cart,
  newCart => {
    if (newCart.length > 0 && isOpen.value) {
      fetchMerchantCredentials()
    }
  },
  { deep: true }
)

// Lifecycle hooks
onMounted(() => {
  if (isUserLocationSet.value && userLocation.value) {
    selectedState.value = userLocation.value.state
    selectedCity.value = userLocation.value.city

    firstName.value = userLocation.value.firstName ?? ''
    lastName.value = userLocation.value.lastName ?? ''
    email.value = userLocation.value.email ?? ''
    address.value = userLocation.value.address ?? ''
    phone.value = userLocation.value.phone ?? ''

    if (process.client && typeof window !== 'undefined') {
      storeAddress.value = window.localStorage.getItem('storeAddress') === 'true'
    }
  } else {
    // Clear cart if user location is not set
    checkoutStore.clearCart()
  }
  setupMessageListener()
})

onUnmounted(() => {
  // Clean up the event listener when the component is destroyed
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <MoleculesKlumpDrawer
    position="right"
    :visible="isOpen"
    @close="close"
  >
    <template v-slot:header>
      <div class="header py-4 border-b border-gray-200 px-4 flex justify-between items-center">
        <AtomsKlumpHeading
          text-size="xxLarge"
          weight="bold"
          >Your Cart</AtomsKlumpHeading
        >
      </div>
    </template>
    <template v-slot:body>
      <div class="h-[70%] pb-10 md:h-full overflow-y-auto">
        <div v-if="!showAcknowledgement">
          <div v-if="screen === 1">
            <CartSection :cart="cart" />
          </div>
          <div v-if="screen === 2">
            <ShippingForm
              :first-name="firstName"
              :last-name="lastName"
              :phone="phone"
              :email="email"
              :address="address"
              :recipient-first-name="recipientFirstName"
              :recipient-last-name="recipientLastName"
              :recipient_phone="recipient_phone"
              :recipient_email="recipient_email"
              :city="city"
              :state="state"
              :same-contact="sameContact"
              :selected-state="selectedState"
              :selected-city="selectedCity"
              :checked-items="checkedItems"
              :stored-address-checked="storedAddressChecked"
              :errors="errors"
              :merchant="getMerchant"
              @update:first-name="firstName = $event"
              @update:last-name="lastName = $event"
              @update:phone="phone = $event"
              @update:email="email = $event"
              @update:address="address = $event"
              @update:recipient-first-name="recipientFirstName = $event"
              @update:recipient-last-name="recipientLastName = $event"
              @update:recipient_phone="recipient_phone = $event"
              @update:recipient_email="recipient_email = $event"
              @update:city="city = $event"
              @update:state="state = $event"
              @update:same-contact="sameContact = $event"
              @update:checked-items="checkedItems = $event"
              @update:stored-address-checked="storeAddress = $event[0]"
            />
          </div>
          <div v-if="screen === 3">
            <OrderSummary
              :cart="cart"
              :first-name="firstName"
              :last-name="lastName"
              :email="email"
              :phone="phone"
              :address="address"
              :selected-city="selectedCity"
              :selected-state="selectedState"
              :checked-items="checkedItems"
              :merchant="getMerchant"
            />
          </div>
        </div>
        <div v-else>
          <Acknowledgement
            :checked-items="checkedItems"
            :merchant="getMerchant"
          />
        </div>
        <div class="invisible">
          <KlumpCheckout :dev-mode="isDevMode" />
        </div>
      </div>
    </template>
    <template
      v-if="cart.length > 0 && !showAcknowledgement"
      v-slot:footer
    >
      <div
        class="footer absolute border-t border-gray-200 bottom-0 right-0 w-full bg-white px-4 pt-4 pb-16 space-y-4 md:space-y-6 flex flex-col z-50"
      >
        <div class="w-full text-black py-3 text-sm flex font-bold space-x-2">
          <span class="my-1">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 0C3.35813 0 0 3.35813 0 7.5C0 11.6419 3.35813 15 7.5 15C11.6419 15 15 11.6419 15 7.5C15 3.35813 11.6419 0 7.5 0ZM7.5 12.2875C6.91375 12.2875 6.5125 11.8356 6.5125 11.25C6.5125 10.6475 6.93062 10.2125 7.5 10.2125C8.10188 10.2125 8.4875 10.6475 8.4875 11.25C8.4875 11.8363 8.10188 12.2875 7.5 12.2875ZM7.88875 8.32563C7.73937 8.835 7.26875 8.84375 7.11187 8.32563C6.93125 7.72813 6.28937 5.46 6.28937 3.98688C6.28937 2.04313 8.72125 2.03375 8.72125 3.98688C8.72062 5.46875 8.04437 7.79563 7.88875 8.32563Z"
                fill="#000"
              />
            </svg>
          </span>
          <span class="text-sm">PRICES ON OUR WEBSITE MAY VARY DUE TO EXCHANGE RATE CHANGES.</span>
        </div>
        <div
          v-if="screen !== 2"
          class="flex items-center justify-between"
        >
          <p>Items</p>
          <p class="font-bold">{{ cartAllItemsQuantity }}</p>
        </div>
        <div
          v-if="screen === 3"
          class="flex items-center justify-between"
        >
          <p>Shipping fee</p>
          <p class="font-bold">{{ formatCurrency(shippingFee) }}</p>
        </div>
        <div
          v-if="screen === 3"
          class="flex items-center justify-between"
        >
          <p>Subtotal</p>
          <p class="font-bold">{{ formatCurrency(cartItemsTotal) }}</p>
        </div>
        <div
          v-if="screen !== 2"
          class="flex items-center justify-between"
        >
          <p>Total</p>
          <p class="font-bold">{{ formatCurrency(grandTotal) }}</p>
        </div>
        <div>
          <div class="space-y-2">
            <AtomsKlumpButton
              v-if="screen !== 3"
              type="primary"
              radius="all"
              @clicked="goForward"
              >{{ buttonText }}
            </AtomsKlumpButton>
            <div
              v-else
              class="space-y-2"
            >
              <div
                v-if="!$route.query.payment_method"
                class="pt-4 space-y-1"
              >
                <AtomsKlumpHeading
                  text-size="base"
                  weight="bold"
                  >Select Payment Method
                </AtomsKlumpHeading>
                <AtomsKlumpCheckbox
                  :checked-items="paymentType"
                  :items="[{ name: 'Full Payment' }, { name: 'Instalments' }]"
                  @change="handlePaymentType"
                />
              </div>

              <div class="space-y-2">
                <AtomsKlumpButton
                  type="primary"
                  weight="normal"
                  radius="all"
                  :disabled="isProcessingPayment"
                  @clicked="handlePayment"
                >
                  <span v-if="isProcessingPayment">Processing...</span>
                  <span v-else>{{ displayPaymentText }}</span>
                  <div
                    v-if="!paymentType.includes('Instalments')"
                    class="flex items-center"
                  >
                    <span class="mx-1">with</span>
                    <span>
                      <svg
                        width="100"
                        height="18"
                        viewBox="0 0 100 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_1966_5311)">
                          <path
                            d="M14.2162 1.69595H0.831508C0.378005 1.69595 -0.000339307 2.07811 -0.000339307 2.53799V4.04754C-0.000339307 4.51888 0.378005 4.89085 0.832145 4.89085H14.2156C14.6806 4.89085 15.0481 4.50741 15.0589 4.04818V2.54882C15.0589 2.07875 14.6806 1.69531 14.2162 1.69531V1.69595ZM14.2162 10.0985H0.831508C0.721937 10.0987 0.613495 10.1207 0.512469 10.1631C0.411443 10.2055 0.319841 10.2675 0.242973 10.3456C0.086481 10.5043 -0.00116752 10.7183 -0.00097625 10.9412V12.4507C-0.00097625 12.9221 0.377368 13.2934 0.831508 13.2934H14.2149C14.6799 13.2934 15.0474 12.9214 15.0583 12.4514V10.9412C15.0583 10.4705 14.6806 10.0985 14.2162 10.0985ZM8.36718 14.2896H0.832145C0.611126 14.2896 0.399024 14.3781 0.24361 14.5361C0.0871179 14.6948 -0.000530574 14.9087 -0.000339307 15.1316V16.6412C-0.000339307 17.1125 0.378005 17.4838 0.832145 17.4838H8.35635C8.82132 17.4838 9.18883 17.1017 9.18883 16.6418V15.1316C9.19164 15.022 9.17246 14.9129 9.13243 14.8107C9.09239 14.7086 9.03231 14.6155 8.95573 14.537C8.87916 14.4584 8.78763 14.396 8.68654 14.3534C8.58546 14.3108 8.47687 14.2895 8.36718 14.2896ZM15.0589 5.89659H0.832145C0.611126 5.89659 0.399024 5.98576 0.24361 6.14308C0.0869627 6.30193 -0.000698295 6.51617 -0.000339307 6.73926V8.24882C-0.000339307 8.71952 0.378005 9.09149 0.832145 9.09149H15.0487C15.5137 9.09149 15.8806 8.70869 15.8806 8.24882V6.73926C15.8824 6.62985 15.8626 6.52116 15.8222 6.41946C15.7818 6.31776 15.7217 6.22506 15.6453 6.14671C15.5689 6.06837 15.4778 6.00593 15.3771 5.963C15.2765 5.92007 15.1683 5.8975 15.0589 5.89659Z"
                            fill="#00C3F7"
                          />
                          <path
                            d="M30.6368 5.0988C30.2256 4.67318 29.7331 4.33462 29.1884 4.10326C28.6406 3.87305 28.0526 3.75397 27.4585 3.75294C26.8794 3.73957 26.3054 3.86332 25.7833 4.11409C25.433 4.28161 25.1171 4.51536 24.8534 4.80326V4.54148C24.8513 4.40823 24.8016 4.28012 24.7132 4.18033C24.6696 4.12827 24.615 4.08653 24.5533 4.05812C24.4917 4.0297 24.4244 4.01532 24.3565 4.016H22.4858C22.4178 4.0142 22.3502 4.02809 22.2883 4.05658C22.2265 4.08508 22.172 4.12742 22.1292 4.18033C22.0363 4.27732 21.9856 4.4072 21.9884 4.54148V17.0039C21.9884 17.1351 22.0425 17.2663 22.1285 17.3644C22.1754 17.4108 22.2312 17.4473 22.2924 17.4718C22.3537 17.4963 22.4192 17.5083 22.4852 17.5071H24.3776C24.5075 17.5071 24.626 17.4523 24.7234 17.3644C24.7744 17.3198 24.8146 17.2641 24.8409 17.2017C24.8671 17.1392 24.8788 17.0716 24.875 17.0039V12.7472C25.1451 13.0428 25.4909 13.2619 25.8693 13.3931C26.3667 13.5791 26.8858 13.667 27.4151 13.667C28.0202 13.667 28.6151 13.5568 29.1667 13.3166C29.7207 13.0857 30.2211 12.7431 30.6368 12.3103C31.0681 11.8591 31.4062 11.3273 31.6317 10.7453C31.8878 10.094 32.0127 9.39852 31.9992 8.6988C32.0073 7.99622 31.8826 7.29843 31.6317 6.64212C31.399 6.07011 31.0613 5.54667 30.6362 5.0988H30.6368ZM28.9292 9.60645C28.8302 9.87073 28.6795 10.1126 28.4858 10.3179C28.294 10.5242 28.0612 10.6881 27.8024 10.7992C27.5435 10.9103 27.2643 10.9661 26.9827 10.9631C26.6909 10.9631 26.41 10.9084 26.1508 10.788C25.8949 10.6777 25.6633 10.5179 25.4693 10.3179C25.276 10.1103 25.1221 9.86917 25.0151 9.60645C24.7991 9.04302 24.7991 8.41956 25.0151 7.85613C25.1126 7.59371 25.275 7.35294 25.4693 7.15549C25.6649 6.95461 25.896 6.79158 26.1508 6.6746C26.4106 6.55207 26.6955 6.49208 26.9827 6.49944C27.275 6.49944 27.5559 6.55422 27.826 6.67396C28.0744 6.79498 28.3018 6.94785 28.4967 7.1453C28.6909 7.35294 28.8317 7.58224 28.94 7.8453C29.1472 8.41474 29.1433 9.0396 28.9292 9.60645ZM42.1827 4.01536H40.3018C40.2366 4.01512 40.1721 4.0286 40.1125 4.05494C40.053 4.08128 39.9996 4.11988 39.9559 4.16823C39.9075 4.21735 39.8692 4.27555 39.8433 4.33949C39.8174 4.40343 39.8044 4.47186 39.8049 4.54084V4.77014C39.5684 4.49506 39.2776 4.27173 38.9508 4.11409C38.4393 3.8656 37.8761 3.74183 37.3075 3.75294C36.0963 3.75502 34.9347 4.23474 34.075 5.08798C33.6318 5.53803 33.2794 6.06912 33.0368 6.65231C32.7669 7.30399 32.6346 8.00441 32.6483 8.70963C32.6367 9.41468 32.7689 10.1147 33.0368 10.767C33.2782 11.3482 33.6267 11.8789 34.0642 12.3313C34.4821 12.7619 34.9832 13.1032 35.537 13.3344C36.0908 13.5657 36.6857 13.6821 37.2858 13.6765C37.8591 13.688 38.4209 13.5676 38.94 13.3154C39.2642 13.1517 39.5667 12.9332 39.8049 12.6593V12.9109C39.8049 13.0421 39.8585 13.1733 39.9559 13.2721C40.0534 13.3593 40.1725 13.4141 40.3018 13.4141H42.1827C42.3149 13.4116 42.4416 13.3611 42.5393 13.2721C42.5862 13.2246 42.6228 13.1681 42.647 13.106C42.6712 13.0439 42.6825 12.9775 42.6801 12.9109V4.54084C42.683 4.40666 42.6327 4.27678 42.54 4.1797C42.4971 4.12678 42.4426 4.08444 42.3808 4.05594C42.3189 4.02745 42.2507 4.01356 42.1827 4.01536ZM39.6425 9.59562C39.5436 9.8599 39.3928 10.1018 39.1992 10.3071C39.0048 10.5042 38.7782 10.6669 38.5292 10.788C37.9992 11.0287 37.3827 11.0287 36.8534 10.788C36.5985 10.671 36.3675 10.508 36.1718 10.3071C35.9784 10.1018 35.8279 9.85988 35.7292 9.59562C35.5238 9.03398 35.5238 8.41777 35.7292 7.85613C35.826 7.59371 35.9776 7.36377 36.1725 7.15549C36.3667 6.95868 36.5935 6.79498 36.8534 6.6746C37.1166 6.55568 37.4021 6.49418 37.6909 6.49418C37.9798 6.49418 38.2653 6.55568 38.5285 6.6746C38.7776 6.79498 39.0049 6.94785 39.1992 7.14466C39.3833 7.35294 39.5343 7.58224 39.6425 7.8453C39.8591 8.41409 39.8591 9.03766 39.6425 9.59562ZM60.94 8.46823C60.669 8.22957 60.3578 8.04087 60.0209 7.91091C59.664 7.76849 59.295 7.6585 58.9183 7.58224L57.4801 7.29817C57.1126 7.23256 56.8534 7.13384 56.7126 7.01345C56.6541 6.97275 56.6061 6.91884 56.5723 6.85609C56.5386 6.79335 56.5201 6.72353 56.5183 6.65231C56.5183 6.49944 56.6049 6.36823 56.7884 6.25868C57.0368 6.12747 57.3075 6.06122 57.5884 6.08352C57.9559 6.08352 58.3234 6.15995 58.6585 6.30199C58.9833 6.44466 59.3075 6.60899 59.5992 6.80517C60.0209 7.06823 60.3776 7.02428 60.626 6.72874L61.3183 5.94148C61.4476 5.80963 61.5234 5.63511 61.5349 5.44912C61.5291 5.3533 61.5029 5.25981 61.4581 5.17491C61.4132 5.09001 61.3508 5.01564 61.275 4.95677C60.9827 4.70517 60.5183 4.43129 59.9018 4.16887C59.2858 3.90645 58.5069 3.76377 57.5884 3.76377C57.0278 3.75626 56.4695 3.83752 55.9342 4.00454C55.4767 4.14566 55.0482 4.36787 54.6693 4.66059C54.3279 4.92785 54.0508 5.26826 53.8585 5.65677C53.6752 6.03555 53.5792 6.45062 53.5776 6.87142C53.5776 7.64849 53.8151 8.28288 54.2801 8.75294C54.7451 9.22364 55.3616 9.53001 56.1292 9.68288L57.6209 10.0115C57.9457 10.0663 58.2693 10.1644 58.5725 10.3071C58.7342 10.3727 58.8425 10.5364 58.8425 10.7224C58.8425 10.8867 58.7559 11.0396 58.5725 11.1714C58.3884 11.3026 58.0858 11.3899 57.6967 11.3899C57.2887 11.3968 56.8848 11.3069 56.5183 11.1275C56.1709 10.9598 55.8474 10.7465 55.5565 10.4931C55.429 10.3857 55.2819 10.304 55.1234 10.2523C54.9508 10.1975 54.7451 10.2523 54.5183 10.4383L53.6967 11.0619C53.5849 11.1425 53.4981 11.2531 53.4465 11.3809C53.3949 11.5087 53.3805 11.6485 53.4049 11.7842C53.4476 12.058 53.675 12.3307 54.0967 12.6485C55.133 13.3481 56.3599 13.7111 57.61 13.688C58.192 13.6955 58.7717 13.6143 59.3292 13.4472C59.8073 13.3027 60.257 13.0769 60.6585 12.7797C61.0151 12.5058 61.3183 12.1555 61.5234 11.751C61.7212 11.3532 61.8247 10.9151 61.826 10.4708C61.835 10.0714 61.7538 9.67516 61.5884 9.31154C61.425 8.99375 61.2053 8.70759 60.94 8.46823ZM69.1559 10.7447C69.1138 10.6699 69.0546 10.6062 68.9832 10.5586C68.9119 10.511 68.8303 10.4809 68.7451 10.4708C68.5725 10.4708 68.3992 10.5256 68.2585 10.6236C68.0295 10.7742 67.7646 10.8612 67.4909 10.8759C67.4043 10.8759 67.3075 10.865 67.2209 10.8428C67.1271 10.8239 67.0409 10.7784 66.9725 10.7115C66.8861 10.6311 66.8163 10.5346 66.7667 10.4275C66.7057 10.2669 66.6763 10.096 66.6801 9.92428V6.51027H69.1234C69.2661 6.50688 69.4019 6.44792 69.5018 6.34594C69.5525 6.30034 69.5931 6.24467 69.621 6.18249C69.649 6.1203 69.6637 6.05297 69.6642 5.98479V4.54148C69.6651 4.4715 69.6511 4.40212 69.6231 4.33798C69.5951 4.27383 69.5537 4.2164 69.5018 4.1695C69.4037 4.07279 69.272 4.01797 69.1343 4.01664H66.6909V1.68543C66.6949 1.61612 66.6834 1.54679 66.6573 1.48247C66.6312 1.41814 66.5911 1.36041 66.54 1.31345C66.4462 1.22459 66.3227 1.17394 66.1935 1.17142H64.2909C64.1546 1.16876 64.0226 1.21977 63.9234 1.31345C63.8226 1.41132 63.7645 1.54498 63.7616 1.68543V4.01664H62.6801C62.6121 4.01476 62.5445 4.02855 62.4827 4.05693C62.4208 4.08531 62.3664 4.12754 62.3234 4.18033C62.2351 4.28012 62.1854 4.40823 62.1833 4.54148V5.98543C62.1833 6.11664 62.2368 6.24849 62.3234 6.34657C62.3646 6.40135 62.4188 6.44504 62.481 6.47372C62.5433 6.50241 62.6117 6.51518 62.6801 6.51091H63.7616V10.5701C63.751 11.052 63.8469 11.5303 64.0425 11.9708C64.2168 12.3307 64.4633 12.651 64.7667 12.9115C65.0693 13.1631 65.426 13.3383 65.7935 13.4478C66.1752 13.5663 66.5728 13.6254 66.9725 13.623C67.4979 13.622 68.0198 13.5368 68.5183 13.3708C68.9807 13.2166 69.3996 12.9541 69.74 12.6052C69.8433 12.4989 69.9063 12.3598 69.9181 12.212C69.9298 12.0642 69.8896 11.9169 69.8043 11.7956L69.1559 10.7447ZM79.4585 4.01536H77.5776C77.5124 4.01512 77.4479 4.0286 77.3883 4.05494C77.3288 4.08128 77.2754 4.11988 77.2317 4.16823C77.1831 4.21728 77.1447 4.27545 77.1187 4.3394C77.0927 4.40334 77.0796 4.47181 77.0801 4.54084V4.77014C76.8437 4.49489 76.5529 4.27153 76.226 4.11409C75.7112 3.86443 75.1445 3.74065 74.5725 3.75294C73.9741 3.75298 73.3816 3.8709 72.8288 4.09997C72.2761 4.32904 71.7738 4.66477 71.3508 5.08798C70.9042 5.53526 70.5513 6.06707 70.3126 6.65231C70.0437 7.30029 69.9112 7.99672 69.9234 8.69817C69.9122 9.40325 70.0446 10.1032 70.3126 10.7555C70.5508 11.3351 70.9075 11.8714 71.34 12.3198C71.7568 12.7498 72.2558 13.0916 72.8075 13.3246C73.3591 13.5577 73.952 13.6774 74.5508 13.6765C75.1215 13.6872 75.687 13.5673 76.2043 13.3262C76.5292 13.1625 76.8317 12.944 77.0693 12.6701V12.9109C77.0706 13.0447 77.1228 13.1721 77.2158 13.2657C77.3085 13.3597 77.4347 13.413 77.5667 13.4141H79.4585C79.5896 13.4143 79.7154 13.3626 79.8086 13.2704C79.9018 13.1782 79.9547 13.0528 79.9559 12.9217V4.54148C79.9573 4.47499 79.9456 4.40887 79.9214 4.3469C79.8973 4.28494 79.8612 4.22834 79.8151 4.18033C79.7723 4.12738 79.7178 4.08501 79.656 4.05651C79.5941 4.02802 79.5265 4.01352 79.4585 4.01536ZM76.9183 9.59562C76.8192 9.85983 76.6685 10.1017 76.475 10.3071C76.2804 10.5043 76.0536 10.6669 75.8043 10.788C75.5411 10.9117 75.2524 10.9717 74.9616 10.9631C74.6693 10.9631 74.3884 10.8975 74.1292 10.788C73.8743 10.671 73.6433 10.508 73.4476 10.3071C73.2541 10.1017 73.1034 9.85983 73.0043 9.59562C72.7993 9.03392 72.7993 8.41783 73.0043 7.85613C73.1036 7.59523 73.2544 7.35697 73.4476 7.15549C73.6425 6.95868 73.8693 6.79498 74.1292 6.6746C74.3905 6.55597 74.6747 6.49617 74.9616 6.49944C75.2534 6.49944 75.5343 6.55422 75.8043 6.67396C76.0534 6.79498 76.2801 6.94785 76.475 7.1453C76.6693 7.35294 76.8209 7.58224 76.9183 7.8453C77.145 8.40672 77.145 9.0342 76.9183 9.59562ZM89.7833 10.6243L88.7018 9.79243C88.4967 9.62874 88.3018 9.58479 88.1292 9.6504C87.977 9.71565 87.8406 9.81273 87.7291 9.93511C87.4927 10.2215 87.2159 10.4721 86.9075 10.6791C86.5833 10.865 86.226 10.9529 85.8585 10.9306C85.436 10.9354 85.0227 10.8073 84.6769 10.5644C84.3294 10.3201 84.0661 9.9741 83.9234 9.57396C83.8253 9.30002 83.7742 9.01144 83.7725 8.72046C83.7725 8.42492 83.8151 8.12938 83.9234 7.8453C84.0209 7.58224 84.1616 7.34212 84.3559 7.14466C84.5508 6.94785 84.7776 6.78352 85.026 6.67396C85.2905 6.55219 85.5781 6.48897 85.8693 6.48861C86.2367 6.47539 86.6004 6.56636 86.9183 6.75103C87.2292 6.95477 87.5065 7.20577 87.74 7.49498C87.8476 7.61536 87.9776 7.71345 88.1292 7.7797C88.3018 7.8453 88.4967 7.80135 88.6909 7.63702L89.7725 6.81664C89.9018 6.72874 90.01 6.59753 90.0534 6.44466C90.084 6.36284 90.096 6.27523 90.0885 6.18818C90.081 6.10114 90.0542 6.01686 90.01 5.94148C89.5928 5.29031 89.0208 4.75264 88.3451 4.37651C87.6317 3.97205 86.7776 3.76377 85.826 3.76377C85.1552 3.76395 84.4907 3.89394 83.8693 4.14657C83.2756 4.38891 82.7355 4.74605 82.2801 5.19753C81.8233 5.64482 81.4628 6.18087 81.2209 6.77269C80.7125 8.0252 80.7125 9.42655 81.2209 10.6791C81.4693 11.2695 81.826 11.8058 82.2801 12.2434C83.2265 13.1706 84.5011 13.6858 85.826 13.6765C86.7776 13.6765 87.6317 13.4689 88.3451 13.0638C89.0267 12.6872 89.6028 12.1456 90.0209 11.4886C90.065 11.4152 90.0918 11.3327 90.0993 11.2474C90.1068 11.1621 90.0948 11.0762 90.0642 10.9963C90.0129 10.8454 89.9144 10.7149 89.7833 10.6243ZM99.7935 12.5714L96.8209 8.20581L99.3616 4.84721C99.421 4.77057 99.4616 4.68115 99.4803 4.58606C99.4989 4.49097 99.4952 4.39283 99.4693 4.29944C99.426 4.16887 99.3075 4.02619 98.9941 4.02619H96.9833C96.8675 4.02946 96.7534 4.05543 96.6476 4.10263C96.5233 4.16514 96.4214 4.2646 96.3559 4.38734L94.3234 7.23256H93.8368V0.503263C93.8383 0.436811 93.8267 0.37071 93.8027 0.308741C93.7786 0.246772 93.7426 0.190152 93.6967 0.142116C93.6496 0.0959633 93.5938 0.0596358 93.5326 0.0352502C93.4714 0.0108646 93.4059 -0.00109153 93.34 7.82494e-05H91.4585C91.3263 0.00261245 91.1995 0.0530904 91.1018 0.142116C91.0515 0.187446 91.0119 0.243336 90.9858 0.305775C90.9597 0.368215 90.9478 0.435657 90.9508 0.503263V12.9109C90.9508 13.0529 91.0043 13.1848 91.1018 13.2721C91.1488 13.3183 91.2046 13.3546 91.2658 13.379C91.327 13.4034 91.3925 13.4153 91.4585 13.4141H93.34C93.4722 13.4116 93.5989 13.3611 93.6967 13.2721C93.7426 13.224 93.7786 13.1674 93.8027 13.1054C93.8267 13.0435 93.8383 12.9774 93.8368 12.9109V9.62874H94.3776L96.5935 13.0313C96.7234 13.2721 96.9725 13.4249 97.2425 13.4249H99.3508C99.675 13.4249 99.8043 13.2721 99.8585 13.1408C99.8965 13.0481 99.9105 12.9473 99.8992 12.8478C99.8878 12.7482 99.8514 12.6532 99.7935 12.5714ZM52.875 4.01536H50.7667C50.6888 4.0108 50.6107 4.02312 50.538 4.05148C50.4652 4.07984 50.3994 4.12358 50.3451 4.1797C50.2498 4.27671 50.1826 4.39779 50.1508 4.53001L48.5935 10.3287H48.2158L46.5514 4.53001C46.5197 4.40743 46.4646 4.29214 46.389 4.19052C46.3431 4.13484 46.2853 4.09019 46.2198 4.05987C46.1543 4.02956 46.0828 4.01434 46.0107 4.01536H43.8266C43.5464 4.01536 43.3731 4.10326 43.2973 4.28925C43.2432 4.45294 43.2432 4.63957 43.2973 4.80326L45.9674 12.9549C46.0107 13.0752 46.0756 13.1956 46.1731 13.2829C46.2814 13.3816 46.4215 13.4357 46.5725 13.4249H47.6973L47.5999 13.688L47.3514 14.4428C47.275 14.6721 47.1349 14.8803 46.9406 15.0332C46.7609 15.1713 46.5398 15.2447 46.3132 15.2415C46.119 15.2415 45.9247 15.1975 45.7514 15.1205C45.5739 15.0434 45.4068 14.9444 45.254 14.8256C45.1151 14.7264 44.9488 14.673 44.7782 14.6727H44.7565C44.6588 14.6776 44.5638 14.7072 44.4806 14.7587C44.3974 14.8103 44.3286 14.8822 44.2807 14.9676L43.6107 15.9523C43.3406 16.3791 43.4916 16.6529 43.6648 16.8058C44.0223 17.136 44.4462 17.386 44.9081 17.5389C45.4197 17.7136 45.9567 17.8023 46.4973 17.8013C47.4591 17.8013 48.2699 17.5389 48.8858 17.0141C49.5291 16.4493 49.9979 15.7129 50.2374 14.8912L53.3298 4.80326C53.3948 4.6281 53.4056 4.44212 53.3406 4.26696C53.2865 4.14657 53.1667 4.01536 52.875 4.01536Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1966_5311">
                            <rect
                              width="100"
                              height="17.8344"
                              fill="white"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                  </div>
                </AtomsKlumpButton>
                <AtomsKlumpButton
                  v-if="!paymentType.includes('Instalments') && false"
                  type="secondary"
                  radius="all"
                  @clicked="initiatePaymentAsync"
                >
                  <span>Pay {{ formatCurrency(grandTotal) }} with</span
                  ><span class="ml-1">
                    <svg
                      width="120"
                      height="20"
                      viewBox="0 0 120 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                    >
                      <rect
                        width="120"
                        height="19.8284"
                        fill="url(#pattern0_1966_5320)"
                      />
                      <defs>
                        <pattern
                          id="pattern0_1966_5320"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlink:href="#image0_1966_5320"
                            transform="scale(0.000372995 0.00225734)"
                          />
                        </pattern>
                        <image
                          id="image0_1966_5320"
                          width="2681"
                          height="443"
                          xlink:href="data:image/png;base64,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QAIkQAIkQAIkQAIkQAJpEUCUzXpE5WQiARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARLICQE4gw1gJM/Mo/c8b0DmpVJiqgSGTFj/4Ip5g6Z4MV2Jsnnh6KlFP9WyaeOlI6fJllR52Z7fs11B6kcCJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACmSQAB8+iTMqjrHYCvg76k4UdBIZOXD8n8NUUaBOZZcu7IHtv4u2NF0XRwdPYTCfPLlqeh0iABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABCJJgCsgh9CsSityDYFrT0UaR08/0JejfFNPZVheTutAvj/4yg2fPPoL0mK5rj1Wj06ePUbHgiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAo4SyIfoho42DdXOJIFhEzb+n+jgQ5D5Zibl5lqWFtkID88rhkzYMB264Gt0E508o9u2tIwESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESKADAvAIa+1gN3elSUApTa5pMgyj+ODxm15NbGs9WYk8Hob8rMtUeoFuDo4fMn7TA1mvOwcV0skzB9BZJQmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQQO4IwNltc+5qj27NSnlbo2ud25YNn7T1vcraDR9FzMuvwhI3l29X0hhodXPVwo3nD71m0xtut0jy2tPJM3lWzEkCJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJBABAmap5wiYYZ0JgQ7I1bpW2aXQ9OkSDB6/4bZ43B+jA/nbriPWf4K6+u6mbc0jh45f/2tjh/UaZ1DBggzKoigSIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESsJ4AInmusV5JBxXUvveOg2rnncpHf2Lzchj94ZXVgy4VpX+klBxrKwTjjBoo/9vDxm9+yVYdw9aLkTzDJkz5JEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACVhHQSlZbpVBElPFiPrk61JZDJqx/8MVgQ3ngq0lYxr3OItV9Ef2A+PEzhkzY8OF8dvA0bcJInhadmVSFBEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEggfAI6UMuUwqLtTBkl0NzauiSjAiksdAITJwocKtfPQUV3rZg34AJPxW4UT10CJ8vi0CvfpwL9hgRqTrP2K0ZO3Lxyn8N5ugORh5lIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIIH8IwJnt/3mx2BP5Y3EWLFXSOPiKDfuhJnrPZgF3mFU0zOo3qLh34eWe0ljOXY1DXX1Dqi/QWr8myvub9uP3D53Y+CLq4fmzF2w6ee4FhF9JgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgASiTWDZ7L4HFvQpWhttK7NsndILBl+x8dws18rqQiZQP0+KSmTgKcqT0z2lThAlY+CGORTVlqRSNTw3tyN47nKUXaxjsijw9YutTYnnjr1+y/pU5ORjXjp55mOr02YSIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESyHMCq+4rfQsIDs9zDJkzX8nPEMnz65kTSEm2Epg+XbzrRg083Av8QyVWeBAcOAcoFfQW8YqUDhJBTMWVr7eIVpuCILHe8/y3hkzcZpyqGaWzB41KJ88eQGMREiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABtwmsvL/0z4gsONFtK+zR3vf1x4ZN3PiIPRpRExKIBgEvGmbQChIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARJInoAO1NPJ52bObgjE41s2kmc3kHiYBHpCgE6ePaHGMiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAk4T0InWvzltgE3KK3l65DTZYpNK1IUEokKATp5RaUnaQQIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkkDSBYZ/YslS0Wp50AWbslEAQqL90epAHSIAE0iJAJ8+08LEwCZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZAACZCAswQ8fb+zutujeEJam+fbow41IYFoEaCTZ7Tak9aQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAkkScAP/HlJZmW2zggE8vjQT25b29lh7icBEkiPAJ080+PH0iRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAo4SGDZ+80tQvd5R9a1QO1D6D1YoQiVIIKIE6OQZ0YalWSRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAt0T0Fpmdp+LOTokoNXy2XUbH+nwGHeSAAlkhACdPDOCkUJIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgARIgAScJLAlqITeW53UPcdKawl+Pn26BDlWg9WTQKQJ0Mkz0s1L40iABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABLoiMGTKpk2I5lnRVR4e65DA24k1G42DLBMJkECIBOjkGSJciiYBEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABErCfgB/f/nNo2Wq/pvZoGAQy/egvSIs9GlETEogmATp5RrNdaRUJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkECSBIZfvf2tQPSMJLMzm5a6l/QGRvHkmUACWSBAJ88sQGYVJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEACJEAClhNoaf0faLjFci1tUE8HfnDTxIni26AMdSCBqBOgk2fUW5j2kQAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJdEtg6Ce3rdWib+02Y55n0Eoqh1616ek8x0DzSSBrBOjkmTXUrIgESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESMBmAk3+xjtEySKbdcylbkrkrSChv5JLHVg3CeQbATp55luL014SIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIIEOCZRNlNYgkZiCg1yKfF9Cvpbg+mETN27e9xD3kAAJhEWATp5hkaVcEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiAB5wgMndj4ggTyI+cUD1lhreV/Bl+56amQq6F4EiCBvQjQyXMvIPxKAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiSQ3wRW1m/4Pgg8m98UdlmvA/nLrLoNt+7aw08kQALZIqCyVRHrIQESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAESIAFXCCya0/uQ3r1LXoC+h7uicxh6aq1faQo2noOl7LeGIZ8ySYAEuibASJ5d8+FREiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiABEiCBPCQw6rqmd3ztXw7Tt+Wh+e0ma7Vct7Z+lA6eeXsG0HALCNDJ04JGoAokQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAL2ERg2fvNL2pfx0Cxun3Zha6Tf0HH/gqGf/P/t3TuIXFUYAOD/3FGMCewjASGFQuKCwhYiWKiwYAQRK0HhokEkhbVYWaexsVCxSwpTpJGN8VUFFAsrCVgIMYIJ2RXEYMR96G523cy9x4tNqoXEndmdufebapg59398B6b6+Wf992FnEp8Age0FDHlub+MbAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQ6LnCkXLpQV3G8Yeh3hqLZ4LlZ1ceOvLqy2JmeNUpgRAUMeY7oxSiLAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIHREDhaLn1S5XglIv0zGhUNsYqcf7i5sTH3aLm6MMQsQhMgcIcC6Q7POUaAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIFOC1ydn3z2nl7v0wZhso0QKecv1url12bLWGtjf3oiMI4CNnmO462pmQABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgACBXReYKVe/2bq19VSOuLLryYebsM5RnzxzafklA57DhRadwN0K2OR5t2LOEyBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECDQaYGFM1NTMVmcSjnKFkD8VlfViaPl6lct6EULBFonYMizdVeqIQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEdkNg4fzUiYjivWYIa3o38g08R85n1+vqrdnyr6WBxxaQAIGBCBjyHAijIAQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIdFHg8tn9hw/cv+/9nP7b6jkW81g5x091qt58+OXVr7t4Z3omME4CY/GjMk6gaiVAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAoHsC185NzxVFerfp/MlR7T5HXM85vfPLpT9PHTsZ/VGtU10ECNwWMOR528I7AgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQI7Ehg8dzEC9HrvR05PbOjQAN9OC82w50fXK+XTj9dxsZAQwtGgMBQBQx5DpVXcAIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEuihw7eOpx4p70xsR6XjT/8E9MOhHzheizh9djJUvyzKqPahBSgIEdihgyHOHgB4nQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIDAdgJXPoz7isPTz/WK9GIzrPV885fpD253dgCf34w6vs1F9Vm1Xn0+8/rajQHEFIIAgT0UMOS5h/hSEyBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECDQLYGr8xMzvVTM5SI9kSI93gxwPdII/J9Nn5sR+edmU+jluo7vc87fbcbyxdkytrolqlsC7RYw5Nnu+9UdAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIjLvDj/MTB/VE8lFN+IKXiUM7pQKS0rxnuKlKu+3Uv3UpV/jtyWunX1Y20Vf3abOn8o2mrWQzqRYBAmwX+BSZeT4lyiXB3AAAAAElFTkSuQmCC"
                        />
                      </defs>
                    </svg>
                  </span>
                </AtomsKlumpButton>
              </div>
            </div>
            <AtomsKlumpButton
              v-if="screen !== 1"
              type="secondary"
              radius="all"
              @clicked="goBack"
              >Back
            </AtomsKlumpButton>
          </div>
        </div>
      </div>
    </template>
  </MoleculesKlumpDrawer>
</template>
