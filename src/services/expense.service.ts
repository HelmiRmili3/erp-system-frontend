import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

// Placeholder type - adjust according to your actual model
interface Expense {
  id: number
  // Add other expense properties
}

const createExpense = (data: Partial<Expense>) => {
  return api.value!.post<Response<Expense>>('/api/Expenses', data)
}

const updateExpense = (data: Partial<Expense>) => {
  return api.value!.put<Response<Expense>>('/api/Expenses', data)
}

const getAllExpenses = () => {
  return api.value!.get<Response<Expense[]>>('/api/Expenses')
}

const deleteExpense = (id: number) => {
  return api.value!.delete<Response<any>>(`/api/Expenses/${id}`)
}

const getExpenseById = (id: number) => {
  return api.value!.get<Response<Expense>>(`/api/Expenses/${id}`)
}

const getCurrentUserExpenses = () => {
  return api.value!.get<Response<Expense[]>>('/api/Expenses/me')
}

export {
  createExpense,
  updateExpense,
  getAllExpenses,
  deleteExpense,
  getExpenseById,
  getCurrentUserExpenses
}
