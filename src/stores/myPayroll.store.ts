import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Payroll } from '@/models/payroll.model'
import {
  createPayroll,
  updatePayroll,
  deletePayroll,
  getPayrollById,
  getCurrentUserPayrolls
} from '@/services/payroll.service'

export const useMyPayrollsStore = defineStore('payrolls', () => {
  const payrolls = ref<Payroll[]>([])
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
    {
      await fetchCurrentUserPayrolls()
    }
  }

  // Create a new payroll
  const addPayroll = async (data: Partial<Payroll>) => {
    loading.value = true
    try {
      const response = await createPayroll(data)
      payrolls.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error creating payroll:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an existing payroll
  const editPayroll = async (data: Partial<Payroll>) => {
    loading.value = true
    try {
      const response = await updatePayroll(data)
      const updatedPayroll = response.data.data
      const index = payrolls.value.findIndex((payroll) => payroll.id === updatedPayroll.id)
      if (index !== -1) {
        payrolls.value[index] = updatedPayroll
      }
      await fetchCurrentUserPayrolls() // Refresh the list to ensure pagination consistency
      return updatedPayroll
    } catch (error) {
      console.error('Error updating payroll:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete a payroll
  const removePayroll = async (id: number) => {
    loading.value = true
    try {
      await deletePayroll(id)
      await fetchCurrentUserPayrolls() // Refresh the list to ensure pagination consistency
      return true
    } catch (error) {
      console.error('Error deleting payroll:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // Get a payroll by ID
  const getPayroll = async (id: number) => {
    try {
      const response = await getPayrollById(id)
      return response.data.data
    } catch (error) {
      console.error('Error fetching payroll:', error)
      return null
    }
  }

  // Fetch current user's payrolls with pagination and search
  const fetchCurrentUserPayrolls = async () => {
    loading.value = true
    try {
      const response = await getCurrentUserPayrolls({
        page: currentPage.value,
        perPage: pageSize.value,
        search: searchQuery.value
      })
      payrolls.value = response.data.data
      totalRecords.value = response.data.recordsTotal || response.data.data.length
    } catch (error) {
      console.error('Error fetching current user payrolls:', error)
      payrolls.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  return {
    payrolls,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    searchQuery,
    setPageAndSize,
    addPayroll,
    editPayroll,
    removePayroll,
    getPayroll,
    fetchCurrentUserPayrolls
  }
})
