import type { Payroll } from '@/models/payroll.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
}

const createPayroll = (data: Partial<Payroll>) => {
  return api.value!.post<Response<Payroll>>('Payrolls', data)
}

const updatePayroll = (data: Partial<Payroll>) => {
  return api.value!.put<Response<Payroll>>('Payrolls', data)
}

const getAllPayrolls = (params: PaginationParams = {}) => {
  return api.value!.get<Response<Payroll[]>>('Payrolls', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

const deletePayroll = (id: number) => {
  return api.value!.delete<Response<any>>(`Payrolls/${id}`)
}

const getPayrollById = (id: number) => {
  return api.value!.get<Response<Payroll>>(`Payrolls/${id}`)
}

const getCurrentUserPayrolls = (params: PaginationParams = {}) => {
  return api.value!.get<Response<Payroll[]>>('Payrolls/me', {
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
