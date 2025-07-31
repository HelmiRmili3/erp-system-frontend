import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Permission, RolePermissions } from '@/models/admin.model'
import {
  getRolesWithPermissions,
  getAllPermissions,
  createRole,
  assignPermissionsToRole,
  removePermissionsFromRole,
  deleteRole
} from '@/services/admin.service'

export const useRolesPermissionsStore = defineStore('rolesPermissions', () => {
  const rolesPermissions = ref<RolePermissions[]>([])
  const permissions = ref<Permission[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalRecords = ref(0)

  /* ---------- Pagination ---------- */
  const setPageAndSize = async (page: number, size: number) => {
    currentPage.value = page
    pageSize.value = size
    await fetchRolesWithPermissions(page, size)
  }

  const fetchRolesWithPermissions = async (
    page: number = currentPage.value,
    size: number = pageSize.value
  ) => {
    loading.value = true
    try {
      const { data } = await getRolesWithPermissions(page, size)
      rolesPermissions.value = data.data
      totalRecords.value = data.recordsTotal
      currentPage.value = data.pageNumber
      pageSize.value = data.pageSize
    } finally {
      loading.value = false
    }
  }

  /* ---------- Permissions list ---------- */
  const fetchPermissions = async () => {
    const { data } = await getAllPermissions()
    permissions.value = data.data
  }

  /* ---------- CRUD ---------- */
  const addRole = async (name: string, permissions: string[]) => {
    console.log('role : ', name)
    const reponse = await createRole({ name: name }).then(async () => {
      console.log('permissions : ', name)
      const da = await assignPermissions(name, permissions)
      console.log('add permission result', da)
    })
    console.log('role response : ', reponse)
    await fetchRolesWithPermissions(currentPage.value, pageSize.value)
  }

  const removeRole = async (data: { role: string }) => {
    console.log('data :', data)
    const reponse = await deleteRole(data)
    console.log('response : ', reponse.data)

    await fetchRolesWithPermissions(currentPage.value, pageSize.value)
  }

  const assignPermissions = async (role: string, permissions: string[]) => {
    await assignPermissionsToRole({ role, permissions })
    await fetchRolesWithPermissions(currentPage.value, pageSize.value)
  }

  const removePermissions = async (role: string, permissions: string[]) => {
    await removePermissionsFromRole({ role, permissions })
    await fetchRolesWithPermissions(currentPage.value, pageSize.value)
  }

  /* ---------- init ---------- */
  const init = () => Promise.all([fetchRolesWithPermissions(), fetchPermissions()])

  return {
    rolesPermissions,
    permissions,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    init,
    setPageAndSize,
    fetchRolesWithPermissions,
    fetchPermissions,
    addRole,
    removeRole,
    assignPermissions,
    removePermissions
  }
})
