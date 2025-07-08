import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { LoginResult } from '@/models/auth.model'
import { token } from '@/plugins/axios'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(localStorage.getItem('token') !== null)

  const login = (result: LoginResult) => {
    if (result && result.accessToken && result.tokenType) {
      localStorage.setItem('token', `${result.tokenType} ${result.accessToken}`)
      token.value = `${result.tokenType} ${result.accessToken}`
      isAuthenticated.value = true
    } else {
      console.error('Invalid login result:', result)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    login,
    logout,
    isAdmin: true,
    fullName: 'Admin',
  }
})
