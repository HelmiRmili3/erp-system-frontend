import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Certification } from '@/models/certification.model'
import {
  updateCertification,
  deleteCertification,
  getCertificationById,
  getCurrentUserCertifications
} from '@/services/certification.service'

export const useMyCertificationsStore = defineStore('certifications', () => {
  const certifications = ref<Certification[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalRecords = ref(0)
  const searchQuery = ref('')

  // Set page, size, and search query, then fetch data
  const setPageAndSize = async (page: number, perPage: number, search: string = '') => {
    currentPage.value = page
    pageSize.value = perPage
    searchQuery.value = search
    await fetchCurrentUserCertifications()
  }

  // Fetch current user's certifications with pagination and search
  const fetchCurrentUserCertifications = async (
    page?: number,
    pageSize?: number,
    search?: string
  ) => {
    loading.value = true
    try {
      // Use provided parameters or fall back to store values
      const actualPage = page || currentPage.value
      const actualPageSize = pageSize
      const actualSearch = search !== undefined ? search : searchQuery.value

      const response = await getCurrentUserCertifications({
        page: actualPage,
        perPage: actualPageSize,
        search: actualSearch
      })

      certifications.value = response.data.data
      totalRecords.value = response.data.recordsTotal || response.data.data.length

      // Update store values if parameters were provided
    } catch (error) {
      console.error('Error fetching current user certifications:', error)
      certifications.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  // Update an existing certification
  const editCertification = async (data: Partial<Certification>) => {
    loading.value = true
    try {
      const response = await updateCertification(data)
      const updatedCertification = response.data.data
      const index = certifications.value.findIndex((cert) => cert.id === updatedCertification.id)
      if (index !== -1) {
        certifications.value[index] = updatedCertification
      }
      return updatedCertification
    } catch (error) {
      console.error('Error updating certification:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete a certification
  const removeCertification = async (id: number) => {
    loading.value = true
    try {
      await deleteCertification(id)
      certifications.value = certifications.value.filter((cert) => cert.id !== id)
      return true
    } catch (error) {
      console.error('Error deleting certification:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // Get a certification by ID
  const getCertification = async (id: number) => {
    try {
      const response = await getCertificationById(id)
      return response.data.data
    } catch (error) {
      console.error('Error fetching certification:', error)
      return null
    }
  }

  return {
    certifications,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    searchQuery,
    setPageAndSize,
    editCertification,
    removeCertification,
    getCertification,
    fetchCurrentUserCertifications
  }
})
