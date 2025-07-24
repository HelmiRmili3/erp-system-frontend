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

// export interface LoginResult {
//   accessToken: string
//   expiresIn: number
//   refreshToken: string
//   tokenType: string
// }

// export interface User {
//   id: string
//   email: string
//   userName: string
//   firstName: string
//   lastName: string
//   birthDate: string | null
//   address: string | null
//   phone: string | null
//   jobTitle: string
//   department: string
//   hireDate: string | null
//   contractType: number | null
//   status: number
//   supervisorId: string | null
//   supervisorFullName?: string
//   roles: string[]
//   permissions: string[]
// }

// export interface Response<T> {
//   succeeded: boolean
//   message: string
//   errors: string[]
//   data: T
//   exception: string | null
//   searchMetadata: any | null
//   correlationId: string | null
// }

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

// export interface RegisterModel {
//   email: string;
//   userName: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   birthDate: string | null;
//   address: string | null;
//   phone: string | null;
//   jobTitle: string;
//   department: string;
//   hireDate: string | null;
//   contractType: number | null;
//   status: number;
// }
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
