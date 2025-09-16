<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center"
          >
            <span class="text-white font-bold text-sm">📚</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900">Klump Storybook</h1>
            <p class="text-xs text-gray-500">Vue 3 Component Testing</p>
          </div>
        </div>
        <NuxtLink
          to="/"
          class="text-xs text-blue-600 hover:text-blue-800 mt-2 block"
          >← Back to App</NuxtLink
        >
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto p-4">
        <nav class="space-y-1">
          <!-- Introduction -->
          <div class="mb-6">
            <button
              @click="selectStory('introduction', null)"
              :class="[
                'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                activeComponent === 'introduction' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              🏠 Introduction
            </button>
          </div>

          <!-- Atoms Section -->
          <div class="mb-4">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Atoms</h3>

            <!-- KlumpButton -->
            <div class="ml-2">
              <button
                @click="toggleComponent('KlumpButton')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpButton' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                🔘 KlumpButton
                <span class="text-xs">{{ openComponents.includes('KlumpButton') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpButton')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in buttonStories"
                  :key="story.id"
                  @click="selectStory('KlumpButton', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpImage -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpImage')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpImage' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                🖼️ KlumpImage
                <span class="text-xs">{{ openComponents.includes('KlumpImage') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpImage')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in imageStories"
                  :key="story.id"
                  @click="selectStory('KlumpImage', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpHeading -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpHeading')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpHeading' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                📝 KlumpHeading
                <span class="text-xs">{{ openComponents.includes('KlumpHeading') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpHeading')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in headingStories"
                  :key="story.id"
                  @click="selectStory('KlumpHeading', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpInput -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpInput')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpInput' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                ⌨️ KlumpInput
                <span class="text-xs">{{ openComponents.includes('KlumpInput') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpInput')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in inputStories"
                  :key="story.id"
                  @click="selectStory('KlumpInput', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpLabel -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpLabel')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpLabel' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                🏷️ KlumpLabel
                <span class="text-xs">{{ openComponents.includes('KlumpLabel') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpLabel')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in labelStories"
                  :key="story.id"
                  @click="selectStory('KlumpLabel', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpCheckbox -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpCheckbox')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpCheckbox' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                ☑️ KlumpCheckbox
                <span class="text-xs">{{ openComponents.includes('KlumpCheckbox') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpCheckbox')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in checkboxStories"
                  :key="story.id"
                  @click="selectStory('KlumpCheckbox', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpCardLoader -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpCardLoader')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpCardLoader'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                ⏳ KlumpCardLoader
                <span class="text-xs">{{ openComponents.includes('KlumpCardLoader') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpCardLoader')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in cardLoaderStories"
                  :key="story.id"
                  @click="selectStory('KlumpCardLoader', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- Molecules Section -->
          <div class="mb-4">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Molecules</h3>

            <!-- ProductCard -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('ProductCard')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'ProductCard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                🛍️ ProductCard
                <span class="text-xs">{{ openComponents.includes('ProductCard') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('ProductCard')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in productCardStories"
                  :key="story.id"
                  @click="selectStory('ProductCard', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpSelect -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpSelect')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpSelect' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                📋 KlumpSelect
                <span class="text-xs">{{ openComponents.includes('KlumpSelect') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpSelect')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in selectStories"
                  :key="story.id"
                  @click="selectStory('KlumpSelect', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpPagination -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpPagination')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpPagination'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                📄 KlumpPagination
                <span class="text-xs">{{ openComponents.includes('KlumpPagination') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpPagination')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in paginationStories"
                  :key="story.id"
                  @click="selectStory('KlumpPagination', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- ProductQuantity -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('ProductQuantity')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'ProductQuantity'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                🔢 ProductQuantity
                <span class="text-xs">{{ openComponents.includes('ProductQuantity') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('ProductQuantity')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in productQuantityStories"
                  :key="story.id"
                  @click="selectStory('ProductQuantity', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpNotification -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpNotification')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpNotification'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                🔔 KlumpNotification
                <span class="text-xs">{{ openComponents.includes('KlumpNotification') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpNotification')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in notificationStories"
                  :key="story.id"
                  @click="selectStory('KlumpNotification', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- KlumpCarousel -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('KlumpCarousel')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors',
                  activeComponent === 'KlumpCarousel' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                ]"
              >
                🎠 KlumpCarousel
                <span class="text-xs">{{ openComponents.includes('KlumpCarousel') ? '−' : '+' }}</span>
              </button>

              <div
                v-if="openComponents.includes('KlumpCarousel')"
                class="ml-4 mt-1 space-y-1"
              >
                <button
                  v-for="story in carouselStories"
                  :key="story.id"
                  @click="selectStory('KlumpCarousel', story.id)"
                  :class="[
                    'w-full text-left px-2 py-1 rounded text-xs transition-colors',
                    activeStory === story.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  {{ story.name }}
                </button>
              </div>
            </div>

            <!-- ProductCartItem -->
            <div class="ml-2 mt-1">
              <button
                @click="toggleComponent('ProductCartItem')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm',
                  activeComponent === 'ProductCartItem'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                ProductCartItem
              </button>
              <button
                @click="toggleComponent('KlumpDrawer')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm',
                  activeComponent === 'KlumpDrawer'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                KlumpDrawer
              </button>
              <button
                @click="toggleComponent('KlumpLocationModal')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm',
                  activeComponent === 'KlumpLocationModal'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                KlumpLocationModal
              </button>
              <button
                @click="toggleComponent('KlumpMerchantAddress')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm',
                  activeComponent === 'KlumpMerchantAddress'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                KlumpMerchantAddress
              </button>
              <button
                @click="toggleComponent('ProductGallery')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm',
                  activeComponent === 'ProductGallery'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                ProductGallery
              </button>
              <button
                @click="toggleComponent('QuickCartModal')"
                :class="[
                  'w-full text-left px-3 py-2 rounded-md text-sm',
                  activeComponent === 'QuickCartModal'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                QuickCartModal
              </button>
            </div>
          </div>
        </nav>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200">
        <div class="text-xs text-gray-500">
          <div class="mb-1">✅ {{ totalStories }} Stories</div>
          <div>🎯 {{ totalComponents }} Components</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <div class="bg-white border-b border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ currentTitle }}</h2>
            <p class="text-sm text-gray-600">{{ currentDescription }}</p>
          </div>
          <div class="text-xs text-gray-500">Vue 3 + Composition API</div>
        </div>
      </div>

      <!-- Story Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Introduction -->
        <div
          v-if="activeComponent === 'introduction'"
          class="max-w-4xl"
        >
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Welcome to Klump Storybook</h3>
            <p class="text-gray-700 mb-4">
              This is a comprehensive testing environment for our Vue 3 migrated components. Navigate through the
              sidebar to explore individual components and their various prop configurations.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <h4 class="font-semibold text-gray-900 mb-2">✅ Atoms (7 components)</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>• KlumpButton (9 stories)</li>
                  <li>• KlumpImage (6 stories)</li>
                  <li>• KlumpHeading (6 stories)</li>
                  <li>• KlumpInput (6 stories)</li>
                  <li>• KlumpLabel (3 stories)</li>
                  <li>• KlumpCheckbox (4 stories)</li>
                  <li>• KlumpCardLoader (4 stories)</li>
                </ul>
              </div>
              <div class="bg-white rounded-lg p-4 border border-gray-200">
                <h4 class="font-semibold text-gray-900 mb-2">🧬 Molecules (12 components)</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>• ProductCard (3 stories)</li>
                  <li>• KlumpSelect (3 stories)</li>
                  <li>• KlumpPagination (3 stories)</li>
                  <li>• ProductQuantity (3 stories)</li>
                  <li>• KlumpNotification (3 stories)</li>
                  <li>• KlumpCarousel (3 stories)</li>
                  <li>• ProductCartItem (3 stories)</li>
                  <li>• KlumpDrawer (3 stories)</li>
                  <li>• KlumpLocationModal (2 stories)</li>
                  <li>• KlumpMerchantAddress (3 stories)</li>
                  <li>• ProductGallery (3 stories)</li>
                  <li>• QuickCartModal (2 stories)</li>
                </ul>
              </div>
            </div>
            <div class="mt-6 bg-white rounded-lg p-4 border border-gray-200">
              <h4 class="font-semibold text-gray-900 mb-2">🚀 Coming Soon</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Organism Components (Headers, Footers, etc.)</li>
                <li>• Template Components (Full Pages)</li>
                <li>• Advanced Interactive Features</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- KlumpButton Stories -->
        <div
          v-else-if="activeComponent === 'KlumpButton'"
          class="max-w-4xl"
        >
          <div v-if="selectedButtonStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedButtonStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedButtonStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedButtonStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border border-gray-200 rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <KlumpButton
                    v-bind="selectedButtonStory.props"
                    @clicked="handleButtonClick"
                  >
                    {{ selectedButtonStory.content || 'Button Text' }}
                  </KlumpButton>
                </div>

                <!-- Interactive Feedback -->
                <div
                  v-if="buttonClickCount > 0"
                  class="mt-4 text-sm text-green-600 text-center"
                >
                  Button clicked {{ buttonClickCount }} times!
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpButton {{ Object.entries(selectedButtonStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }}&gt;{{ selectedButtonStory.content || '' }}&lt;/KlumpButton&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpImage Stories -->
        <div
          v-else-if="activeComponent === 'KlumpImage'"
          class="max-w-4xl"
        >
          <div v-if="selectedImageStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedImageStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedImageStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedImageStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <div class="w-full max-w-md h-64">
                    <KlumpImage
                      v-bind="selectedImageStory.props"
                      @image-loaded="handleImageLoaded"
                    />
                  </div>
                </div>

                <!-- Interactive Feedback -->
                <div
                  v-if="imageLoadCount > 0"
                  class="mt-4 text-sm text-green-600 text-center"
                >
                  Image loaded {{ imageLoadCount }} times!
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpImage {{ Object.entries(selectedImageStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpHeading Stories -->
        <div
          v-else-if="activeComponent === 'KlumpHeading'"
          class="max-w-4xl"
        >
          <div v-if="selectedHeadingStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedHeadingStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedHeadingStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedHeadingStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <KlumpHeading v-bind="selectedHeadingStory.props">
                    {{ selectedHeadingStory.content || 'Heading Text' }}
                  </KlumpHeading>
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpHeading {{ Object.entries(selectedHeadingStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }}&gt;{{ selectedHeadingStory.content || '' }}&lt;/KlumpHeading&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpInput Stories -->
        <div
          v-else-if="activeComponent === 'KlumpInput'"
          class="max-w-4xl"
        >
          <div v-if="selectedInputStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedInputStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedInputStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedInputStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <div class="w-full max-w-md">
                    <KlumpInput
                      v-bind="selectedInputStory.props"
                      :value="inputValues[selectedInputStory.id] || ''"
                      @input="value => handleInputChange(selectedInputStory.id, value)"
                      @blur="() => handleInputBlur(selectedInputStory.id)"
                      @esc="() => handleInputEsc(selectedInputStory.id)"
                    />
                  </div>
                </div>

                <!-- Interactive Feedback -->
                <div
                  v-if="inputEvents[selectedInputStory.id] > 0"
                  class="mt-4 text-sm text-green-600 text-center"
                >
                  Input events: {{ inputEvents[selectedInputStory.id] }} | Current value: "{{
                    inputValues[selectedInputStory.id] || ''
                  }}"
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpInput {{ Object.entries(selectedInputStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpLabel Stories -->
        <div
          v-else-if="activeComponent === 'KlumpLabel'"
          class="max-w-4xl"
        >
          <div v-if="selectedLabelStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedLabelStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedLabelStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedLabelStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <KlumpLabel v-bind="selectedLabelStory.props" />
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpLabel {{ Object.entries(selectedLabelStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpCheckbox Stories -->
        <div
          v-else-if="activeComponent === 'KlumpCheckbox'"
          class="max-w-4xl"
        >
          <div v-if="selectedCheckboxStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedCheckboxStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedCheckboxStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedCheckboxStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{
                      Array.isArray(value)
                        ? '[' +
                          value.map(v => (typeof v === 'object' ? JSON.stringify(v) : '"' + v + '"')).join(', ') +
                          ']'
                        : typeof value === 'string'
                          ? '"' + value + '"'
                          : value
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <div class="w-full max-w-md">
                    <KlumpCheckbox
                      v-bind="selectedCheckboxStory.props"
                      :checked-items="
                        checkboxValues[selectedCheckboxStory.id] || selectedCheckboxStory.props.checkedItems || []
                      "
                      @change="value => handleCheckboxChange(selectedCheckboxStory.id, value)"
                    />
                  </div>
                </div>

                <!-- Interactive Feedback -->
                <div
                  v-if="checkboxValues[selectedCheckboxStory.id]?.length > 0"
                  class="mt-4 text-sm text-green-600 text-center"
                >
                  Selected: {{ checkboxValues[selectedCheckboxStory.id].join(', ') }}
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpCheckbox :items="[...]" {{ Object.entries(selectedCheckboxStory.props).filter(([key]) => key !== 'items').map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpCardLoader Stories -->
        <div
          v-else-if="activeComponent === 'KlumpCardLoader'"
          class="max-w-4xl"
        >
          <div v-if="selectedCardLoaderStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedCardLoaderStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedCardLoaderStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedCardLoaderStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-gray-50">
                <div class="w-full">
                  <KlumpCardLoader v-bind="selectedCardLoaderStory.props" />
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpCardLoader {{ Object.entries(selectedCardLoaderStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- ProductCard Stories -->
        <div
          v-else-if="activeComponent === 'ProductCard'"
          class="max-w-4xl"
        >
          <div v-if="selectedProductCardStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedProductCardStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedProductCardStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedProductCardStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <ProductCard v-bind="selectedProductCardStory.props" />
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;ProductCard {{ Object.entries(selectedProductCardStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpSelect Stories -->
        <div
          v-else-if="activeComponent === 'KlumpSelect'"
          class="max-w-4xl"
        >
          <div v-if="selectedSelectStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedSelectStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedSelectStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedSelectStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <KlumpSelect
                    v-bind="selectedSelectStory.props"
                    @change="value => handleSelectChange('KlumpSelect', value)"
                  />
                </div>

                <!-- Interactive Feedback -->
                <div
                  v-if="moleculeStates.selectValues['KlumpSelect']"
                  class="mt-4 text-sm text-green-600 text-center"
                >
                  Selected: {{ moleculeStates.selectValues['KlumpSelect'] }}
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpSelect {{ Object.entries(selectedSelectStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpPagination Stories -->
        <div
          v-else-if="activeComponent === 'KlumpPagination'"
          class="max-w-4xl"
        >
          <div v-if="selectedPaginationStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedPaginationStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedPaginationStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedPaginationStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <KlumpPagination
                    v-bind="selectedPaginationStory.props"
                    @pagination="handlePagination('KlumpPagination', $event)"
                  />
                </div>

                <!-- Interactive Feedback -->
                <div
                  v-if="moleculeStates.paginationPages['KlumpPagination']"
                  class="mt-4 text-sm text-green-600 text-center"
                >
                  Current Page: {{ moleculeStates.paginationPages['KlumpPagination'] }}
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpPagination {{ Object.entries(selectedPaginationStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- ProductQuantity Stories -->
        <div
          v-else-if="activeComponent === 'ProductQuantity'"
          class="max-w-4xl"
        >
          <div v-if="selectedProductQuantityStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedProductQuantityStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedProductQuantityStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedProductQuantityStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <ProductQuantity
                    v-bind="selectedProductQuantityStory.props"
                    @increment="handleQuantityIncrement('ProductQuantity')"
                    @decrement="handleQuantityDecrement('ProductQuantity')"
                  />
                </div>

                <!-- Interactive Feedback -->
                <div
                  v-if="moleculeStates.quantityValues['ProductQuantity']"
                  class="mt-4 text-sm text-green-600 text-center"
                >
                  Quantity: {{ moleculeStates.quantityValues['ProductQuantity'] }}
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;ProductQuantity {{ Object.entries(selectedProductQuantityStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpNotification Stories -->
        <div
          v-else-if="activeComponent === 'KlumpNotification'"
          class="max-w-4xl"
        >
          <div v-if="selectedNotificationStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedNotificationStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedNotificationStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedNotificationStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <KlumpNotification
                    v-bind="selectedNotificationStory.props"
                    @close="() => toggleNotification('KlumpNotification')"
                  />
                </div>

                <!-- Interactive Feedback -->
                <div
                  v-if="moleculeStates.notificationVisible['KlumpNotification']"
                  class="mt-4 text-sm text-green-600 text-center"
                >
                  Notification visible: {{ moleculeStates.notificationVisible['KlumpNotification'] }}
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpNotification {{ Object.entries(selectedNotificationStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpCarousel Stories -->
        <div
          v-else-if="activeComponent === 'KlumpCarousel'"
          class="max-w-4xl"
        >
          <div v-if="selectedCarouselStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedCarouselStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedCarouselStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedCarouselStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <KlumpCarousel
                    v-bind="selectedCarouselStory.props"
                    @slide="() => console.log('Slide event triggered')"
                  />
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpCarousel {{ Object.entries(selectedCarouselStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- ProductCartItem Stories -->
        <div
          v-else-if="activeComponent === 'ProductCartItem'"
          class="max-w-4xl"
        >
          <div v-if="selectedProductCartItemStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedProductCartItemStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedProductCartItemStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedProductCartItemStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <ProductCartItem v-bind="selectedProductCartItemStory.props" />
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;ProductCartItem {{ Object.entries(selectedProductCartItemStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpDrawer Stories -->
        <div
          v-else-if="activeComponent === 'KlumpDrawer'"
          class="max-w-4xl"
        >
          <div v-if="selectedDrawerStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedDrawerStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedDrawerStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedDrawerStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Interactive Controls -->
              <div class="mb-4">
                <button
                  @click="toggleDrawer(selectedDrawerStory.id)"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {{ moleculeStates.drawerVisible[selectedDrawerStory.id] ? 'Close' : 'Open' }} Drawer
                </button>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white relative overflow-hidden">
                <KlumpDrawer
                  v-bind="selectedDrawerStory.props"
                  :visible="moleculeStates.drawerVisible[selectedDrawerStory.id]"
                  @close="closeDrawer(selectedDrawerStory.id)"
                />
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpDrawer {{ Object.entries(selectedDrawerStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpLocationModal Stories -->
        <div
          v-else-if="activeComponent === 'KlumpLocationModal'"
          class="max-w-4xl"
        >
          <div v-if="selectedLocationModalStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedLocationModalStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedLocationModalStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedLocationModalStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Interactive Controls -->
              <div class="mb-4">
                <button
                  @click="toggleLocationModal(selectedLocationModalStory.id)"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {{ moleculeStates.locationModalVisible[selectedLocationModalStory.id] ? 'Close' : 'Open' }} Modal
                </button>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <KlumpLocationModal
                  v-bind="selectedLocationModalStory.props"
                  :visible="moleculeStates.locationModalVisible[selectedLocationModalStory.id]"
                  @close="toggleLocationModal(selectedLocationModalStory.id)"
                />
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpLocationModal {{ Object.entries(selectedLocationModalStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- KlumpMerchantAddress Stories -->
        <div
          v-else-if="activeComponent === 'KlumpMerchantAddress'"
          class="max-w-4xl"
        >
          <div v-if="selectedMerchantAddressStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedMerchantAddressStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedMerchantAddressStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedMerchantAddressStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <KlumpMerchantAddress v-bind="selectedMerchantAddressStory.props" />
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;KlumpMerchantAddress {{ Object.entries(selectedMerchantAddressStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- ProductGallery Stories -->
        <div
          v-else-if="activeComponent === 'ProductGallery'"
          class="max-w-4xl"
        >
          <div v-if="selectedProductGalleryStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedProductGalleryStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedProductGalleryStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedProductGalleryStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <div class="flex items-center justify-center min-h-32">
                  <ProductGallery v-bind="selectedProductGalleryStory.props" />
                </div>
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;ProductGallery {{ Object.entries(selectedProductGalleryStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- QuickCartModal Stories -->
        <div
          v-else-if="activeComponent === 'QuickCartModal'"
          class="max-w-4xl"
        >
          <div v-if="selectedQuickCartStory">
            <!-- Story Header -->
            <div class="bg-white rounded-lg border p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedQuickCartStory.name }}</h3>
              <p class="text-gray-600 mb-4">{{ selectedQuickCartStory.description }}</p>

              <!-- Props Display -->
              <div class="bg-gray-50 rounded p-4 mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Props:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(value, key) in selectedQuickCartStory.props"
                    :key="key"
                    class="text-xs"
                  >
                    <span class="font-mono text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700">{{ typeof value === 'string' ? '"' + value + '"' : value }}</span>
                  </div>
                </div>
              </div>

              <!-- Interactive Controls -->
              <div class="mb-4">
                <button
                  @click="toggleQuickCart(selectedQuickCartStory.id)"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {{ moleculeStates.quickCartVisible[selectedQuickCartStory.id] ? 'Close' : 'Open' }} Quick Cart
                </button>
              </div>

              <!-- Component Rendering -->
              <div class="border rounded-lg p-8 bg-white">
                <QuickCartModal
                  v-bind="selectedQuickCartStory.props"
                  :visible="moleculeStates.quickCartVisible[selectedQuickCartStory.id]"
                  @close="toggleQuickCart(selectedQuickCartStory.id)"
                />
              </div>

              <!-- Code Example -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Code:</h4>
                <pre
                  class="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto"
                ><code>&lt;QuickCartModal {{ Object.entries(selectedQuickCartStory.props).map(([key, value]) => 
                  key + '="' + value + '"'
                ).join(' ') }} /&gt;</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Explicit imports
import KlumpButton from '~/components/atoms/KlumpButton.vue'
import KlumpImage from '~/components/atoms/KlumpImage.vue'
import KlumpHeading from '~/components/atoms/KlumpHeading.vue'
import KlumpInput from '~/components/atoms/KlumpInput.vue'
import KlumpLabel from '~/components/atoms/KlumpLabel.vue'
import KlumpCheckbox from '~/components/atoms/KlumpCheckbox.vue'
import KlumpCardLoader from '~/components/atoms/KlumpCardLoader.vue'

// Molecule imports
import ProductCard from '~/components/molecules/ProductCard.vue'
import KlumpSelect from '~/components/molecules/KlumpSelect.vue'
import KlumpPagination from '~/components/molecules/KlumpPagination.vue'
import ProductQuantity from '~/components/molecules/ProductQuantity.vue'
import KlumpNotification from '~/components/molecules/KlumpNotification.vue'
import KlumpCarousel from '~/components/molecules/KlumpCarousel.vue'
import ProductCartItem from '~/components/molecules/ProductCartItem.vue'
import KlumpDrawer from '~/components/molecules/KlumpDrawer.vue'
import KlumpLocationModal from '~/components/molecules/KlumpLocationModal.vue'
import KlumpMerchantAddress from '~/components/molecules/KlumpMerchantAddress.vue'
import ProductGallery from '~/components/molecules/ProductGallery.vue'
import QuickCartModal from '~/components/molecules/QuickCartModal.vue'

// Navigation State
const activeComponent = ref('introduction')
const activeStory = ref(null)
const openComponents = ref([
  'KlumpButton',
  'KlumpImage',
  'KlumpHeading',
  'KlumpInput',
  'KlumpLabel',
  'KlumpCheckbox',
  'KlumpCardLoader',
  'ProductCard',
  'KlumpSelect',
  'KlumpPagination',
  'ProductQuantity',
  'KlumpNotification',
  'KlumpCarousel',
  'ProductCartItem',
  'KlumpDrawer',
  'KlumpLocationModal',
  'KlumpMerchantAddress',
  'ProductGallery',
  'QuickCartModal',
])

// Event tracking state
const buttonClickCount = ref(0)
const imageLoadCount = ref(0)
const inputValues = ref({})
const inputEvents = ref({})
const checkboxValues = ref({})
const moleculeStates = ref({
  selectValues: {},
  paginationPages: {},
  quantityValues: {},
  notificationVisible: {},
  carouselIndexes: {},
  drawerVisible: {},
  locationModalVisible: {},
  quickCartVisible: {},
})

// Event handlers
const handleButtonClick = () => {
  buttonClickCount.value++
}

const handleImageLoaded = () => {
  imageLoadCount.value++
}

const handleInputChange = (storyId, value) => {
  inputValues.value[storyId] = value
  inputEvents.value[storyId] = (inputEvents.value[storyId] || 0) + 1
}

const handleInputBlur = storyId => {
  // Input blur handled
}

const handleInputEsc = storyId => {
  // Input escape handled
}

const handleCheckboxChange = (storyId, value) => {
  if (!checkboxValues.value[storyId]) {
    checkboxValues.value[storyId] = []
  }
  const index = checkboxValues.value[storyId].indexOf(value)
  if (index > -1) {
    checkboxValues.value[storyId].splice(index, 1)
  } else {
    checkboxValues.value[storyId].push(value)
  }
}

// Molecule event handlers
const handleSelectChange = (storyId, value) => {
  moleculeStates.value.selectValues[storyId] = value
}

const handlePagination = (storyId, payload) => {
  const currentPage = moleculeStates.value.paginationPages[storyId] || 1
  let newPage = currentPage

  if (payload.direction === 'forward') {
    newPage = payload.jump ? currentPage + payload.jump : currentPage + 1
  } else if (payload.direction === 'back') {
    newPage = payload.jump ? currentPage - payload.jump : currentPage - 1
  }

  moleculeStates.value.paginationPages[storyId] = Math.max(1, Math.min(newPage, 10)) // Max 10 pages for demo
}

const handleQuantityIncrement = storyId => {
  if (!moleculeStates.value.quantityValues[storyId]) {
    moleculeStates.value.quantityValues[storyId] = 1
  }
  moleculeStates.value.quantityValues[storyId]++
}

const handleQuantityDecrement = storyId => {
  if (!moleculeStates.value.quantityValues[storyId]) {
    moleculeStates.value.quantityValues[storyId] = 1
  }
  if (moleculeStates.value.quantityValues[storyId] > 1) {
    moleculeStates.value.quantityValues[storyId]--
  }
}

const toggleNotification = storyId => {
  moleculeStates.value.notificationVisible[storyId] = !moleculeStates.value.notificationVisible[storyId]
}

const toggleDrawer = storyId => {
  moleculeStates.value.drawerVisible[storyId] = !moleculeStates.value.drawerVisible[storyId]
}

const closeDrawer = storyId => {
  moleculeStates.value.drawerVisible[storyId] = false
}

const toggleLocationModal = storyId => {
  moleculeStates.value.locationModalVisible[storyId] = !moleculeStates.value.locationModalVisible[storyId]
}

const toggleQuickCart = storyId => {
  moleculeStates.value.quickCartVisible[storyId] = !moleculeStates.value.quickCartVisible[storyId]
}

// Button Stories
const buttonStories = [
  {
    id: 'primary',
    name: 'Primary Button',
    description: 'The default primary button style',
    props: { type: 'primary' },
    content: 'Primary Button',
  },
  {
    id: 'secondary',
    name: 'Secondary Button',
    description: 'Secondary button with border styling',
    props: { type: 'secondary' },
    content: 'Secondary Button',
  },
  {
    id: 'disabled',
    name: 'Disabled State',
    description: 'Button in disabled state',
    props: { type: 'primary', disabled: true },
    content: 'Disabled Button',
  },
  {
    id: 'with-title',
    name: 'With Title',
    description: 'Button with accessibility title',
    props: { type: 'primary', title: 'This is a tooltip' },
    content: 'Hover for Title',
  },
  {
    id: 'font-weights',
    name: 'Font Weights',
    description: 'Different font weight options',
    props: { type: 'primary', weight: 'extrabold' },
    content: 'Extra Bold Button',
  },
  {
    id: 'rounded',
    name: 'Border Radius',
    description: 'Button with all corners rounded',
    props: { type: 'primary', radius: 'all' },
    content: 'Rounded Button',
  },
  {
    id: 'as-link',
    name: 'As Link',
    description: 'Button rendered as a link',
    props: { type: 'primary', href: '/', target: '_self' },
    content: 'Link Button',
  },
  {
    id: 'custom-styles',
    name: 'Custom Styles',
    description: 'Button with override styles',
    props: {
      overrideStyles: 'bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors',
    },
    content: 'Custom Purple',
  },
  {
    id: 'external-link',
    name: 'External Link',
    description: 'Button as external link',
    props: { type: 'secondary', href: 'https://klump.co', target: '_blank' },
    content: 'External Link',
  },
]

// Image Stories
const imageStories = [
  {
    id: 'basic',
    name: 'Basic Image',
    description: 'Simple image with alt text',
    props: {
      url: 'https://picsum.photos/400/300?random=1',
      'alt-text': 'Beautiful landscape',
    },
  },
  {
    id: 'object-fit-cover',
    name: 'Object Fit: Cover',
    description: 'Image with cover object-fit',
    props: {
      url: 'https://picsum.photos/800/400?random=2',
      'alt-text': 'Cover fit example',
      'object-fit': 'cover',
    },
  },
  {
    id: 'object-fit-contain',
    name: 'Object Fit: Contain',
    description: 'Image with contain object-fit',
    props: {
      url: 'https://picsum.photos/800/400?random=3',
      'alt-text': 'Contain fit example',
      'object-fit': 'contain',
    },
  },
  {
    id: 'rounded-all',
    name: 'Rounded Corners',
    description: 'Image with all corners rounded',
    props: {
      url: 'https://picsum.photos/300/300?random=4',
      'alt-text': 'Rounded image',
      radius: 'all',
    },
  },
  {
    id: 'rounded-top',
    name: 'Rounded Top',
    description: 'Image with top corners rounded',
    props: {
      url: 'https://picsum.photos/300/300?random=5',
      'alt-text': 'Top rounded image',
      radius: 'top',
    },
  },
  {
    id: 'error-handling',
    name: 'Error Handling',
    description: 'Broken image URL for testing',
    props: {
      url: 'https://invalid-url-for-testing.jpg',
      'alt-text': 'Broken image',
    },
  },
]

// Heading Stories
const headingStories = [
  {
    id: 'basic',
    name: 'Basic Heading',
    description: 'Default heading with basic styling',
    props: { type: 'xxLarge', textSize: 'large', color: 'black', weight: 'bold' },
    content: 'Hello World Heading',
  },
  {
    id: 'sizes',
    name: 'Different Sizes',
    description: 'Heading with different text sizes',
    props: { type: 'xLarge', textSize: 'xxxLarge', color: 'black', weight: 'bold' },
    content: 'Extra Large Heading',
  },
  {
    id: 'colors',
    name: 'Primary Color',
    description: 'Heading with primary brand color',
    props: { type: 'large', textSize: 'xxLarge', color: 'primary', weight: 'bold' },
    content: 'Primary Color Heading',
  },
  {
    id: 'weights',
    name: 'Font Weights',
    description: 'Different font weight options',
    props: { type: 'base', textSize: 'xLarge', color: 'black', weight: 'extrabold' },
    content: 'Extra Bold Heading',
  },
  {
    id: 'transform',
    name: 'Text Transform',
    description: 'Uppercase text transformation',
    props: { type: 'small', textSize: 'large', color: 'black', weight: 'bold', transformText: 'uppercase' },
    content: 'uppercase heading',
  },
  {
    id: 'custom',
    name: 'Custom Styles',
    description: 'Heading with custom override styles',
    props: { overrideStyles: 'text-purple-600 text-3xl font-black italic' },
    content: 'Custom Styled Heading',
  },
]

// Input Stories
const inputStories = [
  {
    id: 'basic',
    name: 'Basic Input',
    description: 'Simple text input with placeholder',
    props: { type: 'text', placeholder: 'Enter your name...', label: 'Name Input' },
  },
  {
    id: 'email',
    name: 'Email Input',
    description: 'Email input type with validation',
    props: { type: 'email', placeholder: 'Enter your email...', label: 'Email Input' },
  },
  {
    id: 'password',
    name: 'Password Input',
    description: 'Password input with hidden text',
    props: { type: 'password', placeholder: 'Enter password...', label: 'Password Input' },
  },
  {
    id: 'with-error',
    name: 'With Error',
    description: 'Input displaying error message',
    props: { type: 'text', placeholder: 'Enter text...', error: 'This field is required', label: 'Error Input' },
  },
  {
    id: 'disabled',
    name: 'Disabled State',
    description: 'Input in disabled state',
    props: { type: 'text', placeholder: 'Disabled input...', disabled: true, label: 'Disabled Input' },
  },
  {
    id: 'search',
    name: 'Search Input',
    description: 'Search type input',
    props: { type: 'search', placeholder: 'Search products...', label: 'Search Input' },
  },
]

// Label Stories
const labelStories = [
  {
    id: 'basic',
    name: 'Basic Label',
    description: 'Simple label with default styling',
    props: { text: 'Form Label', id: 'basic-input' },
  },
  {
    id: 'custom',
    name: 'Custom Styles',
    description: 'Label with custom override styles',
    props: { text: 'Custom Label', overrideStyles: 'text-purple-600 text-lg font-extrabold' },
  },
  {
    id: 'dark-theme',
    name: 'Dark Theme',
    description: 'Label with dark theme support',
    props: { text: 'Dark Theme Label', allowDarkTheme: true },
  },
]

// Checkbox Stories
const checkboxStories = [
  {
    id: 'basic',
    name: 'Basic Checkbox',
    description: 'Simple checkbox group with primary theme',
    props: {
      items: [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }],
      theme: 'primary',
    },
  },
  {
    id: 'secondary',
    name: 'Secondary Theme',
    description: 'Checkbox group with secondary theme',
    props: {
      items: [{ name: 'Apple' }, { name: 'Orange' }, { name: 'Banana' }],
      theme: 'secondary',
    },
  },
  {
    id: 'with-label',
    name: 'With Label',
    description: 'Checkbox group with custom label',
    props: {
      items: [{ name: 'Small' }, { name: 'Medium' }, { name: 'Large' }],
      label: 'Select Size:',
      theme: 'primary',
    },
  },
  {
    id: 'pre-checked',
    name: 'Pre-checked Items',
    description: 'Checkbox with some items pre-selected',
    props: {
      items: [{ name: 'Red' }, { name: 'Blue' }, { name: 'Green' }],
      checkedItems: ['Red', 'Blue'],
      theme: 'primary',
    },
  },
]

// Card Loader Stories
const cardLoaderStories = [
  {
    id: 'few-cards',
    name: 'Few Cards',
    description: 'Loader with just 3 cards',
    props: { numbersOfCards: 3 },
  },
  {
    id: 'medium-cards',
    name: 'Medium Cards',
    description: 'Loader with 6 cards',
    props: { numbersOfCards: 6 },
  },
  {
    id: 'many-cards',
    name: 'Many Cards',
    description: 'Loader with 8 cards',
    props: { numbersOfCards: 8 },
  },
  {
    id: 'lots-cards',
    name: 'Lots of Cards',
    description: 'Loader with 12 cards for testing',
    props: { numbersOfCards: 12 },
  },
]

// Molecule Stories
// ProductCard Stories
const productCardStories = [
  {
    id: 'basic',
    name: 'Basic Product Card',
    description: 'Standard product card with all details',
    props: {
      product: {
        url: '/p/sample-product',
        image: {
          url: 'https://picsum.photos/400/400?random=10',
          altText: 'Sample Product',
        },
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
        price: 15000000, // Price in kobo (₦150,000)
      },
    },
  },
  {
    id: 'expensive',
    name: 'Expensive Product',
    description: 'Product card with higher price point',
    props: {
      product: {
        url: '/p/luxury-item',
        image: {
          url: 'https://picsum.photos/400/400?random=11',
          altText: 'Luxury Item',
        },
        name: 'Luxury Smart Watch',
        description: 'Premium smartwatch with advanced health monitoring and luxury design.',
        price: 50000000, // ₦500,000
      },
    },
  },
  {
    id: 'long-text',
    name: 'Long Description',
    description: 'Product with very long description to test text truncation',
    props: {
      product: {
        url: '/p/detailed-product',
        image: {
          url: 'https://picsum.photos/400/400?random=12',
          altText: 'Detailed Product',
        },
        name: 'Professional Ultra-High Definition 4K Camera with Advanced Stabilization',
        description:
          'This is a very long description that tests how the product card handles extensive text content. It includes multiple features, specifications, and detailed information about the product that might overflow the container.',
        price: 25000000, // ₦250,000
      },
    },
  },
]

// KlumpSelect Stories
const selectStories = [
  {
    id: 'basic',
    name: 'Basic Select',
    description: 'Simple dropdown with basic options',
    props: {
      items: [
        { name: 'Price: Low to High', value: 'price_asc' },
        { name: 'Price: High to Low', value: 'price_desc' },
        { name: 'Newest First', value: 'date_desc' },
        { name: 'Most Popular', value: 'popularity' },
      ],
      label: 'Sort by',
      type: 'sort',
    },
  },
  {
    id: 'with-default',
    name: 'With Default Option',
    description: 'Select dropdown with default "All" option',
    props: {
      items: [
        { name: 'Electronics', value: 'electronics' },
        { name: 'Clothing', value: 'clothing' },
        { name: 'Books', value: 'books' },
        { name: 'Home & Garden', value: 'home' },
      ],
      label: 'Category',
      type: 'filter',
      allowDefaultOption: true,
    },
  },
  {
    id: 'radius-styles',
    name: 'Different Radius',
    description: 'Select with different border radius styles',
    props: {
      items: [
        { name: 'Option A', value: 'a' },
        { name: 'Option B', value: 'b' },
        { name: 'Option C', value: 'c' },
      ],
      label: 'Choose Option',
      radius: 'normal',
      radiusSide: 'both',
    },
  },
]

// KlumpPagination Stories
const paginationStories = [
  {
    id: 'basic',
    name: 'Basic Pagination',
    description: 'Simple pagination with few pages',
    props: {
      page: 1,
      numPages: 5,
    },
  },
  {
    id: 'many-pages',
    name: 'Many Pages',
    description: 'Pagination with many pages showing ellipsis',
    props: {
      page: 5,
      numPages: 20,
    },
  },
  {
    id: 'middle-page',
    name: 'Middle Page',
    description: 'Current page in the middle of pagination',
    props: {
      page: 7,
      numPages: 15,
    },
  },
]

// ProductQuantity Stories
const productQuantityStories = [
  {
    id: 'basic',
    name: 'Basic Quantity',
    description: 'Simple quantity selector starting at 1',
    props: {
      value: 1,
    },
  },
  {
    id: 'higher-value',
    name: 'Higher Quantity',
    description: 'Quantity selector with higher starting value',
    props: {
      value: 5,
    },
  },
  {
    id: 'max-value',
    name: 'High Quantity',
    description: 'Quantity selector with high value for testing',
    props: {
      value: 25,
    },
  },
]

// KlumpNotification Stories
const notificationStories = [
  {
    id: 'error',
    name: 'Error Notification',
    description: 'Error notification with red styling',
    props: {
      message: 'Something went wrong! Please try again.',
      visible: false,
      type: 'error',
    },
  },
  {
    id: 'success',
    name: 'Success Notification',
    description: 'Success notification with primary color',
    props: {
      message: 'Your action was completed successfully!',
      visible: false,
      type: 'success',
    },
  },
  {
    id: 'long-message',
    name: 'Long Message',
    description: 'Notification with longer message text',
    props: {
      message:
        'This is a longer notification message that tests how the component handles extended text content and word wrapping.',
      visible: false,
      type: 'error',
    },
  },
]

// KlumpCarousel Stories
const carouselStories = [
  {
    id: 'basic',
    name: 'Basic Carousel',
    description: 'Simple carousel with autoplay enabled',
    props: {
      autoplay: true,
      interval: 3000,
      images: [
        { url: 'https://picsum.photos/800/400?random=20' },
        { url: 'https://picsum.photos/800/400?random=21' },
        { url: 'https://picsum.photos/800/400?random=22' },
      ],
    },
  },
  {
    id: 'no-autoplay',
    name: 'Manual Carousel',
    description: 'Carousel without autoplay for manual control',
    props: {
      autoplay: false,
      images: [
        { url: 'https://picsum.photos/800/400?random=23' },
        { url: 'https://picsum.photos/800/400?random=24' },
        { url: 'https://picsum.photos/800/400?random=25' },
        { url: 'https://picsum.photos/800/400?random=26' },
      ],
    },
  },
  {
    id: 'fast-interval',
    name: 'Fast Carousel',
    description: 'Carousel with faster transition interval',
    props: {
      autoplay: true,
      interval: 1500,
      images: [
        { url: 'https://picsum.photos/800/400?random=27' },
        { url: 'https://picsum.photos/800/400?random=28' },
        { url: 'https://picsum.photos/800/400?random=29' },
      ],
    },
  },
]

// ProductCartItem Stories
const productCartItemStories = [
  {
    id: 'basic',
    name: 'Basic Cart Item',
    description: 'Standard cart item with product details',
    props: {
      product: {
        image_url: 'https://picsum.photos/100/100?random=30',
        name: 'Wireless Bluetooth Speaker',
        slug: 'bluetooth-speaker',
        price: 7500000, // ₦75,000
        merchant: {
          business_name: 'Tech Store Nigeria',
          slug: 'tech-store',
        },
        quantity: 2,
        limit: 10,
        product_id: 'prod_001',
      },
    },
  },
  {
    id: 'high-quantity',
    name: 'High Quantity Item',
    description: 'Cart item with higher quantity',
    props: {
      product: {
        image_url: 'https://picsum.photos/100/100?random=31',
        name: 'Premium Coffee Beans (1kg)',
        slug: 'coffee-beans',
        price: 5000000, // ₦50,000
        merchant: {
          business_name: 'Coffee Paradise',
          slug: 'coffee-paradise',
        },
        quantity: 8,
        limit: 20,
        product_id: 'prod_002',
      },
    },
  },
  {
    id: 'long-name',
    name: 'Long Product Name',
    description: 'Cart item with very long product name',
    props: {
      product: {
        image_url: 'https://picsum.photos/100/100?random=32',
        name: 'Professional Ultra-High Definition 4K Camera with Advanced Stabilization',
        slug: 'professional-camera',
        price: 45000000, // ₦450,000
        merchant: {
          business_name: 'Photography Equipment Store',
          slug: 'photo-equipment',
        },
        quantity: 1,
        limit: 5,
        product_id: 'prod_003',
      },
    },
  },
]

// KlumpDrawer Stories
const drawerStories = [
  {
    id: 'right',
    name: 'Right Drawer',
    description: 'Drawer sliding from the right side',
    props: {
      visible: false,
      title: 'Shopping Cart',
      position: 'right',
      confirmText: 'Checkout',
      closeText: 'Close',
    },
  },
  {
    id: 'left',
    name: 'Left Drawer',
    description: 'Drawer sliding from the left side',
    props: {
      visible: false,
      title: 'Navigation Menu',
      position: 'left',
      confirmText: 'Continue',
      closeText: 'Close',
    },
  },
  {
    id: 'bottom',
    name: 'Bottom Drawer',
    description: 'Drawer sliding from the bottom',
    props: {
      visible: false,
      title: 'Options',
      position: 'bottom',
      confirmText: 'Save',
      closeText: 'Cancel',
    },
  },
]

// KlumpLocationModal Stories
const locationModalStories = [
  {
    id: 'basic',
    name: 'Location Selection',
    description: 'Modal for selecting user location (state and city)',
    props: {
      visible: false,
    },
  },
  {
    id: 'open',
    name: 'Open Modal',
    description: 'Location modal in open state',
    props: {
      visible: true,
    },
  },
]

// KlumpMerchantAddress Stories
const merchantAddressStories = [
  {
    id: 'basic',
    name: 'Basic Merchant Address',
    description: 'Standard merchant address display',
    props: {
      merchant: {
        business_name: 'Tech Store Nigeria',
        address: '123 Ikeja Plaza, Computer Village',
        city: 'Lagos',
        state: 'Lagos State',
        phone: '+234 901 234 5678',
      },
    },
  },
  {
    id: 'long-address',
    name: 'Long Address',
    description: 'Merchant with longer address details',
    props: {
      merchant: {
        business_name: 'Premium Electronics & Gadgets Emporium',
        address: 'Suite 45-47, 3rd Floor, Mega Plaza Shopping Complex, Victoria Island',
        city: 'Lagos',
        state: 'Lagos State',
        phone: '+234 802 345 6789',
      },
    },
  },
  {
    id: 'different-state',
    name: 'Different State',
    description: 'Merchant from different Nigerian state',
    props: {
      merchant: {
        business_name: 'Abuja Tech Hub',
        address: 'Plot 123, Central Business District',
        city: 'Abuja',
        state: 'Federal Capital Territory',
        phone: '+234 903 456 7890',
      },
    },
  },
]

// ProductGallery Stories
const productGalleryStories = [
  {
    id: 'column-mode',
    name: 'Column Gallery',
    description: 'Gallery in column layout mode',
    props: {
      mode: 'column',
      images: [
        { url: 'https://picsum.photos/600/600?random=40', id: 'main-view' },
        { url: 'https://picsum.photos/600/600?random=41', id: 'side-view' },
        { url: 'https://picsum.photos/600/600?random=42', id: 'top-view' },
        { url: 'https://picsum.photos/600/600?random=43', id: 'detail-view' },
      ],
    },
  },
  {
    id: 'row-mode',
    name: 'Row Gallery',
    description: 'Gallery in row layout mode',
    props: {
      mode: 'row',
      images: [
        { url: 'https://picsum.photos/600/600?random=44', id: 'front' },
        { url: 'https://picsum.photos/600/600?random=45', id: 'back' },
        { url: 'https://picsum.photos/600/600?random=46', id: 'side' },
      ],
    },
  },
  {
    id: 'many-images',
    name: 'Many Images',
    description: 'Gallery with multiple product images',
    props: {
      mode: 'column',
      images: [
        { url: 'https://picsum.photos/600/600?random=47', id: 'img1' },
        { url: 'https://picsum.photos/600/600?random=48', id: 'img2' },
        { url: 'https://picsum.photos/600/600?random=49', id: 'img3' },
        { url: 'https://picsum.photos/600/600?random=50', id: 'img4' },
        { url: 'https://picsum.photos/600/600?random=51', id: 'img5' },
        { url: 'https://picsum.photos/600/600?random=52', id: 'img6' },
      ],
    },
  },
]

// QuickCartModal Stories
const quickCartStories = [
  {
    id: 'basic',
    name: 'Basic Quick Cart',
    description: 'Quick add to cart modal with product details',
    props: {
      selectedProduct: {
        id: 'prod_001',
        name: 'Wireless Bluetooth Headphones',
        slug: 'bluetooth-headphones',
        price: 25000,
        quantity: 15,
        discount: 0,
        summary: 'High-quality wireless headphones with noise cancellation',
        preview_image: 'https://picsum.photos/400/400?random=60',
        merchant: {
          business_name: 'Audio Store',
          slug: 'audio-store',
        },
        gallery: [
          { url: 'https://picsum.photos/600/600?random=61' },
          { url: 'https://picsum.photos/600/600?random=62' },
          { url: 'https://picsum.photos/600/600?random=63' },
        ],
        shippingData: {
          'Lagos State': [
            { city: 'Lagos', fee: 2000 },
            { city: 'Ikeja', fee: 1500 },
          ],
        },
      },
    },
  },
  {
    id: 'expensive-product',
    name: 'Expensive Product',
    description: 'Quick cart for high-value product',
    props: {
      selectedProduct: {
        id: 'prod_002',
        name: 'Professional 4K Camera',
        slug: 'professional-camera',
        price: 150000,
        quantity: 5,
        discount: 10000,
        old_price: 160000,
        summary: 'Professional grade camera for photography enthusiasts',
        preview_image: 'https://picsum.photos/400/400?random=64',
        merchant: {
          business_name: 'Camera World',
          slug: 'camera-world',
        },
        gallery: [
          { url: 'https://picsum.photos/600/600?random=65' },
          { url: 'https://picsum.photos/600/600?random=66' },
        ],
        shippingData: {
          'Lagos State': [
            { city: 'Lagos', fee: 5000 },
            { city: 'Victoria Island', fee: 3000 },
          ],
          Abuja: [{ city: 'Central Area', fee: 8000 }],
        },
      },
    },
  },
]

// Computed properties
const selectedButtonStory = computed(() => buttonStories.find(story => story.id === activeStory.value))

const selectedImageStory = computed(() => imageStories.find(story => story.id === activeStory.value))

const selectedHeadingStory = computed(() => headingStories.find(story => story.id === activeStory.value))

const selectedInputStory = computed(() => inputStories.find(story => story.id === activeStory.value))

const selectedLabelStory = computed(() => labelStories.find(story => story.id === activeStory.value))

const selectedCheckboxStory = computed(() => checkboxStories.find(story => story.id === activeStory.value))

const selectedCardLoaderStory = computed(() => cardLoaderStories.find(story => story.id === activeStory.value))

const selectedProductCardStory = computed(() => productCardStories.find(story => story.id === activeStory.value))

const selectedSelectStory = computed(() => selectStories.find(story => story.id === activeStory.value))

const selectedPaginationStory = computed(() => paginationStories.find(story => story.id === activeStory.value))

const selectedProductQuantityStory = computed(() =>
  productQuantityStories.find(story => story.id === activeStory.value)
)

const selectedNotificationStory = computed(() => notificationStories.find(story => story.id === activeStory.value))

const selectedCarouselStory = computed(() => carouselStories.find(story => story.id === activeStory.value))

const selectedProductCartItemStory = computed(() =>
  productCartItemStories.find(story => story.id === activeStory.value)
)

const selectedDrawerStory = computed(() => drawerStories.find(story => story.id === activeStory.value))

const selectedLocationModalStory = computed(() => locationModalStories.find(story => story.id === activeStory.value))

const selectedMerchantAddressStory = computed(() =>
  merchantAddressStories.find(story => story.id === activeStory.value)
)

const selectedProductGalleryStory = computed(() => productGalleryStories.find(story => story.id === activeStory.value))

const selectedQuickCartStory = computed(() => quickCartStories.find(story => story.id === activeStory.value))

const currentTitle = computed(() => {
  if (activeComponent.value === 'introduction') return 'Introduction'
  if (activeComponent.value === 'KlumpButton' && selectedButtonStory.value) {
    return `KlumpButton - ${selectedButtonStory.value.name}`
  }
  if (activeComponent.value === 'KlumpImage' && selectedImageStory.value) {
    return `KlumpImage - ${selectedImageStory.value.name}`
  }
  if (activeComponent.value === 'KlumpHeading' && selectedHeadingStory.value) {
    return `KlumpHeading - ${selectedHeadingStory.value.name}`
  }
  if (activeComponent.value === 'KlumpInput' && selectedInputStory.value) {
    return `KlumpInput - ${selectedInputStory.value.name}`
  }
  if (activeComponent.value === 'KlumpLabel' && selectedLabelStory.value) {
    return `KlumpLabel - ${selectedLabelStory.value.name}`
  }
  if (activeComponent.value === 'KlumpCheckbox' && selectedCheckboxStory.value) {
    return `KlumpCheckbox - ${selectedCheckboxStory.value.name}`
  }
  if (activeComponent.value === 'KlumpCardLoader' && selectedCardLoaderStory.value) {
    return `KlumpCardLoader - ${selectedCardLoaderStory.value.name}`
  }
  if (activeComponent.value === 'ProductCard' && selectedProductCardStory.value) {
    return `ProductCard - ${selectedProductCardStory.value.name}`
  }
  if (activeComponent.value === 'KlumpSelect' && selectedSelectStory.value) {
    return `KlumpSelect - ${selectedSelectStory.value.name}`
  }
  if (activeComponent.value === 'KlumpPagination' && selectedPaginationStory.value) {
    return `KlumpPagination - ${selectedPaginationStory.value.name}`
  }
  if (activeComponent.value === 'ProductQuantity' && selectedProductQuantityStory.value) {
    return `ProductQuantity - ${selectedProductQuantityStory.value.name}`
  }
  if (activeComponent.value === 'KlumpNotification' && selectedNotificationStory.value) {
    return `KlumpNotification - ${selectedNotificationStory.value.name}`
  }
  if (activeComponent.value === 'KlumpCarousel' && selectedCarouselStory.value) {
    return `KlumpCarousel - ${selectedCarouselStory.value.name}`
  }
  if (activeComponent.value === 'ProductCartItem' && selectedProductCartItemStory.value) {
    return `ProductCartItem - ${selectedProductCartItemStory.value.name}`
  }
  if (activeComponent.value === 'KlumpDrawer' && selectedDrawerStory.value) {
    return `KlumpDrawer - ${selectedDrawerStory.value.name}`
  }
  if (activeComponent.value === 'KlumpLocationModal' && selectedLocationModalStory.value) {
    return `KlumpLocationModal - ${selectedLocationModalStory.value.name}`
  }
  if (activeComponent.value === 'KlumpMerchantAddress' && selectedMerchantAddressStory.value) {
    return `KlumpMerchantAddress - ${selectedMerchantAddressStory.value.name}`
  }
  if (activeComponent.value === 'ProductGallery' && selectedProductGalleryStory.value) {
    return `ProductGallery - ${selectedProductGalleryStory.value.name}`
  }
  if (activeComponent.value === 'QuickCartModal' && selectedQuickCartStory.value) {
    return `QuickCartModal - ${selectedQuickCartStory.value.name}`
  }
  return activeComponent.value
})

const currentDescription = computed(() => {
  if (activeComponent.value === 'introduction') return 'Welcome to the component testing environment'
  if (activeComponent.value === 'KlumpButton' && selectedButtonStory.value) {
    return selectedButtonStory.value.description
  }
  if (activeComponent.value === 'KlumpImage' && selectedImageStory.value) {
    return selectedImageStory.value.description
  }
  if (activeComponent.value === 'KlumpHeading' && selectedHeadingStory.value) {
    return selectedHeadingStory.value.description
  }
  if (activeComponent.value === 'KlumpInput' && selectedInputStory.value) {
    return selectedInputStory.value.description
  }
  if (activeComponent.value === 'KlumpLabel' && selectedLabelStory.value) {
    return selectedLabelStory.value.description
  }
  if (activeComponent.value === 'KlumpCheckbox' && selectedCheckboxStory.value) {
    return selectedCheckboxStory.value.description
  }
  if (activeComponent.value === 'KlumpCardLoader' && selectedCardLoaderStory.value) {
    return selectedCardLoaderStory.value.description
  }
  if (activeComponent.value === 'ProductCard' && selectedProductCardStory.value) {
    return selectedProductCardStory.value.description
  }
  if (activeComponent.value === 'KlumpSelect' && selectedSelectStory.value) {
    return selectedSelectStory.value.description
  }
  if (activeComponent.value === 'KlumpPagination' && selectedPaginationStory.value) {
    return selectedPaginationStory.value.description
  }
  if (activeComponent.value === 'ProductQuantity' && selectedProductQuantityStory.value) {
    return selectedProductQuantityStory.value.description
  }
  if (activeComponent.value === 'KlumpNotification' && selectedNotificationStory.value) {
    return selectedNotificationStory.value.description
  }
  if (activeComponent.value === 'KlumpCarousel' && selectedCarouselStory.value) {
    return selectedCarouselStory.value.description
  }
  if (activeComponent.value === 'ProductCartItem' && selectedProductCartItemStory.value) {
    return selectedProductCartItemStory.value.description
  }
  if (activeComponent.value === 'KlumpDrawer' && selectedDrawerStory.value) {
    return selectedDrawerStory.value.description
  }
  if (activeComponent.value === 'KlumpLocationModal' && selectedLocationModalStory.value) {
    return selectedLocationModalStory.value.description
  }
  if (activeComponent.value === 'KlumpMerchantAddress' && selectedMerchantAddressStory.value) {
    return selectedMerchantAddressStory.value.description
  }
  if (activeComponent.value === 'ProductGallery' && selectedProductGalleryStory.value) {
    return selectedProductGalleryStory.value.description
  }
  if (activeComponent.value === 'QuickCartModal' && selectedQuickCartStory.value) {
    return selectedQuickCartStory.value.description
  }
  return 'Component testing'
})

const totalStories = computed(
  () =>
    buttonStories.length +
    imageStories.length +
    headingStories.length +
    inputStories.length +
    labelStories.length +
    checkboxStories.length +
    cardLoaderStories.length +
    productCardStories.length +
    selectStories.length +
    paginationStories.length +
    productQuantityStories.length +
    notificationStories.length +
    carouselStories.length +
    productCartItemStories.length +
    drawerStories.length +
    locationModalStories.length +
    merchantAddressStories.length +
    productGalleryStories.length +
    quickCartStories.length
)
const totalComponents = computed(() => 19) // 7 atoms + 12 molecules

// Methods
const selectStory = (component, storyId) => {
  activeComponent.value = component
  activeStory.value = storyId

  // Auto-open the component if selecting a story
  if (component !== 'introduction' && !openComponents.value.includes(component)) {
    openComponents.value.push(component)
  }
}

const toggleComponent = component => {
  const index = openComponents.value.indexOf(component)
  if (index > -1) {
    openComponents.value.splice(index, 1)
  } else {
    openComponents.value.push(component)
  }

  // If component is being opened, select it
  if (openComponents.value.includes(component)) {
    activeComponent.value = component
    // Select first story of the component
    if (component === 'KlumpButton') {
      activeStory.value = buttonStories[0].id
    } else if (component === 'KlumpImage') {
      activeStory.value = imageStories[0].id
    } else if (component === 'KlumpHeading') {
      activeStory.value = headingStories[0].id
    } else if (component === 'KlumpInput') {
      activeStory.value = inputStories[0].id
    } else if (component === 'KlumpLabel') {
      activeStory.value = labelStories[0].id
    } else if (component === 'KlumpCheckbox') {
      activeStory.value = checkboxStories[0].id
    } else if (component === 'KlumpCardLoader') {
      activeStory.value = cardLoaderStories[0].id
    } else if (component === 'ProductCard') {
      activeStory.value = productCardStories[0].id
    } else if (component === 'KlumpSelect') {
      activeStory.value = selectStories[0].id
    } else if (component === 'KlumpPagination') {
      activeStory.value = paginationStories[0].id
    } else if (component === 'ProductQuantity') {
      activeStory.value = productQuantityStories[0].id
    } else if (component === 'KlumpNotification') {
      activeStory.value = notificationStories[0].id
    } else if (component === 'KlumpCarousel') {
      activeStory.value = carouselStories[0].id
    } else if (component === 'ProductCartItem') {
      activeStory.value = productCartItemStories[0].id
    } else if (component === 'KlumpDrawer') {
      activeStory.value = drawerStories[0].id
    } else if (component === 'KlumpLocationModal') {
      activeStory.value = locationModalStories[0].id
    } else if (component === 'KlumpMerchantAddress') {
      activeStory.value = merchantAddressStories[0].id
    } else if (component === 'ProductGallery') {
      activeStory.value = productGalleryStories[0].id
    } else if (component === 'QuickCartModal') {
      activeStory.value = quickCartStories[0].id
    }
  }
}

// Initialize with KlumpButton primary story
onMounted(() => {
  selectStory('KlumpButton', 'primary')
})

// Page meta
useHead({
  title: 'Klump Storybook - Component Testing',
  meta: [{ name: 'description', content: 'Storybook-style component testing environment for Klump Vue 3 components' }],
})
</script>

<style scoped>
/* Custom scrollbar for sidebar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
