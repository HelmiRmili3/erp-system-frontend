import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Absence } from '@/models/absence.model'
import {
  getAllAbsences,
  getAbsenceById,
  createAbsence,
  updateAbsence,
  deleteAbsence,
  getCurrentUserAbsences
} from '@/services/absence.service'

export const useAbsencesStore = defineStore('absences', () => {
  const absences = ref<Absence[]>([])
  const loading = ref(false)

  // Fetch all absences from the API        Absences.Create
  const fetchAbsences = async () => {
    loading.value = true
    try {
      const response = await getAllAbsences()
      absences.value = response.data.data
    } catch (error) {
      console.error('Error fetching absences:', error)
    } finally {
      loading.value = false
    }
  }

  // Get an absence by ID
  const getAbsence = async (id: number) => {
    try {
      const response = await getAbsenceById(id)
      return response.data.data
    } catch (error) {
      console.error('Error fetching absence:', error)
      return null
    }
  }

  // Create a new absence
  const addAbsence = async (data: Partial<Absence>) => {
    loading.value = true
    try {
      const response = await createAbsence(data)
      absences.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error creating absence:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an existing absence
  const editAbsence = async (id: number, data: Partial<Absence>) => {
    loading.value = true
    try {
      const response = await updateAbsence(id, data)
      const updatedAbsence = response.data.data
      const index = absences.value.findIndex((abs) => abs.id === id)
      if (index !== -1) {
        absences.value[index] = updatedAbsence
      }
      return updatedAbsence
    } catch (error) {
      console.error('Error updating absence:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete an absence
  const removeAbsence = async (id: number) => {
    loading.value = true
    try {
      await deleteAbsence(id)
      absences.value = absences.value.filter((abs) => abs.id !== id)
      return true
    } catch (error) {
      console.error('Error deleting absence:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // Fetch current user's absences
  const fetchCurrentUserAbsences = async () => {
    loading.value = true
    try {
      const response = await getCurrentUserAbsences()
      absences.value = response.data.data
    } catch (error) {
      console.error('Error fetching current user absences:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    absences,
    loading,
    fetchAbsences,
    getAbsence,
    addAbsence,
    editAbsence,
    removeAbsence,
    fetchCurrentUserAbsences
  }
})
