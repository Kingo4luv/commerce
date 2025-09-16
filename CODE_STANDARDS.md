# Klump Commerce - Code Standards

This document outlines the coding standards and conventions for the Klump
Commerce Nuxt 3 project.

## 📁 Project Structure

```
klump-commerce/
├── components/          # Vue components (auto-imported)
│   ├── atoms/          # Basic UI elements (buttons, inputs)
│   ├── molecules/      # Composed UI elements (forms, cards)
│   ├── organisms/      # Complex UI sections (headers, footers)
│   └── templates/      # Page-level templates
├── composables/        # Composable functions (auto-imported)
├── layouts/           # Layout components
├── pages/             # File-based routing pages
├── plugins/           # Nuxt plugins
├── stores/            # Pinia stores
├── assets/            # Assets (images, styles)
├── public/            # Static files
└── server/            # Server-side code
```

## 🎯 Component Standards

### Component Structure Order

**ALWAYS** follow this order in Vue components:

```vue
<script setup lang="ts">
// 1. Imports
// 2. Types/Interfaces
// 3. Props & Emits
// 4. Reactive data
// 5. Computed properties
// 6. Functions/Methods
// 7. Watch properties
// 8. Lifecycle hooks
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
/* Component styles */
</style>
```

### Component Naming

- **File names**: PascalCase (e.g., `KlumpButton.vue`, `ProductCard.vue`)
- **Component names**: PascalCase in templates
- **Props**: camelCase
- **Events**: kebab-case

```vue
<!-- ✅ Good -->
<KlumpButton :is-loading="loading" @click-handler="handleClick">
  Submit
</KlumpButton>

<!-- ❌ Bad -->
<klump-button :IsLoading="loading" @clickHandler="handleClick">
  Submit
</klump-button>
```

### TypeScript Interfaces

Always define TypeScript interfaces for:

- Props
- Emits
- Complex data structures
- API responses

```vue
<script setup lang="ts">
interface Props {
  /** Button text content */
  label: string
  /** Loading state */
  isLoading?: boolean
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger'
}

interface Emits {
  click: [event: MouseEvent]
  submit: [data: FormData]
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  variant: 'primary',
})

const emit = defineEmits<Emits>()
</script>
```

## 🎨 Styling Standards

### CSS Class Naming

- Use **kebab-case** for CSS classes
- Follow BEM methodology when needed
- Prefer Tailwind utility classes

```vue
<template>
  <!-- ✅ Good -->
  <div class="product-card bg-white p-4 rounded-lg shadow-md">
    <h3 class="product-card__title text-lg font-semibold">
      {{ title }}
    </h3>
  </div>

  <!-- ❌ Bad -->
  <div class="productCard bg-white p-4 rounded-lg shadow-md">
    <h3 class="ProductCard_Title text-lg font-semibold">
      {{ title }}
    </h3>
  </div>
</template>
```

### Tailwind CSS Usage

- Prefer utility classes over custom CSS
- Use `@apply` for repeated patterns
- Keep responsive design in mind

```vue
<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors;
}

/* ✅ Responsive utilities */
.container {
  @apply w-full mx-auto px-4 sm:px-6 lg:px-8;
}
</style>
```

## 📝 JavaScript/TypeScript Standards

### Variable Naming

- **camelCase** for variables and functions
- **PascalCase** for classes and interfaces
- **SCREAMING_SNAKE_CASE** for constants

```typescript
// ✅ Good
const userName = 'john_doe'
const MAX_RETRY_ATTEMPTS = 3
const calculateTotal = (items: CartItem[]) => {}

interface UserProfile {
  name: string
  email: string
}

// ❌ Bad
const user_name = 'john_doe'
const maxRetryAttempts = 3
const calculate_total = (items: CartItem[]) => {}
```

### Function Declarations

- Use arrow functions for simple operations
- Use function declarations for complex logic
- Always specify return types for complex functions

```typescript
// ✅ Simple operations
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount)

// ✅ Complex logic
function processPayment(data: PaymentData): Promise<PaymentResult> {
  // Complex payment processing logic
  return paymentProcessor.process(data)
}
```

### Error Handling

- Always handle errors explicitly
- Use TypeScript's strict null checks
- Provide meaningful error messages

```typescript
// ✅ Good
const fetchUserData = async (id: string): Promise<User | null> => {
  try {
    const response = await $fetch(`/api/users/${id}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error)
    return null
  }
}

// ❌ Bad
const fetchUserData = async (id: string) => {
  const response = await $fetch(`/api/users/${id}`)
  return response.data
}
```

## 🔄 State Management (Pinia)

### Store Structure

```typescript
// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)

  // Getters
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // Actions
  const addItem = (item: CartItem) => {
    const existingItem = items.value.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      items.value.push(item)
    }
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    // State
    items: readonly(items),
    isLoading: readonly(isLoading),

    // Getters
    totalItems,
    totalPrice,

    // Actions
    addItem,
    clearCart,
  }
})
```

## 🧩 Composables

### Composable Naming

- Start with `use` prefix
- Use camelCase
- Be descriptive about functionality

```typescript
// composables/useFormatCurrency.ts
export const useFormatCurrency = () => {
  const formatCurrency = (amount: number, currency = 'NGN'): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return {
    formatCurrency,
  }
}

// composables/useApi.ts
export const useApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const request = async <T>(
    url: string,
    options?: RequestInit
  ): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<T>(url, options)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    request,
  }
}
```

## 📦 Import Organization

Always organize imports in this order:

```typescript
// 1. Node modules / External libraries
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 2. Internal utilities and composables
import { useFormatCurrency } from '~/composables/useFormatCurrency'
import { useCartStore } from '~/stores/cart'

// 3. Components
import KlumpButton from '~/components/atoms/KlumpButton.vue'
import ProductCard from '~/components/molecules/ProductCard.vue'

// 4. Types
import type { Product, CartItem } from '~/types'
```

## 🧪 Testing Standards

### Test File Naming

- Test files: `ComponentName.test.ts` or `ComponentName.spec.ts`
- Place tests next to components or in `__tests__` folder

### Test Structure

```typescript
// components/atoms/KlumpButton.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KlumpButton from './KlumpButton.vue'

describe('KlumpButton', () => {
  it('renders with correct label', () => {
    const wrapper = mount(KlumpButton, {
      props: {
        label: 'Click me',
      },
    })

    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(KlumpButton, {
      props: {
        label: 'Click me',
      },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
```

## 🚀 Performance Standards

### Lazy Loading

- Use `defineAsyncComponent` for heavy components
- Implement lazy loading for routes
- Use `v-show` vs `v-if` appropriately

```vue
<script setup lang="ts">
// Lazy load heavy components
const HeavyChart = defineAsyncComponent(
  () => import('~/components/HeavyChart.vue')
)

// Use v-show for frequently toggled elements
const isVisible = ref(false)
</script>

<template>
  <!-- ✅ Good for frequent toggles -->
  <div v-show="isVisible">Content</div>

  <!-- ✅ Good for conditional rendering -->
  <HeavyChart v-if="shouldShowChart" />
</template>
```

### Image Optimization

```vue
<template>
  <!-- ✅ Use Nuxt Image component -->
  <NuxtImg
    src="/images/product.jpg"
    alt="Product image"
    width="300"
    height="200"
    loading="lazy"
    format="webp"
  />
</template>
```

## 🔧 Development Workflow

### Git Commit Messages

Follow conventional commits:

```bash
# Types: feat, fix, docs, style, refactor, test, chore
feat: add product search functionality
fix: resolve cart total calculation issue
docs: update API documentation
style: format code with prettier
refactor: extract payment logic to composable
test: add unit tests for cart store
chore: update dependencies
```

### Branch Naming

```bash
# Features
feature/product-search
feature/payment-integration

# Bug fixes
bugfix/cart-calculation
hotfix/critical-security-issue

# Chores
chore/update-dependencies
chore/setup-testing
```

## 📋 Code Review Checklist

- [ ] Component follows script-first structure
- [ ] TypeScript interfaces are defined
- [ ] Props have JSDoc comments
- [ ] Functions have appropriate return types
- [ ] Error handling is implemented
- [ ] Performance considerations are addressed
- [ ] Tests are written for new functionality
- [ ] Code is formatted with Prettier
- [ ] ESLint passes without errors
- [ ] Accessibility standards are met

## 🛠️ Tools & Scripts

### Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### IDE Configuration

#### VS Code Settings (.vscode/settings.json)

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.formatDocument": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "vue.inlayHints.missingProps": true,
  "vue.inlayHints.optionsWrapper": true
}
```

#### Recommended Extensions

- Vue - Official
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- Auto Rename Tag
- GitLens

---

## 📚 Additional Resources

- [Nuxt 3 Documentation](https://nuxt.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)

---

_Last updated: 2024_
