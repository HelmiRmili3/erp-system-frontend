import type { Certification } from '@/models/certification.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
}

const createCertification = (data: FormData) => {
  return api.post<Response<Certification>>('Certifications', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const updateCertification = (data: Partial<Certification>) => {
  return api.put<Response<Certification>>('Certifications', data, {})
}

const getAllCertifications = (params: PaginationParams = {}) => {
  return api.get<Response<Certification[]>>('Certifications', {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search
    }
  })
}

const deleteCertification = (id: number) => {
  return api.delete<Response<any>>(`Certifications/${id}`)
}

const getCertificationById = (id: number) => {
  return api.get<Response<Certification>>(`Certifications/${id}`)
}

// const getCurrentUserCertifications = (params: PaginationParams = {}) => {
//   return api.get<Response<Certification[]>>('Certifications/me', {
//     params: {
//       page: params.page,
//       perPage: params.perPage,
//       search: params.search
//     }
//   })
// }

export {
  createCertification,
  updateCertification,
  getAllCertifications,
  deleteCertification,
  getCertificationById
  // getCurrentUserCertifications
}
