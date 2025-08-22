// export class RegisterModel {
//   firstName: string = ''
//   lastName: string = ''
//   phone: string = ''
//   email: string = ''
//   password: string = ''
//   address: string = ''
// }

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

export interface LoginModel {
  email: string
  password: string
}

export interface RegisterModel {
  email: string
  userName: string
  password: string
  firstName: string
  lastName: string
  birthDate: string
  address: string
  phone: string
  jobTitle: string
  department: string
  hireDate: string
  contractType: number
  status: number
}

export interface ResetPasswordModel {
  oldPassword: string
  newPassword: string
}

export interface LoginResult {
  accessToken: string
  tokenType: string
  refreshToken: string
  expiresIn: number
}

export interface Response<T> {
  succeeded: boolean
  message: string
  errors: string[]
  data: T
  exception: string | null
  searchMetadata: any | null
  correlationId: string | null
}
