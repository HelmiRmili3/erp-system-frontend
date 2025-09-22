import type { User } from './common.model'

export interface Contract {
  id: number
  userId: string
  contractType: number
  startDate: string
  endDate: string
  file: File
  status: number
  user: User
}
export interface AddContract {
  userId: string // Contract.UserId
  contractType: number // Contract.ContractType
  startDate: string // Contract.StartDate, ISO 8601 string
  endDate?: string // Contract.EndDate, ISO 8601 string, optional
  status: number // Contract.Status
  file?: File // File to upload
}

// Maps for frontend dropdowns
export const contractTypes = [
  { label: 'Permanent', value: 0 },
  { label: 'Temporary', value: 1 },
  { label: 'Freelance', value: 2 }
]

export const employeeStatuses = [
  { label: 'Active', value: 0 },
  { label: 'Inactive', value: 1 },
  { label: 'Terminated', value: 2 }
]
