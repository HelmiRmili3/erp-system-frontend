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
