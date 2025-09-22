import type { User } from './common.model'

export interface Certification {
  id: number
  userId: string
  name: string
  authority: string
  dateObtained: string
  fileUrl: string
  user: User
}
