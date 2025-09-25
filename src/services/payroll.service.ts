import type { Payroll } from '@/models/payroll.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
}

const createPayroll = (data: FormData) => {
  return api.post<Response<Payroll>>('Payrolls', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const updatePayroll = (data: Partial<Payroll>) => {
  return api.put<Response<Payroll>>('Payrolls', data)
}

const getAllPayrolls = (params: PaginationParams = {}) => {
  return api.get<Response<Payroll[]>>('Payrolls', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

const deletePayroll = (id: number) => {
  return api.delete<Response<any>>(`Payrolls/${id}`)
}

const getPayrollById = (id: number) => {
  return api.get<Response<Payroll>>(`Payrolls/${id}`)
}

const getCurrentUserPayrolls = (params: PaginationParams = {}) => {
  return api.get<Response<Payroll[]>>('Payrolls/me', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

export {
  createPayroll,
  updatePayroll,
  getAllPayrolls,
  deletePayroll,
  getPayrollById,
  getCurrentUserPayrolls
}
