// stores/app.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const baseURL = ref('http://localhost:5000') // default value

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const initializeBaseURL = () => {
    if (typeof window !== 'undefined') {
      const savedURL = localStorage.getItem('baseURL')
      if (savedURL) {
        baseURL.value = savedURL
      }
    }
  }

  const setBaseURL = (url: string) => {
    baseURL.value = url
    if (typeof window !== 'undefined') {
      localStorage.setItem('baseURL', url)
    }
  }

  return {
    loading,
    baseURL,
    setLoading,
    initializeBaseURL,
    setBaseURL
  }
})
