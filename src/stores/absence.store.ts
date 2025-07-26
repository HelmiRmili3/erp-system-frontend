// stores/absence.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Absence, CreateAbsence, UpdateAbsence } from '@/models/absence.model'
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
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalRecords = ref(0)

  /* ----------------------------------------------------------
   * Fetch current user’s absences with server-side pagination
   * ---------------------------------------------------------- */
  const fetchCurrentUserAbsences = async (
    page: number = currentPage.value,
    size: number = pageSize.value
    // search?: string
  ) => {
    loading.value = true
    try {
      const response = await getCurrentUserAbsences(page, size)
      const payload = response.data

      absences.value = payload.data || []
      totalRecords.value = payload.recordsFiltered ?? payload.recordsTotal ?? 0
      currentPage.value = payload.pageNumber
      pageSize.value = payload.pageSize
    } catch (e) {
      console.error(e)
      absences.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  /* ----------------------------------------------------------
   * Helper that both updates local state AND re-fetches
   * ---------------------------------------------------------- */
  const setPageAndSize = async (page: number, size: number) => {
    currentPage.value = page
    pageSize.value = size
    await fetchCurrentUserAbsences(page, size)
  }

  /* ----------------------------------------------------------
   * CRUD helpers (unchanged, just call the same refresh logic)
   * ---------------------------------------------------------- */
  const getAbsence = async (id: number) => {
    const { data } = await getAbsenceById(id)
    return data?.data ?? null
  }

  const addAbsence = async (payload: CreateAbsence) => {
    await createAbsence(payload)
    await fetchCurrentUserAbsences(currentPage.value, pageSize.value)
  }

  const editAbsence = async (id: number, payload: UpdateAbsence) => {
    await updateAbsence(id, payload)
    await fetchCurrentUserAbsences(currentPage.value, pageSize.value)
  }

  const removeAbsence = async (id: number) => {
    await deleteAbsence(id)
    await fetchCurrentUserAbsences(currentPage.value, pageSize.value)
  }

  /* ---------------------------------------------------------- */
  return {
    absences,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    fetchCurrentUserAbsences,
    setPageAndSize,
    getAbsence,
    addAbsence,
    editAbsence,
    removeAbsence,
    getAllAbsences
  }
})
