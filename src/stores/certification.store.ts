import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Certification } from '@/models/certification.model'
import {
  createCertification,
  updateCertification,
  getAllCertifications,
  deleteCertification,
  getCertificationById,
  getCurrentUserCertifications
} from '@/services/certification.service'

export const useCertificationsStore = defineStore('certifications', () => {
  const certifications = ref<Certification[]>([])
  const loading = ref(false)

  // Create a new certification
  const addCertification = async (data: Partial<Certification>) => {
    loading.value = true
    try {
      const response = await createCertification(data)
      certifications.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error creating certification:', error)
      return null
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

  // Fetch all certifications
  const fetchCertifications = async () => {
    loading.value = true
    try {
      const response = await getAllCertifications()
      certifications.value = response.data.data
    } catch (error) {
      console.error('Error fetching certifications:', error)
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

  // Fetch current user's certifications
  const fetchCurrentUserCertifications = async () => {
    loading.value = true
    try {
      const response = await getCurrentUserCertifications()
      certifications.value = response.data.data
    } catch (error) {
      console.error('Error fetching current user certifications:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    certifications,
    loading,
    addCertification,
    editCertification,
    fetchCertifications,
    removeCertification,
    getCertification,
    fetchCurrentUserCertifications
  }
})
