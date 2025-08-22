import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Role, User, RolePermissions } from '@/models/admin.model'
import {
  createRole,
  assignRolesToUser,
  deleteRole,
  getAllRoles,
  getRolesWithPermissions,
  getAllUsers
} from '@/services/admin.service'

export const useAdminStore = defineStore('admin', () => {
  const roles = ref<Role[]>([])
  const users = ref<User[]>([])
  const rolesPermissions = ref<RolePermissions[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalRecords = ref(0)

  /* ---------- Users ---------- */
  const fetchUsers = async (
    page: number = currentPage.value,
    size: number = pageSize.value,
    search?: string
  ) => {
    loading.value = true
    try {
      const { data } = await getAllUsers(page, size, search)
      users.value = data.data || []
      totalRecords.value = data.recordsFiltered ?? data.recordsTotal ?? 0
      currentPage.value = data.pageNumber
      pageSize.value = data.pageSize
    } catch (e) {
      console.error(e)
      users.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  const setPageAndSize = async (page: number, size: number) => {
    currentPage.value = page
    pageSize.value = size
    await fetchUsers(page, size)
  }

  /* ---------- Roles ---------- */
  const fetchRoles = async () => {
    loading.value = true
    try {
      roles.value = (await getAllRoles()).data.data
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // /* ---------- Permissions ---------- */
  // const fetchPermissions = async () => {
  //   loading.value = true
  //   try {
  //     permissions.value = (await getAllPermissions()).data.data
  //   } catch (e) {
  //     console.error(e)
  //   } finally {
  //     loading.value = false
  //   }
  // }

  /* ---------- Roles + Permissions ---------- */
  const fetchRolesWithPermissions = async () => {
    loading.value = true
    try {
      rolesPermissions.value = (await getRolesWithPermissions()).data.data
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  /* ---------- Mutations ---------- */
  const addRole = (d: { name: string }) => createRole(d).then((r) => r.data.data)
  const removeRole = (name: string) => deleteRole({ role: name })

  const assignRoles = (d: { userId: string; roleIds: string[] }) =>
    assignRolesToUser(d).then((r) => r.data.data)
  // const removePermissions = (d: { role: string; permissions: string[] }) =>
  //   removePermissionsFromRole(d).then((r) => r.data)

  return {
    roles,
    users,
    rolesPermissions,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    fetchRoles,
    fetchUsers,
    setPageAndSize,
    fetchRolesWithPermissions,
    addRole,
    assignRoles,
    removeRole
  }
})
