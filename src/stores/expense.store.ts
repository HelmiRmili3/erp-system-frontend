import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Expense } from '@/models/expense.model'
import { updateExpense, getExpenseById, getAllExpenses } from '@/services/expense.service'

export const useExpensesStore = defineStore('expenses', () => {
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
    {
      await fetchAllExpenses(page, size)
    }
  }

  //  Update an existing expense
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

  // Fetch all expenses with pagination and search
  const fetchAllExpenses = async (
    page: number = currentPage.value,
    size: number = pageSize.value
  ) => {
    loading.value = true
    try {
      const response = await getAllExpenses(page, size)
      expenses.value = response.data.data
      totalRecords.value = response.data.recordsTotal || response.data.data.length
    } catch (error) {
      console.error('Error fetching expenses:', error)
      expenses.value = []
      totalRecords.value = 0
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

  return {
    expenses,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    searchQuery,
    setPageAndSize,
    editExpense,
    fetchAllExpenses,
    getExpense
  }
})
