import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

// Placeholder type - adjust according to your actual model
interface Certification {
  id: number
  // Add other certification properties
}

const createCertification = (data: Partial<Certification>) => {
  return api.value!.post<Response<Certification>>('/api/Certifications', data)
}

const updateCertification = (data: Partial<Certification>) => {
  return api.value!.put<Response<Certification>>('/api/Certifications', data)
}

const getAllCertifications = () => {
  return api.value!.get<Response<Certification[]>>('/api/Certifications')
}

const deleteCertification = (id: number) => {
  return api.value!.delete<Response<any>>(`/api/Certifications/${id}`)
}

const getCertificationById = (id: number) => {
  return api.value!.get<Response<Certification>>(`/api/Certifications/${id}`)
}

const getCurrentUserCertifications = () => {
  return api.value!.get<Response<Certification[]>>('/api/Certifications/me')
}

export {
  createCertification,
  updateCertification,
  getAllCertifications,
  deleteCertification,
  getCertificationById,
  getCurrentUserCertifications
}
