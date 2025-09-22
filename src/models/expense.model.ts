import type { User } from './common.model'

export interface Expense {
  id: number
  userId: string
  description: string
  amount: number
  expenseDate: string
  category: string
  status: number
  receiptPath: string
  user: User
}

export interface CreateExpense {
  description: string
  amount: number
  expenseDate: string
  category: string
  image: File
}
