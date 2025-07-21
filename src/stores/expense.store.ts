import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Expense } from '@/models/expense.model'
import {
  createExpense,
  updateExpense,
  getAllExpenses,
  deleteExpense,
  getExpenseById,
  getCurrentUserExpenses
} from '@/services/expense.service'

export const useExpensesStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([])
  const loading = ref(false)

  // Create a new expense
  const addExpense = async (data: Partial<Expense>) => {
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

  // Fetch all expenses
  const fetchExpenses = async () => {
    loading.value = true
    try {
      const response = await getAllExpenses()
      expenses.value = response.data.data
    } catch (error) {
      console.error('Error fetching expenses:', error)
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

  // Fetch current user's expenses
  const fetchCurrentUserExpenses = async () => {
    loading.value = true
    try {
      const response = await getCurrentUserExpenses()
      expenses.value = response.data.data
    } catch (error) {
      console.error('Error fetching current user expenses:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    expenses,
    loading,
    addExpense,
    editExpense,
    fetchExpenses,
    removeExpense,
    getExpense,
    fetchCurrentUserExpenses
  }
})
