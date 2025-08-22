import type { Role, RolePermissions, User } from '@/models/admin.model'
import type { Response } from '@/models/response'
import { api } from '@/plugins/axios'

/* GET */
const getAllUsers = (page: number = 1, pageSize: number = 10, search?: string) =>
  api.value!.get<Response<User[]>>('Admin/users', {
    params: { PageNumber: page, PageSize: pageSize, search }
  })

const getAllRoles = () => api.value!.get<Response<Role[]>>('Admin/roles')
const getRolesWithPermissions = (page: number = 1, pageSize: number = 10) =>
  api.value!.get<Response<RolePermissions[]>>('Admin/rolesPermissions', {
    params: { PageNumber: page, PageSize: pageSize }
  })

/* POST / PUT */
const createRole = (data: { name: string }) =>
  api.value!.post<Response<Role>>('Admin/create-role', data)

const assignRolesToUser = (data: { userId: string; roleIds: string[] }) =>
  api.value!.post<Response<any>>('Admin/assign-roles-to-user', data)

const deleteRole = (data: { role: string }) =>
  api.value!.delete<Response<any>>('Admin/role', { data })

export {
  createRole,
  assignRolesToUser,
  deleteRole,
  getAllRoles,
  getRolesWithPermissions,
  getAllUsers
}
