import type { Attendance } from '@/models/attendance.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

const markAttendance = (data: Partial<Attendance>) => {
  return api.value!.post<Response<Attendance>>('/api/Attendances/mark', data)
}

const deleteAttendance = (id: number) => {
  return api.value!.delete<Response<any>>(`/api/Attendances/${id}`)
}

const getAllAttendances = () => {
  return api.value!.get<Response<Attendance[]>>('/api/Attendances')
}

const getCurrentUserAttendances = () => {
  return api.value!.get<Response<Attendance[]>>('/api/Attendances/me')
}

export { markAttendance, deleteAttendance, getAllAttendances, getCurrentUserAttendances }
