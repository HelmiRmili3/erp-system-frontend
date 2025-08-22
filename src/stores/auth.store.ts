import { defineStore } from 'pinia'
import { login, me, register } from '@/services/auth.service'
import type { LoginModel } from '@/models/auth.model'
import type { User } from '@/models/user.model'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(!!localStorage.getItem('token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))

  // Login
  const loginAction = async (credentials: LoginModel) => {
    const result = await login(credentials)
    if (result.succeeded && result.data.accessToken) {
      const accessToken = `${result.data.tokenType} ${result.data.accessToken}`
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', result.data.refreshToken || '')
      isAuthenticated.value = true
      await fetchMe()
    }
  }

  // 📌 Register
  const registerAction = async (data: any) => {
    try {
      const result = await register(data)
      console.log('New user : ', result)
    } catch (error) {
      return { succeeded: false, errors: [error] }
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    isAuthenticated.value = false
    user.value = null
  }

  // Fetch current user
  const fetchMe = async () => {
    try {
      const result = await me()
      if (result.succeeded) {
        user.value = result.data
        localStorage.setItem('user', JSON.stringify(user.value))
      } else {
        logout()
      }
    } catch {
      logout()
    }
  }

  return { isAuthenticated, user, login: loginAction, logout, fetchMe, register: registerAction }
})
