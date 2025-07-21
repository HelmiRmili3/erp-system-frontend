import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

// Placeholder types - adjust according to your actual models
interface Role {
  id: number
  name: string
  // Add other role properties
}

interface Permission {
  id: number
  name: string
  // Add other permission properties
}

interface User {
  id: number
  // Add other user properties
}

interface RolePermissions {
  role: Role
  permissions: Permission[]
}

const createRole = (data: Partial<Role>) => {
  return api.value!.post<Response<Role>>('/api/Admin/create-role', data)
}

const assignPermissionsToRole = (data: { roleId: number; permissionIds: number[] }) => {
  return api.value!.post<Response<any>>('/api/Admin/assign-permissions-to-role', data)
}

const assignRolesToUser = (data: { userId: number; roleIds: number[] }) => {
  return api.value!.post<Response<any>>('/api/Admin/assign-roles-to-user', data)
}

const removePermissionsFromRole = (data: { roleId: number; permissionIds: number[] }) => {
  return api.value!.delete<Response<any>>('/api/Admin/remove-permissions-from-role', data)
}

const deleteRole = (roleId: number) => {
  return api.value!.delete<Response<any>>('/api/Admin/role', { params: { roleId } })
}

const getAllPermissions = () => {
  return api.value!.get<Response<Permission[]>>('/api/Admin/permissions')
}

const getAllRoles = () => {
  return api.value!.get<Response<Role[]>>('/api/Admin/roles')
}

const getRolesWithPermissions = () => {
  return api.value!.get<Response<RolePermissions[]>>('/api/Admin/rolesPermissions')
}

const getAllUsers = () => {
  return api.value!.get<Response<User[]>>('/api/Admin/users')
}

export {
  createRole,
  assignPermissionsToRole,
  assignRolesToUser,
  removePermissionsFromRole,
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getRolesWithPermissions,
  getAllUsers
}
