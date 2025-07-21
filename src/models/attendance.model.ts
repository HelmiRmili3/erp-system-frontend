export interface Attendance {
  id: number
  userId: string
  attendanceDay: string
  checkIn: string | null
  checkInMethod: number | null
  checkInLatitude: number | null
  checkInLongitude: number | null
  checkInDeviceId: string | null
  checkInIpAddress: string | null
  isCheckInByAdmin: boolean
  checkOut: string | null
  checkOutMethod: number | null
  checkOutLatitude: number | null
  checkOutLongitude: number | null
  checkOutDeviceId: string | null
  checkOutIpAddress: string | null
  isCheckOutByAdmin: boolean
}
