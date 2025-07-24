import type { Directive } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import type { Permission } from '@/permissions'

export const permissionDirective: Directive = {
  mounted(el, binding) {
    const { hasPermission } = usePermissions()
    const permission: Permission = binding.value

    if (!hasPermission(permission)) {
      el.parentNode?.removeChild(el)
    }
  }
}
