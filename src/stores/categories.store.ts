import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category } from '@/models/Category.model'
import { getCategories, getCategory } from '@/services/Category.service'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)

  // Get all root categories (categories without parent)
  const rootCategories = computed(() => {
    console.log('Fetching root categories...', categories.value)
    return categories.value.filter(cat => !cat.parentCategoryId)
  })

  // Get subcategories for a given parent category ID
  const getSubcategories = (parentId: number) => {
    return categories.value.filter(cat => cat.parentCategoryId === parentId)
  }

  // Fetch all categories from the API
  const fetchCategories = async () => {
    loading.value = true
    try {
      const response = await getCategories()
      console.log('Fetched categories:', response.data.data)
      categories.value = response.data.data
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      loading.value = false
    }
  }

  // Get a category by ID
  const getCategoryById = async (id: number) => {
    try {
      const response = await getCategory(id.toString())
      return response.data.data
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  }

  return {
    categories,
    loading,
    rootCategories,
    getSubcategories,
    fetchCategories,
    getCategoryById
  }
}) 