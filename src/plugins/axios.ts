import { computed, ref, type App } from 'vue'
import axios, { type AxiosInstance } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'

const internalApi = ref<AxiosInstance>()
const normalApi = ref<AxiosInstance>()
const noBaseUrlApi = ref<AxiosInstance>()
const token = ref(localStorage.getItem('token'))

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, newToken: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(newToken)
  })
  failedQueue = []
}

const api = computed<AxiosInstance>({
  get: () => {
    if (!internalApi.value) {
      throw new Error('Axios instance not created. Call createAxiosInstances(baseURL) first.')
    }
    return internalApi.value
  },
  set: (value) => {
    internalApi.value = value
  }
})

export function createAxiosInstances(baseURL: string) {
  if (baseURL.endsWith('/')) baseURL = baseURL.slice(0, -1)
  localStorage.setItem('baseURL', baseURL)

  const config = { baseURL: `${baseURL}/api/`, withCredentials: true }
  const normalConfig = { baseURL, withCredentials: true }
  const noBaseUrlConfig = { withCredentials: true }

  api.value = axios.create(config)
  normalApi.value = axios.create(normalConfig)
  noBaseUrlApi.value = axios.create(noBaseUrlConfig)

  const setupInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('token')
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
        return config
      },
      (error) => Promise.reject(error)
    )

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const authStore = useAuthStore()
        const originalRequest = error.config

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('Auth/login') &&
          !originalRequest.url?.includes('Auth/refresh')
        ) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then((newToken) => {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return axios(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }

          originalRequest._retry = true
          isRefreshing = true

          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token found')

            const response = await axios.post(`${baseURL}/api/Auth/refresh`, {
              token: refreshToken
            })
            const newAccessToken = response.data.data.accessToken

            localStorage.setItem('token', newAccessToken)
            token.value = newAccessToken

            processQueue(null, newAccessToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axios(originalRequest)
          } catch (err) {
            processQueue(err, null)
            authStore.logout()
            router.push({ name: 'Login' })
            return Promise.reject(err)
          } finally {
            isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  setupInterceptors(api.value)
  setupInterceptors(normalApi.value)
  setupInterceptors(noBaseUrlApi.value)
}

export default {
  install: (app: App) => {
    if (!api.value || !normalApi.value || !noBaseUrlApi.value) {
      throw new Error('Axios instances have not been created yet.')
    }
    app.config.globalProperties.$axios = normalApi
    app.config.globalProperties.$api = api
    app.config.globalProperties.$noBaseUrlApi = noBaseUrlApi
  }
}

export { api, normalApi, noBaseUrlApi, token }
