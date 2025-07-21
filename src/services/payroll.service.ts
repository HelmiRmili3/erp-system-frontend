import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

// Placeholder type - adjust according to your actual model
interface Payroll {
  id: number
  // Add other payroll properties
}

const createPayroll = (data: Partial<Payroll>) => {
  return api.value!.post<Response<Payroll>>('/api/Payrolls', data)
}

const updatePayroll = (data: Partial<Payroll>) => {
  return api.value!.put<Response<Payroll>>('/api/Payrolls', data)
}

const getAllPayrolls = () => {
  return api.value!.get<Response<Payroll[]>>('/api/Payrolls')
}

const deletePayroll = (id: number) => {
  return api.value!.delete<Response<any>>(`/api/Payrolls/${id}`)
}

const getPayrollById = (id: number) => {
  return api.value!.get<Response<Payroll>>(`/api/Payrolls/{id}`)
}

const getCurrentUserPayrolls = () => {
  return api.value!.get<Response<Payroll[]>>('/api/Payrolls/me')
}

export {
  createPayroll,
  updatePayroll,
  getAllPayrolls,
  deletePayroll,
  getPayrollById,
  getCurrentUserPayrolls
}
