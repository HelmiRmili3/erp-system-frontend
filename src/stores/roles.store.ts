import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Permission, RolePermissions } from '@/models/admin.model'
import { getRolesWithPermissions, createRole, deleteRole } from '@/services/admin.service'
import {
  assignPermissionsToRole,
  getAllPermissions,
  removePermissionsFromRole
} from '@/services/permissions.service'

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

  /* ---------- Permissions list (fetch all with perPage=50) ---------- */
  const fetchPermissions = async (perPage = 50) => {
    const all: Permission[] = []
    let page = 1
    // loop until the last page
    // expects getAllPermissions({ page, perPage, search? })
    // and response.data.data is the array of permissions
    // and stops when returned count < perPage
    // (adjust field names if your API differs)
    // No global loading flip to avoid UI flicker while roles load
    // If you want, you can add a dedicated loading flag for permissions.
    // For now we keep it simple.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data } = await getAllPermissions({ page, perPage, search: '' })
      const chunk: Permission[] = data.data || []
      all.push(...chunk)
      if (chunk.length < perPage) break
      page += 1
    }
    permissions.value = all
  }

  /* ---------- CRUD ---------- */
  const addRole = async (name: string, perms: string[]) => {
    await createRole({ name })
    if (perms?.length) {
      await assignPermissions(name, perms)
    } else {
      // ensure table reflects new role even if no perms assigned initially
      await fetchRolesWithPermissions(currentPage.value, pageSize.value)
    }
  }

  const removeRole = async (data: { role: string }) => {
    await deleteRole(data)
    await fetchRolesWithPermissions(currentPage.value, pageSize.value)
  }

  const assignPermissions = async (role: string, perms: string[]) => {
    await assignPermissionsToRole({ role, permissions: perms })
    await fetchRolesWithPermissions(currentPage.value, pageSize.value)
  }

  const removePermissions = async (role: string, perms: string[]) => {
    await removePermissionsFromRole({ role, permissions: perms })
    await fetchRolesWithPermissions(currentPage.value, pageSize.value)
  }

  /* ---------- init ---------- */
  const init = () => Promise.all([fetchRolesWithPermissions(), fetchPermissions(50)])

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
