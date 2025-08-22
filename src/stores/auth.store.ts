// import { ref, computed } from 'vue'
// import { defineStore } from 'pinia'
// import axios from 'axios'
// import type { LoginModel, RegisterModel } from '@/models/auth.model'
// import { token } from '@/plugins/axios'
// import { login, refresh, me, register } from '@/services/auth.service'
// import type { User } from '@/models/user.model'

// export const useAuthStore = defineStore('auth', () => {
//   const isAuthenticated = ref(localStorage.getItem('token') !== null)
//   const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
//   const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
//   const tokenExpiresAt = ref<number | null>(
//     localStorage.getItem('tokenExpiresAt')
//       ? parseInt(localStorage.getItem('tokenExpiresAt')!)
//       : null
//   )
//   let refreshInterval: ReturnType<typeof setInterval> | null = null
//   const isRefreshing = ref(false) // Prevent concurrent refreshes

//   // Check if token is expired or about to expire (within 5 minutes)
//   const isTokenExpired = computed(() => {
//     if (!tokenExpiresAt.value) return true
//     return Date.now() >= tokenExpiresAt.value - 300000 // 5-minute buffer
//   })

//   // Start a timer to refresh the token before it expires
//   const startRefreshTimer = () => {
//     if (refreshInterval) clearInterval(refreshInterval)
//     if (tokenExpiresAt.value && refreshToken.value) {
//       const expiresInMs = tokenExpiresAt.value - Date.now()
//       const refreshInMs = Math.max(expiresInMs - 300000, 10000) // Refresh 5 minutes before expiry, min 10s
//       console.log('Starting refresh timer, interval:', refreshInMs, 'ms')
//       refreshInterval = setInterval(async () => {
//         if (isTokenExpired.value && !isRefreshing.value) {
//           await refreshAction()
//         }
//       }, refreshInMs)
//     }
//   }

//   // Stop the refresh timer
//   const stopRefreshTimer = () => {
//     if (refreshInterval) {
//       clearInterval(refreshInterval)
//       refreshInterval = null
//     }
//   }

//   const registerAction = async (data: RegisterModel) => {
//     try {
//       const result = await register(data)
//       console.log('register:', result)
//       if (result.succeeded) {
//         user.value = result.data
//         localStorage.setItem('user', JSON.stringify(user.value))
//         await loginAction({ email: data.email, password: data.password })
//       }
//       return result
//     } catch (error) {
//       console.error('Registration failed:', error)
//       return { succeeded: false, errors: [error] }
//     }
//   }

//   const loginAction = async (credentials: LoginModel) => {
//     try {
//       const result = await login(credentials)
//       if (result.succeeded && result.data.accessToken && result.data.tokenType) {
//         localStorage.setItem('token', `${result.data.tokenType} ${result.data.accessToken}`)
//         token.value = `${result.data.tokenType} ${result.data.accessToken}`
//         if (result.data.refreshToken) {
//           localStorage.setItem('refreshToken', result.data.refreshToken)
//           refreshToken.value = result.data.refreshToken
//         }
//         if (result.data.expiresIn) {
//           const expiresAt = Date.now() + result.data.expiresIn * 1000
//           localStorage.setItem('tokenExpiresAt', expiresAt.toString())
//           tokenExpiresAt.value = expiresAt
//         }
//         isAuthenticated.value = true
//         await fetchMe()
//         startRefreshTimer()
//       } else {
//         console.error('Invalid login result:', result.message, result.errors)
//       }
//     } catch (error) {
//       console.error('Login failed:', error)
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('refreshToken')
//     localStorage.removeItem('tokenExpiresAt')
//     localStorage.removeItem('user')
//     token.value = ''
//     refreshToken.value = null
//     tokenExpiresAt.value = null
//     isAuthenticated.value = false
//     user.value = null
//     stopRefreshTimer()
//   }

//   const fetchMe = async () => {
//     if (user.value) {
//       console.log('Using cached user:', user.value)
//       return // Skip fetching if user is cached
//     }
//     try {
//       const result = await me()
//       if (result.succeeded) {
//         user.value = result.data
//         console.log('Using fetched user:', user.value)
//         localStorage.setItem('user', JSON.stringify(user.value))
//       } else {
//         console.error('Failed to fetch user:', result.message, result.errors)
//         logout()
//       }
//     } catch (error) {
//       console.error('Fetch user failed:', error)
//       logout()
//     }
//   }

//   const refreshAction = async () => {
//     if (!refreshToken.value || isRefreshing.value) {
//       console.error('No refresh token or refresh in progress')
//       logout()
//       return false
//     }

//     isRefreshing.value = true
//     try {
//       const result = await refresh(refreshToken.value)
//       if (result.succeeded && result.data.accessToken && result.data.tokenType) {
//         localStorage.setItem('token', `${result.data.tokenType} ${result.data.accessToken}`)
//         localStorage.setItem('refreshToken', result.data.refreshToken)
//         localStorage.setItem(
//           'tokenExpiresAt',
//           (Date.now() + result.data.expiresIn * 1000).toString()
//         )
//         token.value = `${result.data.tokenType} ${result.data.accessToken}`
//         refreshToken.value = result.data.refreshToken
//         tokenExpiresAt.value = Date.now() + result.data.expiresIn * 1000
//         isAuthenticated.value = true
//         if (!user.value) await fetchMe() // Fetch user only if not cached
//         startRefreshTimer()
//         return true
//       } else {
//         console.error('Invalid refresh result:', result.message, result.errors)
//         logout()
//         return false
//       }
//     } catch (error) {
//       console.error('Refresh token failed:', error)
//       logout()
//       return false
//     } finally {
//       isRefreshing.value = false
//     }
//   }

//   // Axios interceptor to refresh token on 401 errors
//   axios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config
//       if (
//         error.response?.status === 401 &&
//         !originalRequest._retry &&
//         refreshToken.value &&
//         !isRefreshing.value
//       ) {
//         originalRequest._retry = true
//         const success = await refreshAction()
//         if (success) {
//           originalRequest.headers['Authorization'] = token.value
//           return axios(originalRequest)
//         }
//       }
//       return Promise.reject(error)
//     }
//   )

//   // Initialize session on app load
//   if (isAuthenticated.value && refreshToken.value && tokenExpiresAt.value) {
//     console.log(tokenExpiresAt.value)
//     if (isTokenExpired.value) {
//       refreshAction()
//     } else {
//       startRefreshTimer()
//       if (!user.value) fetchMe()
//     }
//   }

//   return {
//     isAuthenticated,
//     user,
//     login: loginAction,
//     register: registerAction,
//     logout,
//     fetchMe,
//     refresh: refreshAction,
//     isAdmin: true,
//     fullName: 'Admin'
//   }
// })
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { LoginModel, RegisterModel } from '@/models/auth.model'
import { token } from '@/plugins/axios'
import { login, refresh, me, register } from '@/services/auth.service'
import type { User } from '@/models/user.model'

export const useAuthStore = defineStore('auth', () => {
  // 🔑 State
  const isAuthenticated = ref(!!localStorage.getItem('token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const tokenExpiresAt = ref<number | null>(
    localStorage.getItem('tokenExpiresAt')
      ? parseInt(localStorage.getItem('tokenExpiresAt')!)
      : null
  )
  console.log('tokenExpiresAt : ', tokenExpiresAt)
  let refreshTimeout: ReturnType<typeof setTimeout> | null = null
  const isRefreshing = ref(false)

  // 📌 Check if token expired
  const isTokenExpired = computed(() => {
    if (!tokenExpiresAt.value) return true
    return Date.now() >= tokenExpiresAt.value
  })

  // 📌 Start refresh timer (at exact expiration)
  const startRefreshTimer = () => {
    stopRefreshTimer()
    if (!tokenExpiresAt.value || !refreshToken.value) return

    const expiresInMs = tokenExpiresAt.value - Date.now()
    if (expiresInMs <= 0) {
      refreshAction()
      return
    }

    refreshTimeout = setTimeout(async () => {
      await refreshAction()
    }, expiresInMs)
  }

  // 📌 Stop refresh timer
  const stopRefreshTimer = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
      refreshTimeout = null
    }
  }

  // 📌 Save tokens + expiry
  const saveSession = (data: any) => {
    const access = `${data.tokenType} ${data.accessToken}`
    token.value = access
    localStorage.setItem('token', access)

    if (data.refreshToken) {
      refreshToken.value = data.refreshToken
      localStorage.setItem('refreshToken', data.refreshToken)
    }

    if (data.expiresIn) {
      const expiresAt = Date.now() + data.expiresIn * 1000

      tokenExpiresAt.value = expiresAt
      localStorage.setItem('tokenExpiresAt', expiresAt.toString())
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

  // 📌 Login
  const loginAction = async (credentials: LoginModel) => {
    try {
      const result = await login(credentials)
      if (result.succeeded && result.data.accessToken && result.data.tokenType) {
        saveSession(result.data)
        isAuthenticated.value = true
        await fetchMe()
        startRefreshTimer()
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  // 📌 Logout
  const logout = () => {
    localStorage.clear()
    token.value = ''
    refreshToken.value = null
    tokenExpiresAt.value = null
    user.value = null
    isAuthenticated.value = false
    stopRefreshTimer()
  }

  // 📌 Fetch user
  const fetchMe = async () => {
    if (user.value) return
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

  // 📌 Refresh token
  const refreshAction = async () => {
    if (!refreshToken.value || isRefreshing.value) return false
    isRefreshing.value = true
    try {
      const result = await refresh(refreshToken.value)
      if (result.succeeded && result.data.accessToken && result.data.tokenType) {
        saveSession(result.data)
        isAuthenticated.value = true
        if (!user.value) await fetchMe()
        startRefreshTimer()
        return true
      } else {
        logout()
        return false
      }
    } catch {
      logout()
      return false
    } finally {
      isRefreshing.value = false
    }
  }

  // 📌 Axios interceptor: retry on 401
  axios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        refreshToken.value &&
        !isRefreshing.value
      ) {
        originalRequest._retry = true
        const success = await refreshAction()
        if (success) {
          originalRequest.headers['Authorization'] = token.value
          return axios(originalRequest)
        }
      }
      return Promise.reject(error)
    }
  )

  // 📌 Init session on app load
  if (isAuthenticated.value && refreshToken.value && tokenExpiresAt.value) {
    if (isTokenExpired.value) {
      refreshAction()
    } else {
      startRefreshTimer()
      if (!user.value) fetchMe()
    }
  }

  return {
    isAuthenticated,
    user,
    login: loginAction,
    register: registerAction,
    logout,
    fetchMe,
    refresh: refreshAction
  }
})
