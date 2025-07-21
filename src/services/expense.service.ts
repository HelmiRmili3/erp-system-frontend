import type { Expense } from '@/models/expense.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

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
