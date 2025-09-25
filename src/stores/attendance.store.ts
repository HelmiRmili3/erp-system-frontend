import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Attendance } from '@/models/attendance.model'
import { deleteAttendance, getAllAttendances } from '@/services/attendance.service'

export const useAttendancesStore = defineStore('attendances', () => {
  const attendances = ref<Attendance[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalRecords = ref(0)
  const searchQuery = ref<string>('')

  // Delete an attendance record
  const removeAttendance = async (id: number) => {
    loading.value = true
    try {
      await deleteAttendance(id)
      attendances.value = attendances.value.filter((att) => att.id !== id)
      return true
    } catch (error) {
      console.error('Error deleting attendance:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // Set pagination parameters
  const setPageAndSize = async (page: number, size: number, search: string = '') => {
    currentPage.value = page
    pageSize.value = size
    searchQuery.value = search
    await fetchAttendances()
  }

  // Fetch all attendances with pagination
  const fetchAttendances = async () => {
    loading.value = true
    try {
      const response = await getAllAttendances(currentPage.value, pageSize.value, searchQuery.value)
      attendances.value = response.data.data
      totalRecords.value = response.data.recordsTotal || response.data.data.length
    } catch (error) {
      console.error('Error fetching attendances:', error)
      attendances.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  return {
    attendances,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    searchQuery,
    removeAttendance,
    setPageAndSize,
    fetchAttendances
  }
})
