import type {
  LoginModel,
  RegisterModel,
  ResetPasswordModel,
  LoginResult,
  Response
} from '@/models/auth.model'
import type { User } from '@/models/user.model'
import { api, normalApi } from '@/plugins/axios'

// Register a new user
const register = async (userData: RegisterModel) => {
  const payload = { data: userData }
  console.log('Sending payload:', JSON.stringify(payload, null, 2))
  try {
    const response = await normalApi.value!.post<Response<User>>('/api/Auth/register', payload)
    console.log('Registration successful:', response.data)
    return response
  } catch (error: any) {
    console.error('Registration failed:', error)
    console.error('Backend validation errors:', JSON.stringify(error.response?.data, null, 2))
    throw error
  }
}

// Login a user
const login = async (data: LoginModel) => {
  const response = await api.value!.post<Response<LoginResult>>('Auth/login', data)
  return response.data
}

// Refresh access token
const refresh = async (refreshToken: string) => {
  const response = await api.value!.post<Response<LoginResult>>('/Auth/refresh', {
    token: refreshToken
  })
  return response.data
}

// Change password
const resetPassword = async (data: ResetPasswordModel) => {
  const response = await api.value!.post<Response<void>>('Auth/change-password', data)
  return response.data
}

// Get current user
const me = async () => {
  const response = await api.value!.get<Response<User>>('Auth/me')
  return response.data
}

const googleSignIn = async (id: string) => {
  const response = await api.value!.get<Response<User>>('Auth/me')
  return response.data
}

export { register, login, refresh, resetPassword, me, googleSignIn }
