import type { Certification } from '@/models/certification.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
}

const createCertification = (data: Partial<Certification>) => {
  return api.value!.post<Response<Certification>>('Certifications', data)
}

const updateCertification = (data: Partial<Certification>) => {
  return api.value!.put<Response<Certification>>('Certifications', data)
}

const getAllCertifications = (params: PaginationParams = {}) => {
  return api.value!.get<Response<Certification[]>>('Certifications', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

const deleteCertification = (id: number) => {
  return api.value!.delete<Response<any>>(`Certifications/${id}`)
}

const getCertificationById = (id: number) => {
  return api.value!.get<Response<Certification>>(`Certifications/${id}`)
}

const getCurrentUserCertifications = (params: PaginationParams = {}) => {
  return api.value!.get<Response<Certification[]>>('Certifications/me', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

export {
  createCertification,
  updateCertification,
  getAllCertifications,
  deleteCertification,
  getCertificationById,
  getCurrentUserCertifications
}
