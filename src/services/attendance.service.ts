import type { Attendance } from '@/models/attendance.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

const markAttendance = (data: Partial<Attendance>) => {
  const reposne = api.post<Response<Attendance>>('Attendances/mark', data)
  console.log(reposne)
  return reposne
}

const deleteAttendance = (id: number) => {
  return api.delete<Response<any>>(`Attendances/${id}`)
}

const getAllAttendances = (currentPage: number, pageSize: number, search?: string) => {
  return api.get<Response<Attendance[]>>('Attendances', {
    params: { PageNumber: currentPage, PageSize: pageSize, search }
  })
}

const getCurrentUserAttendances = (currentPage: number, pageSize: number, search?: string) => {
  return api.get<Response<Attendance[]>>('Attendances/me', {
    params: { PageNumber: currentPage, PageSize: pageSize, search }
  })
}

export { markAttendance, deleteAttendance, getAllAttendances, getCurrentUserAttendances }
