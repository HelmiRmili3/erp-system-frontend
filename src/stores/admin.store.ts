import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Role, Permission, User, RolePermissions } from '@/models/admin.model'
import {
  createRole,
  assignPermissionsToRole,
  assignRolesToUser,
  removePermissionsFromRole,
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getRolesWithPermissions,
  getAllUsers
} from '@/services/admin.service'

export const useAdminStore = defineStore('admin', () => {
  const roles = ref<Role[]>([])
  const permissions = ref<Permission[]>([])
  const users = ref<User[]>([])
  const rolesPermissions = ref<RolePermissions[]>([])
  const loading = ref(false)

  // Fetch all roles
  const fetchRoles = async () => {
    loading.value = true
    try {
      const response = await getAllRoles()
      roles.value = response.data.data
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch all permissions
  const fetchPermissions = async () => {
    loading.value = true
    try {
      const response = await getAllPermissions()
      permissions.value = response.data.data
    } catch (error) {
      console.error('Error fetching permissions:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch all users
  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await getAllUsers()
      users.value = response.data.data
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch roles with their permissions
  const fetchRolesWithPermissions = async () => {
    loading.value = true
    try {
      const response = await getRolesWithPermissions()
      rolesPermissions.value = response.data.data
    } catch (error) {
      console.error('Error fetching roles with permissions:', error)
    } finally {
      loading.value = false
    }
  }

  // Create a new role
  const addRole = async (data: Partial<Role>) => {
    loading.value = true
    try {
      const response = await createRole(data)
      roles.value.push(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error creating role:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Assign permissions to a role
  const assignPermissions = async (data: { roleId: string; permissionIds: string[] }) => {
    loading.value = true
    try {
      const response = await assignPermissionsToRole(data)
      return response.data.data
    } catch (error) {
      console.error('Error assigning permissions to role:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Assign roles to a user
  const assignRoles = async (data: { userId: string; roleIds: string[] }) => {
    loading.value = true
    try {
      const response = await assignRolesToUser(data)
      return response.data.data
    } catch (error) {
      console.error('Error assigning roles to user:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Remove permissions from a role
  const removePermissions = async (data: { roleId: string; permissionIds: string[] }) => {
    loading.value = true
    try {
      const response = await removePermissionsFromRole(data)
      return response.data
    } catch (error) {
      console.error('Error removing permissions from role:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete a role
  const removeRole = async (roleId: string) => {
    loading.value = true
    try {
      await deleteRole(roleId)
      return true
    } catch (error) {
      console.error('Error deleting role:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    roles,
    permissions,
    users,
    rolesPermissions,
    loading,
    fetchRoles,
    fetchPermissions,
    fetchUsers,
    fetchRolesWithPermissions,
    addRole,
    assignPermissions,
    assignRoles,
    removePermissions,
    removeRole
  }
})
