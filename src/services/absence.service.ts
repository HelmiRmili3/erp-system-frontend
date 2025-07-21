import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

// Placeholder type for Absence - adjust according to your actual model
interface Absence {
  id: number
  // Add other absence properties as needed
}

const getAllAbsences = () => {
  return api.value!.get<Response<Absence[]>>('/api/Absences')
}

const getAbsenceById = (id: number) => {
  return api.value!.get<Response<Absence>>(`/api/Absences/${id}`)
}

const createAbsence = (data: Partial<Absence>) => {
  return api.value!.post<Response<Absence>>('/api/Absences', data)
}

const updateAbsence = (id: number, data: Partial<Absence>) => {
  return api.value!.put<Response<Absence>>(`/api/Absences/${id}`, data)
}

const deleteAbsence = (id: number) => {
  return api.value!.delete<Response<any>>(`/api/Absences/${id}`)
}

const getCurrentUserAbsences = () => {
  return api.value!.get<Response<Absence[]>>('/api/Absences/me')
}

export {
  getAllAbsences,
  getAbsenceById,
  createAbsence,
  updateAbsence,
  deleteAbsence,
  getCurrentUserAbsences
}
