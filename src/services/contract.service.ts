import type { Contract } from '@/models/contract.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
}

const createContract = (data: Partial<Contract>) => {
  return api.value!.post<Response<Contract>>('Contracts', data)
}

const updateContract = (data: Partial<Contract>) => {
  return api.value!.put<Response<Contract>>('Contracts', data)
}

const getAllContracts = (params: PaginationParams = {}) => {
  return api.value!.get<Response<Contract[]>>('Contracts', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

const deleteContract = (id: number) => {
  return api.value!.delete<Response<any>>(`Contracts/${id}`)
}

const getContractById = (id: number) => {
  return api.value!.get<Response<Contract>>(`Contracts/${id}`)
}

const getCurrentUserContracts = (params: PaginationParams = {}) => {
  return api.value!.get<Response<Contract[]>>('Contracts/me', {
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
