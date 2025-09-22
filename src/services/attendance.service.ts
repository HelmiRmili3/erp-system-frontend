import type { Attendance } from '@/models/attendance.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

const markAttendance = (data: Partial<Attendance>) => {
  return api.post<Response<Attendance>>('/api/Attendances/mark', data)
}

const deleteAttendance = (id: number) => {
  return api.delete<Response<any>>(`/api/Attendances/${id}`)
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
