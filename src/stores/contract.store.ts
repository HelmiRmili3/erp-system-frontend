import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Contract } from '@/models/contract.model'
import {
  createContract,
  updateContract,
  getAllContracts,
  deleteContract,
  getContractById,
  getCurrentUserContracts
} from '@/services/contract.service'

export const useContractsStore = defineStore('contracts', () => {
  const contracts = ref<Contract[]>([])
  const loading = ref(false)

  // Create a new contract
  const addContract = async (data: Partial<Contract>) => {
    loading.value = true
    try {
      const response = await createContract(data)
      contracts.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error creating contract:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an existing contract
  const editContract = async (data: Partial<Contract>) => {
    loading.value = true
    try {
      const response = await updateContract(data)
      const updatedContract = response.data.data
      const index = contracts.value.findIndex((cont) => cont.id === updatedContract.id)
      if (index !== -1) {
        contracts.value[index] = updatedContract
      }
      return updatedContract
    } catch (error) {
      console.error('Error updating contract:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Fetch all contracts
  const fetchContracts = async () => {
    loading.value = true
    try {
      const response = await getAllContracts()
      contracts.value = response.data.data
    } catch (error) {
      console.error('Error fetching contracts:', error)
    } finally {
      loading.value = false
    }
  }

  // Delete a contract
  const removeContract = async (id: number) => {
    loading.value = true
    try {
      await deleteContract(id)
      contracts.value = contracts.value.filter((cont) => cont.id !== id)
      return true
    } catch (error) {
      console.error('Error deleting contract:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // Get a contract by ID
  const getContract = async (id: number) => {
    try {
      const response = await getContractById(id)
      return response.data.data
    } catch (error) {
      console.error('Error fetching contract:', error)
      return null
    }
  }

  // Fetch current user's contracts
  const fetchCurrentUserContracts = async () => {
    loading.value = true
    try {
      const response = await getCurrentUserContracts()
      contracts.value = response.data.data
    } catch (error) {
      console.error('Error fetching current user contracts:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    contracts,
    loading,
    addContract,
    editContract,
    fetchContracts,
    removeContract,
    getContract,
    fetchCurrentUserContracts
  }
})
