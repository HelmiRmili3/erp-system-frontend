import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Attendance } from '@/models/attendance.model'
import {
  markAttendance,
  deleteAttendance,
  getAllAttendances,
  getCurrentUserAttendances
} from '@/services/attendance.service'

export const useAttendancesStore = defineStore('attendances', () => {
  const attendances = ref<Attendance[]>([])
  const loading = ref(false)

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

  // Fetch all attendances
  const fetchAttendances = async () => {
    loading.value = true
    try {
      const response = await getAllAttendances()
      attendances.value = response.data.data
    } catch (error) {
      console.error('Error fetching attendances:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch current user's attendance history
  const fetchCurrentUserAttendances = async () => {
    loading.value = true
    try {
      const response = await getCurrentUserAttendances()
      attendances.value = response.data.data
    } catch (error) {
      console.error('Error fetching current user attendances:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    attendances,
    loading,
    addAttendance,
    removeAttendance,
    fetchAttendances,
    fetchCurrentUserAttendances
  }
})
