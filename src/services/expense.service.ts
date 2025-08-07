import type { Expense } from '@/models/expense.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
}

const createExpense = (data: Partial<Expense>) => {
  return api.value!.post<Response<Expense>>('Expenses', data)
}

const updateExpense = (data: Partial<Expense>) => {
  return api.value!.put<Response<Expense>>('Expenses', data)
}

const getAllExpenses = (params: PaginationParams = {}) => {
  return api.value!.get<Response<Expense[]>>('Expenses', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

const deleteExpense = (id: number) => {
  return api.value!.delete<Response<any>>(`Expenses/${id}`)
}

const getExpenseById = (id: number) => {
  return api.value!.get<Response<Expense>>(`Expenses/${id}`)
}

const getCurrentUserExpenses = (params: PaginationParams = {}) => {
  return api.value!.get<Response<Expense[]>>('Expenses/me', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

export {
  createExpense,
  updateExpense,
  getAllExpenses,
  deleteExpense,
  getExpenseById,
  getCurrentUserExpenses
}
