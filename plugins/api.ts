import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  // Create a wrapper for $fetch with default headers
  const api = async (url: string, options: any = {}) => {
    const headers = {
      'Client-Id': config.public.clientId,
      'Client-Key': config.public.clientKey,
      'Client-Secret': config.public.clientSecret,
      ...(options.headers || {}),
    }

    return await $fetch(url, {
      baseURL: config.public.apiUrl,
      ...options,
      headers,
    })
  }

  // Inject as $api
  nuxtApp.provide('api', api)
})
