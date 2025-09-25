import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Attendance } from '@/models/attendance.model'
import { markAttendance, getCurrentUserAttendances } from '@/services/attendance.service'

export const useMyAttendancesStore = defineStore('myattendances', () => {
  const attendances = ref<Attendance[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalRecords = ref(0)
  const searchQuery = ref<string>('')

  // Mark attendance
  const addAttendance = async (data: Partial<Attendance>) => {
    loading.value = true
    try {
      const response = await markAttendance(data)
      attendances.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error marking attendance:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Set pagination parameters
  const setPageAndSize = async (page: number, size: number, search: string = '') => {
    currentPage.value = page
    pageSize.value = size
    searchQuery.value = search
    await fetchCurrentUserAttendances()
  }

  // Fetch current user's attendance history with pagination
  const fetchCurrentUserAttendances = async () => {
    loading.value = true
    try {
      const response = await getCurrentUserAttendances(
        currentPage.value,
        pageSize.value,
        searchQuery.value
      )
      attendances.value = response.data.data
      totalRecords.value = response.data.recordsTotal || response.data.data.length // Adjust based on your API response
    } catch (error) {
      console.error('Error fetching current user attendances:', error)
      attendances.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }
  // Get the attendance record with the largest id
  const getLastAttendanceById = (): Attendance | null => {
    if (attendances.value.length === 0) return null
    return attendances.value.reduce((prev, curr) => (curr.id > prev.id ? curr : prev))
  }

  // Determine next operation: checkin or checkout
  const getNextOperation = (): 'checkin' | 'checkout' => {
    const last = getLastAttendanceById()

    // If no previous attendance exists → next operation is check-in
    if (!last) {
      return 'checkin'
    }

    // If last record has check-in but no check-out → next is check-out
    if (last.checkIn && !last.checkOut) {
      return 'checkout'
    }

    // Last record has both check-in and check-out → next is check-in
    return 'checkin'
  }

  return {
    attendances,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    searchQuery,
    addAttendance,
    setPageAndSize,
    fetchCurrentUserAttendances,
    getNextOperation
  }
})
