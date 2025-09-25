import { defineStore } from 'pinia'
import { login as loginApi, me as meApi, register as registerApi } from '@/services/auth.service'
import { ref } from 'vue'
import type { LoginModel } from '@/models/auth.model'
import type { User } from '@/models/user.model'
/**
 * Save tokens (compatible with auth.store.ts)
 */
const setTokens = (accessToken: string, refreshToken?: string) => {
  try {
    const authStore = useAuthStore()
    authStore.setToken(accessToken) // Use the store's setToken method (singular)
    if (refreshToken) {
      authStore.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
    }
  } catch (error) {
    // Fallback to direct localStorage if store not available
    localStorage.setItem('token', accessToken)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
  }
}
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')
  const isAuthenticated = ref(!!token.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    isAuthenticated.value = true
  }

  const login = async (credentials: LoginModel) => {
    const result = await loginApi(credentials)
    if (result.succeeded && result.data.accessToken) {
      setToken(result.data.accessToken)
      refreshToken.value = result.data.refreshToken
      localStorage.setItem('refreshToken', result.data.refreshToken)
      await fetchMe()
    }
  }

  const logout = () => {
    token.value = ''
    refreshToken.value = ''
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  // 📌 Register
  const register = async (data: any) => {
    try {
      const result = await registerApi(data)
      console.log('New user : ', result)
    } catch (error) {
      return { succeeded: false, errors: [error] }
    }
  }

  const fetchMe = async () => {
    try {
      const result = await meApi()
      if (result.succeeded) {
        user.value = result.data
        localStorage.setItem('user', JSON.stringify(user.value))
      } else logout()
    } catch {
      logout()
    }
  }

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    login,
    logout,
    register,
    fetchMe,
    setToken,
    setTokens
  }
})
