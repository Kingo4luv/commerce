import { defineStore } from 'pinia'

// Export types directly from this store
export interface Merchant {
  id: string | number
  business_name: string
  slug: string
  address: string
  city: string
  state: string
  phone: string
  is_live?: boolean
  credential?: any[]
  [key: string]: any
}

export interface CartItem {
  product_id: string | number
  slug: string
  name: string
  price: number
  limit: number
  quantity: number
  merchant: Merchant
  image_url: string
  item_url: string
  [key: string]: any
}

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info' | null
  message: string
}

interface CheckoutState {
  cart: CartItem[]
  merchant: Merchant | null
  preservedMerchant: Merchant | null
  notification: Notification
}

export const useCheckoutStore = defineStore('checkout', {
  state: (): CheckoutState => ({
    cart: [],
    merchant: null,
    preservedMerchant: null,
    notification: {
      type: null,
      message: '',
    },
  }),

  getters: {
    getCart: state => state.cart,
    getNotification: state => state.notification,
    getMerchant: state => state.merchant || state.preservedMerchant,
    getCartTotal: state => {
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    getCartItemCount: state => {
      return state.cart.reduce((count, item) => count + item.quantity, 0)
    },
  },

  actions: {
    addToCart(product: CartItem) {
      const productIndex = this.cart.findIndex(item => item.product_id === product.product_id)

      if (productIndex === -1) {
        // Add new product to cart
        this.cart.push(product)
      } else {
        // Update existing product quantity
        const existingProduct = this.cart[productIndex]
        if (product.quantity > 1) {
          existingProduct.quantity += product.quantity
        } else {
          existingProduct.quantity++
        }
        this.cart[productIndex] = existingProduct
      }

      // Update merchant if cart has items
      if (this.cart.length > 0) {
        this.merchant = this.cart[0].merchant
      }

      // Save to localStorage
      this.saveCartToStorage()
    },

    updateCart(product: { product_id: string | number; quantity: number }) {
      const productIndex = this.cart.findIndex(item => item.product_id === product.product_id)

      if (productIndex !== -1) {
        if (product.quantity > 0) {
          // Update quantity
          this.cart[productIndex].quantity = product.quantity
        } else {
          // Remove item
          this.cart = this.cart.filter(item => item.product_id !== product.product_id)
        }

        // Update merchant if cart has items
        if (this.cart.length > 0) {
          this.merchant = this.cart[0].merchant
        } else {
          this.merchant = null
        }

        // Save to localStorage
        this.saveCartToStorage()
      }
    },

    removeFromCart(productId: string | number) {
      this.cart = this.cart.filter(item => item.product_id !== productId)

      // Update merchant if cart has items
      if (this.cart.length > 0) {
        this.merchant = this.cart[0].merchant
      } else {
        this.merchant = null
      }

      // Save to localStorage
      this.saveCartToStorage()
    },

    initCart(cartItems: CartItem[]) {
      this.cart = cartItems
      if (cartItems.length > 0) {
        this.merchant = cartItems[0].merchant
        // Clear preserved merchant when new cart is initialized
        this.preservedMerchant = null
      }
    },

    clearCart() {
      // Preserve merchant data for success screen
      if (this.merchant && this.merchant.address && this.merchant.city && this.merchant.state) {
        this.preservedMerchant = { ...this.merchant }
      }
      this.cart = []
      this.merchant = null
      this.removeCartFromStorage()
    },

    clearPreservedMerchant() {
      this.preservedMerchant = null
    },

    setNotification(notification: Notification) {
      this.notification = notification

      // Auto-clear notification after 3 seconds
      if (process.client && typeof window !== 'undefined') {
        window.setTimeout(() => {
          this.notification = { message: '', type: null }
        }, 3000)
      }
    },

    clearNotification() {
      this.notification = { message: '', type: null }
    },

    // Local storage helpers
    saveCartToStorage() {
      if (process.client && typeof window !== 'undefined') {
        window.localStorage.setItem('cart', JSON.stringify(this.cart))
      }
    },

    loadCartFromStorage() {
      if (process.client && typeof window !== 'undefined') {
        const storedCart = window.localStorage.getItem('cart')
        if (storedCart) {
          try {
            const cartItems = JSON.parse(storedCart)
            this.initCart(cartItems)
          } catch {
            this.clearCart()
          }
        }
      }
    },

    removeCartFromStorage() {
      if (process.client && typeof window !== 'undefined') {
        window.localStorage.removeItem('cart')
      }
    },
  },
})
