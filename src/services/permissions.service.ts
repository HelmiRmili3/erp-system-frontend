import type { Permission } from '@/models/permission.model'
import { api } from '@/plugins/axios'
import type { Response } from '@/models/response'

interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
}

const getAllPermissions = (params: PaginationParams = {}) =>
  api.value!.get<Response<Permission[]>>('Admin/permissions', {
    params: {
      PageNumber: params.page,
      PageSize: params.perPage,
      search: params.search
    }
  })

const assignPermissionsToRole = (data: { role: string; permissions: string[] }) => {
  api.value!.post<Response<any>>('Admin/assign-permissions-to-role', data)
}
const removePermissionsFromRole = (data: { role: string; permissions: string[] }) => {
  api.value!.delete<Response<any>>('Admin/remove-permissions-from-role', { data })
}
export { assignPermissionsToRole, removePermissionsFromRole, getAllPermissions }
