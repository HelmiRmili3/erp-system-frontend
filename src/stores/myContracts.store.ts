import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Contract } from '@/models/contract.model'
import {
  createContract,
  updateContract,
  deleteContract,
  getContractById,
  getCurrentUserContracts
} from '@/services/contract.service'

export const useMyContractsStore = defineStore('contracts', () => {
  const contracts = ref<Contract[]>([])
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
    await fetchUserContracts()
  }

  // Create a new contract
  const addContract = async (data: FormData) => {
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

  // Fetch current user's contracts with pagination and search
  const fetchUserContracts = async () => {
    loading.value = true
    try {
      const response = await getCurrentUserContracts({
        page: currentPage.value,
        perPage: pageSize.value,
        search: searchQuery.value
      })
      contracts.value = response.data.data
      totalRecords.value = response.data.recordsTotal || response.data.data.length
    } catch (error) {
      console.error('Error fetching current user contracts:', error)
      contracts.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  return {
    contracts,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    searchQuery,
    setPageAndSize,
    addContract,
    editContract,
    removeContract,
    getContract,
    fetchUserContracts
  }
})
