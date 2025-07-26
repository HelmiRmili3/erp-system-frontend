// services/absence.service.ts
import type { Absence, CreateAbsence, UpdateAbsence } from '@/models/absence.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

/* ----------------------------------------------------------
 * Admin endpoints
 * ---------------------------------------------------------- */
const getAllAbsences = (currentPage: number, pageSize: number, search?: string) => {
  return api.value!.get<Response<Absence[]>>('Absences', {
    params: { PageNumber: currentPage, PageSize: pageSize, search }
  })
}

const getAbsenceById = (id: number) => api.value!.get<Response<Absence>>(`Absences/${id}`)

/* ----------------------------------------------------------
 * User endpoints
 * ---------------------------------------------------------- */
const getCurrentUserAbsences = (currentPage: number, pageSize: number, search?: string) =>
  api.value!.get<Response<Absence[]>>('Absences/me', {
    params: { PageNumber: currentPage, PageSize: pageSize, search }
  })

const createAbsence = (data: CreateAbsence) => api.value!.post<Response<Absence>>('Absences', data)

const updateAbsence = (id: number, data: UpdateAbsence) =>
  api.value!.put<Response<Absence>>(`Absences/${id}`, data)

const deleteAbsence = (id: number) => api.value!.delete<Response<any>>(`Absences/${id}`)

export {
  getAllAbsences,
  getAbsenceById,
  createAbsence,
  updateAbsence,
  deleteAbsence,
  getCurrentUserAbsences
}
