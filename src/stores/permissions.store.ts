import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Permission } from '@/models/permission.model'
import {
  getAllPermissions,
  assignPermissionsToRole,
  removePermissionsFromRole
} from '@/services/permissions.service'

export const usePermissionsStore = defineStore('permissions', () => {
  const permissions = ref<Permission[]>([])
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
    await fetchAllPermissions(page, size, search)
  }

  // Fetch all permissions with pagination and search
  const fetchAllPermissions = async (
    page: number = currentPage.value,
    size: number = pageSize.value,
    search: string = searchQuery.value
  ) => {
    loading.value = true
    try {
      const response = await getAllPermissions({
        page,
        perPage: size,
        search
      })
      console.log('response : ', response)
      permissions.value = response.data.data
      totalRecords.value = response.data.recordsTotal || response.data.data.length
    } catch (error) {
      console.error('Error fetching permissions:', error)
      permissions.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  // Assign permissions to a role
  const assignToRole = async (data: { role: string; permissions: string[] }) => {
    loading.value = true
    try {
      await assignPermissionsToRole(data)
      return true
    } catch (error) {
      console.error('Error assigning permissions:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // Remove permissions from a role
  const removeFromRole = async (data: { role: string; permissions: string[] }) => {
    loading.value = true
    try {
      await removePermissionsFromRole(data)
      return true
    } catch (error) {
      console.error('Error removing permissions:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    permissions,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    searchQuery,
    setPageAndSize,
    fetchAllPermissions,
    assignToRole,
    removeFromRole
  }
})
