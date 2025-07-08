export class RegisterModel {
  first_name: string = ''
  last_name: string = ''
  phone: string = ''
  email: string = ''
  password: string = ''
  confirm_password: string = ''
  address: string = ''
}

export class LoginModel {
  email: string = ''
  password: string = ''
}

export class ForgotPasswordModel {
  email: string = ''
}

export class ResetPasswordModel {
  email: string = ''
  token: string = ''
  password: string = ''
  confirm_password: string = ''
}

export interface LoginResult {
  accessToken: string
  expiresIn: number
  refreshToken: string
  tokenType: string
}

export interface User {
  id: number
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
  is_admin: number
  is_enabled: number
  first_name: string
  last_name: string
  street_name: string
  house_number: string
  postal_code: string
  phone: string
}
