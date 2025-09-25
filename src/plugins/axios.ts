// plugins/axios.ts
import axios, { type AxiosInstance } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'

let isRefreshing = false
let failedQueue: { resolve: Function; reject: Function }[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

// Create the axios instance immediately
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.endsWith('/')
      ? import.meta.env.VITE_API_URL + 'api/'
      : import.meta.env.VITE_API_URL + '/api/'
    : 'http://localhost:5000/api/',
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Use try-catch to avoid issues during SSR or before store is initialized
    try {
      const authStore = useAuthStore()
      const token = authStore.token

      // Only add authorization if token exists and not already set
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.warn('Auth store not available during request setup')
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with automatic retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Check if it's a 401 error and should attempt refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/Auth/login') &&
      !originalRequest.url?.includes('/Auth/refresh')
    ) {
      // If already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const authStore = useAuthStore()
        const refreshToken = authStore.refreshToken

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Use fresh axios instance to avoid interceptor loop
        const refreshInstance = axios.create({
          baseURL: api.defaults.baseURL,
          timeout: 10000
        })

        const response = await refreshInstance.post('Auth/refresh', {
          token: refreshToken
        })

        const newToken = response.data.data?.accessToken || response.data.accessToken

        if (!newToken) {
          throw new Error('No access token received from refresh')
        }

        // Update store and storage
        authStore.setToken(newToken)

        // Update the original request header
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        // Process queued requests
        processQueue(null, newToken)

        // Retry the original request immediately
        return api(originalRequest)
      } catch (refreshError: any) {
        // Refresh failed - clear auth and redirect
        processQueue(refreshError, null)

        const authStore = useAuthStore()
        authStore.logout()

        // Redirect to login if not already there
        if (router.currentRoute.value.name !== 'Login') {
          router.push({ name: 'Login' })
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // For other errors, reject immediately
    return Promise.reject(error)
  }
)

// Vue plugin installation
export default {
  install: (app: any) => {
    // Make api available globally via app.config.globalProperties
    app.config.globalProperties.$api = api

    // Also provide it for composition API usage
    app.provide('api', api)

    // Make it available as global property for options API
    app.config.globalProperties.api = api
  }
}

// Optional: Export a function to check if axios is ready
export const isAxiosReady = () => !!api
