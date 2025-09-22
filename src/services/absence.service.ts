// services/absence.service.ts
import type { Absence, CreateAbsence, UpdateAbsence } from '@/models/absence.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

/* ----------------------------------------------------------
 * Admin endpoints
 * ---------------------------------------------------------- */
const getAllAbsences = (currentPage: number, pageSize: number, search?: string) => {
  return api.get<Response<Absence[]>>('Absences', {
    params: { PageNumber: currentPage, PageSize: pageSize, search }
  })
}
const getAbsenceById = (id: number) => api.get<Response<Absence>>(`Absences/${id}`)
const acceptAbsence = (id: string) => api.put<Response<Absence>>(`Absences/${id}/accept`)
const rejectAbsence = (id: string) => api.put<Response<Absence>>(`Absences/${id}/reject`)

/* ----------------------------------------------------------
 * User endpoints
 * ---------------------------------------------------------- */
const getCurrentUserAbsences = (currentPage: number, pageSize: number, search?: string) =>
  api.get<Response<Absence[]>>('Absences/me', {
    params: { PageNumber: currentPage, PageSize: pageSize, search }
  })
const createAbsence = (data: CreateAbsence) => api.post<Response<Absence>>('Absences', data)

const updateAbsence = (id: number, data: UpdateAbsence) =>
  api.put<Response<Absence>>(`Absences/${id}`, data)
const deleteAbsence = (id: number) => api.delete<Response<any>>(`Absences/${id}`)

export {
  getAllAbsences,
  getAbsenceById,
  createAbsence,
  updateAbsence,
  deleteAbsence,
  getCurrentUserAbsences,
  acceptAbsence,
  rejectAbsence
}
