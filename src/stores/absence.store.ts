// stores/absence.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Absence } from '@/models/absence.model'
import {
  getAllAbsences,
  acceptAbsence as acceptAbsenceService,
  rejectAbsence as rejectAbsenceService
} from '@/services/absence.service'

export const useAbsencesStore = defineStore('absences', () => {
  const absences = ref<Absence[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalRecords = ref(0)
  const searchQuery = ref('')

  const setPageAndSize = async (page: number, size: number, search: string = '') => {
    currentPage.value = page
    pageSize.value = size
    searchQuery.value = search

    await fetchAbsences(page, size)
  }
  /* ----------------------------------------------------------
   * Fetch all absences with server-side pagination
   * ---------------------------------------------------------- */
  const fetchAbsences = async (page: number = currentPage.value, size: number = pageSize.value) => {
    loading.value = true
    try {
      const response = await getAllAbsences(page, size)
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
   * Approve / Reject Absences
   * ---------------------------------------------------------- */
  const acceptAbsence = async (id: string) => {
    try {
      await acceptAbsenceService(id)
      await fetchAbsences()
    } catch (e) {
      console.error('Failed to accept absence', e)
    }
  }

  const rejectAbsence = async (id: string) => {
    try {
      await rejectAbsenceService(id)
      await fetchAbsences()
    } catch (e) {
      console.error('Failed to reject absence', e)
    }
  }

  /* ---------------------------------------------------------- */
  return {
    absences,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    fetchAbsences,
    setPageAndSize,
    acceptAbsence,
    rejectAbsence
  }
})
