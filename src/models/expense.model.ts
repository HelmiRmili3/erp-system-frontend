import type { ExpenseStatus } from '@/enums/expenseStatus'
import type { User } from './common.model'

export interface Expense {
  id: number
  userId: string
  description: string
  amount: number
  expenseDate: string
  category: string
  status: ExpenseStatus
  receiptPath: string
  user: User
}
export interface UpdateExpense {
  id: number
  userId: string
  description: string
  amount: number
  expenseDate: string
  category: string
  status: ExpenseStatus
  receiptPath: string
}
export interface CreateExpense {
  description: string
  amount: number
  expenseDate: string
  category: string
  image: File
}
