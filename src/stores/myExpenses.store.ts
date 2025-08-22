import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CreateExpense, Expense } from '@/models/expense.model'
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseById,
  getCurrentUserExpenses
} from '@/services/expense.service'

export const useMyExpensesStore = defineStore('myexpenses', () => {
  const expenses = ref<Expense[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalRecords = ref(0)
  const searchQuery = ref('')

  // Set page, size, and search query, then fetch data
  const setPageAndSize = async (page: number, size: number, search: string = '') => {
    currentPage.value = page
    pageSize.value = size
    searchQuery.value = search
    await fetchCurrentUserExpenses(page, size)
  }

  // Create a new expense
  const addExpense = async (data: CreateExpense) => {
    loading.value = true
    try {
      const response = await createExpense(data)
      expenses.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error creating expense:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an existing expense
  const editExpense = async (data: Partial<Expense>) => {
    loading.value = true
    try {
      const response = await updateExpense(data)
      const updatedExpense = response.data.data
      const index = expenses.value.findIndex((exp) => exp.id === updatedExpense.id)
      if (index !== -1) {
        expenses.value[index] = updatedExpense
      }
      return updatedExpense
    } catch (error) {
      console.error('Error updating expense:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete an expense
  const removeExpense = async (id: number) => {
    loading.value = true
    try {
      await deleteExpense(id)
      expenses.value = expenses.value.filter((exp) => exp.id !== id)
      return true
    } catch (error) {
      console.error('Error deleting expense:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // Get an expense by ID
  const getExpense = async (id: number) => {
    try {
      const response = await getExpenseById(id)
      return response.data.data
    } catch (error) {
      console.error('Error fetching expense:', error)
      return null
    }
  }

  // Fetch current user's expenses with pagination and search
  const fetchCurrentUserExpenses = async (
    page: number = currentPage.value,
    size: number = pageSize.value
  ) => {
    loading.value = true
    try {
      const response = await getCurrentUserExpenses(page, size)
      expenses.value = response.data.data
      totalRecords.value = response.data.recordsTotal || response.data.data.length
    } catch (error) {
      console.error('Error fetching current user expenses:', error)
      expenses.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  return {
    expenses,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    searchQuery,
    setPageAndSize,
    addExpense,
    editExpense,
    removeExpense,
    getExpense,
    fetchCurrentUserExpenses
  }
})
