import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Payroll } from '@/models/payroll.model'
import {
  createPayroll,
  updatePayroll,
  getAllPayrolls,
  deletePayroll,
  getPayrollById,
  getCurrentUserPayrolls
} from '@/services/payroll.service'

export const usePayrollsStore = defineStore('payrolls', () => {
  const payrolls = ref<Payroll[]>([])
  const loading = ref(false)

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
      const response2 = await getAllPayrolls()
      payrolls.value = response2.data.data
      return updatedPayroll
    } catch (error) {
      console.error('Error updating payroll:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Fetch all payrolls
  const fetchPayrolls = async () => {
    loading.value = true
    try {
      const response = await getAllPayrolls()
      payrolls.value = response.data.data
    } catch (error) {
      console.error('Error fetching payrolls:', error)
    } finally {
      loading.value = false
    }
  }

  // Delete a payroll
  const removePayroll = async (id: number) => {
    loading.value = true
    try {
      await deletePayroll(id)
      const response2 = await getAllPayrolls()
      payrolls.value = response2.data.data
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

  // Fetch current user's payrolls
  const fetchCurrentUserPayrolls = async () => {
    loading.value = true
    try {
      const response = await getCurrentUserPayrolls()
      payrolls.value = response.data.data
    } catch (error) {
      console.error('Error fetching current user payrolls:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    payrolls,
    loading,
    addPayroll,
    editPayroll,
    fetchPayrolls,
    removePayroll,
    getPayroll,
    fetchCurrentUserPayrolls
  }
})
