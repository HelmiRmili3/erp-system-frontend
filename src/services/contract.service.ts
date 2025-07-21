import type { Contract } from '@/models/contract.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

const createContract = (data: Partial<Contract>) => {
  return api.value!.post<Response<Contract>>('/api/Contracts', data)
}

const updateContract = (data: Partial<Contract>) => {
  return api.value!.put<Response<Contract>>('/api/Contracts', data)
}

const getAllContracts = () => {
  return api.value!.get<Response<Contract[]>>('/api/Contracts')
}

const deleteContract = (id: number) => {
  return api.value!.delete<Response<any>>(`/api/Contracts/${id}`)
}

const getContractById = (id: number) => {
  return api.value!.get<Response<Contract>>(`/api/Contracts/${id}`)
}

const getCurrentUserContracts = () => {
  return api.value!.get<Response<Contract[]>>('/api/Contracts/me')
}

export {
  createContract,
  updateContract,
  getAllContracts,
  deleteContract,
  getContractById,
  getCurrentUserContracts
}
