import type { Contract } from '@/models/contract.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
}

const createContract = (data: FormData) => {
  return api.post<Response<Contract>>('Contracts', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const updateContract = (data: Partial<Contract>) => {
  return api.put<Response<Contract>>('Contracts', data)
}

const getAllContracts = (params: PaginationParams = {}) => {
  return api.get<Response<Contract[]>>('Contracts', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

const deleteContract = (id: number) => {
  return api.delete<Response<any>>(`Contracts/${id}`)
}

const getContractById = (id: number) => {
  return api.get<Response<Contract>>(`Contracts/${id}`)
}

const getCurrentUserContracts = (params: PaginationParams = {}) => {
  return api.get<Response<Contract[]>>('Contracts/me', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

export {
  createContract,
  updateContract,
  getAllContracts,
  deleteContract,
  getContractById,
  getCurrentUserContracts
}
