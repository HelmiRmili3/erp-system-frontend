import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import type { Role, Permission } from '@/permissions'

export function usePermissions() {
  const authStore = useAuthStore()

  const userRoles = computed(() => authStore.user?.roles || [])
  const userPermissions = computed(() => authStore.user?.permissions || [])

  const hasRole = (role: Role): boolean => {
    return userRoles.value.includes(role)
  }

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.value.includes(permission)
  }

  return {
    hasRole,
    hasPermission,
    userRoles,
    userPermissions
  }
}
