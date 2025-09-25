import type { CreateExpense, Expense, UpdateExpense } from '@/models/expense.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

const createExpense = (data: CreateExpense) => {
  const formData = new FormData()

  // Append fields with the exact names expected by the API
  formData.append('Expense.Description', data.description)
  formData.append('Expense.Amount', data.amount.toString())
  formData.append('Expense.ExpenseDate', data.expenseDate)
  formData.append('Expense.Category', data.category)
  formData.append('File', data.image)

  return api.post<Response<Expense>>('Expenses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const updateExpense = (data: UpdateExpense) => {
  return api.put<Response<Expense>>('Expenses', { expense: data })
}

const getAllExpenses = (currentPage: number, pageSize: number, search?: string) => {
  return api.get<Response<Expense[]>>('Expenses', {
    params: { PageNumber: currentPage, PageSize: pageSize, search }
  })
}

const deleteExpense = (id: number) => {
  return api.delete<Response<any>>(`Expenses/${id}`)
}

const getExpenseById = (id: number) => {
  return api.get<Response<Expense>>(`Expenses/${id}`)
}

const getCurrentUserExpenses = (currentPage: number, pageSize: number, search?: string) => {
  return api.get<Response<Expense[]>>('Expenses/me', {
    params: { PageNumber: currentPage, PageSize: pageSize, search }
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
