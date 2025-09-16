// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // SSR Configuration
  ssr: true,

  // Server Configuration
  devServer: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: process.env.HOST || 'localhost',
  },

  // App Configuration (replaces head in Nuxt 2)
  app: {
    head: {
      title: 'Klump — Pay in instalments | Klump Commerce',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Use Klump to buy now and pay later in instalments for up to 12 months! Businesses accept payments, increase conversion rates, and boost revenue. The Easy Life! Try it now.',
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          sizes: '192x192',
          type: 'image/png',
          href: '/android-chrome-192x192.png',
        },
        {
          rel: 'icon',
          sizes: '512x512',
          type: 'image/png',
          href: '/android-chrome-512x512.png',
        },
        {
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          sizes: '16x16',
          type: 'image/png',
          href: '/favicon-16x16.png',
        },
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtm.js?id=GTM-56DGLGNL',
          async: true,
        },
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-56DGLGNL');`,
          type: 'text/javascript',
        },
        {
          src: 'https://www.googletagmanager.com/gtm.js?id=G-V16Y1WHNB9',
          async: true,
        },
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','G-V16Y1WHNB9');`,
          type: 'text/javascript',
        },
      ],
    },
  },

  // Runtime Config (replaces env in Nuxt 2)
  runtimeConfig: {
    public: {
      clientId: process.env.NUXT_PUBLIC_CLIENT_ID,
      clientKey: process.env.NUXT_PUBLIC_CLIENT_KEY,
      clientSecret: process.env.NUXT_PUBLIC_CLIENT_SECRET,
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      browserUrlDomain: process.env.NUXT_PUBLIC_BROWSER_URL_DOMAIN,
      nodeEnv: process.env.NUXT_PUBLIC_NODE_ENV,
      googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID,
      googleAnalyticsIdForStanbic: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID_FOR_STANBIC,
      pagaMerchantId: process.env.NUXT_PUBLIC_PAGA_MERCHANT_ID,
      mixPanelKey: process.env.NUXT_PUBLIC_MIX_PANEL_KEY,
      paystackPk: process.env.NUXT_PUBLIC_PAYSTACK_PK,
      bugsnagApiKey: process.env.NUXT_PUBLIC_BUGSNAG_API_KEY,
      // NOTE: All env variables should use NUXT_PUBLIC_ prefix for Nuxt 3 public runtime config
    },
  },

  // CSS Configuration - import our custom CSS with Tailwind v4
  css: ['~/assets/css/main.css'],

  // Modules
  modules: ['@nuxt/image', '@pinia/nuxt', '@vueuse/nuxt'],

  // Auto import components
  components: {
    dirs: ['~/components'],
  },

  // Build Configuration
  build: {},

  vite: {
    plugins: [tailwindcss()],
    esbuild: {
      // Disable CSS minification warnings
      logOverride: { 'css-syntax-error': 'silent' },
    },
    build: {
      // Use esbuild for CSS but suppress warnings
      cssMinify: true,
      rollupOptions: {
        output: {
          // Better CSS handling
          assetFileNames: assetInfo => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'css/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
    },
    define: {
      'crypto.hash': 'undefined',
    },
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
      },
    },
  },

  // TypeScript Configuration
  typescript: {
    strict: true,
  },
})
