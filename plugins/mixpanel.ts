import mixpanel from 'mixpanel-browser'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  const isMixpanelEnabled = typeof config.public.mixPanelKey === 'undefined'
  const token =
    config.public.nodeEnv === 'production' && !isMixpanelEnabled
      ? config.public.mixPanelKey
      : 'e1b9e5dd4ac6691cb595772d402c7b1e'

  mixpanel.init(token)

  // Inject as $mixpanel
  nuxtApp.provide('mixpanel', mixpanel)
})
