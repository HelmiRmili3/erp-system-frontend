// export interface Role {
//   name: string
// }

// export interface Permission {
//   name: string
// }

// export interface User {
//   id: string
//   email: string
//   userName: string
//   firstName: string
//   lastName: string
//   birthDate: string
//   address: string
//   phone: string
//   jobTitle: string
//   department: string
//   hireDate: string
//   contractType: number
//   status: number
//   supervisorId: string
//   roles: string[]
//   permissions: string[]
// }

// export interface RolePermissions {
//   role: Role
//   permissions: Permission[]
// }
export interface Role {
  name: string
}

export interface Permission {
  name: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  birthDate: string | null
  address: string | null
  fullName: string
  email: string
  jobTitle: string
  department: string
  hireDate: string | null
  contractType: string
  status: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  supervisorId: string
  supervisorFullName: string
  roles: string[]
  permissions: string[]
}

export interface RolePermissions {
  role: Role
  permissions: Permission[]
}

export interface Response<T> {
  pageNumber: number
  pageSize: number
  recordsFiltered: number
  recordsTotal: number
  succeeded: boolean
  message: string
  errors: string[]
  data: T
  exception: string | null
  searchMetadata: any | null
  correlationId: string | null
}
