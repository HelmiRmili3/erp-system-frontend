import type {
  LoginModel,
  LoginResult,
  RegisterModel,
  ResetPasswordModel,
  User
} from '@/models/auth.model'
import type { Response } from '@/models/response'
import { api, noBaseUrlApi } from '@/plugins/axios'

const register = (data: RegisterModel) => {
  return api.value!.post<Response<User>>('/register', data)
}

// const login = (data: LoginModel) => {
//   return api.value!.post<LoginResult>('/Auth/login', data)
// }
const login = async (data: LoginModel) => {
  const res = await api.value!.post<Response<LoginResult>>('/Auth/login', data)
  console.log(res.data.data)
  return res.data.data // ✅ unwrap the `data` field
}

const resendEmailVerification = (email: string) => {
  return api.value!.get<Response<any>>(`/email/resend/${email}`)
}

const verifyEmail = (url: string) => {
  return noBaseUrlApi.value!.get<Response<any>>(url)
}

const requestResetPassword = (email: string) => {
  return api.value!.post<Response<any>>(`/password/email/`, { email })
}

const resetPassword = (data: ResetPasswordModel) => {
  return api.value!.post<Response<any>>(`/password/reset/`, data)
}

const googleSignIn = (idToken: string) => {
  return api.value!.post('/auth/google-signin', { token: idToken })
}

export {
  register,
  login,
  resendEmailVerification,
  requestResetPassword,
  resetPassword,
  verifyEmail,
  googleSignIn
}
