import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth.store'

interface MenuItem {
  title: string
  items: MenuItemItem[]
}

interface MenuItemItem {
  id: string
  label: string
  icon: string
  to: string
  permission?: string[]
  role?: string[]
}

export const useLayoutStore = defineStore('layoutStore', () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const storedNavbarState = JSON.parse(localStorage.getItem('isNavbarOpen') || 'false')
  const isNavbarOpen = ref(storedNavbarState || false)

  const rawMenuItems = ref<MenuItem[]>([
    {
      title: 'Home',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          to: '/admin/home',
          role: ['Administrator']
        }
      ]
    },
    {
      title: 'Manage',
      items: [
        {
          id: 'manage',
          label: 'Users',
          icon: 'users',
          to: '/admin/users',
          role: ['Administrator']
        }
      ]
    },
    {
      title: 'Categories',
      items: [
        {
          id: 'Absences',
          label: 'Absences',
          icon: 'eye',
          to: '/admin/absences',
          role: ['Administrator'],
          permission: ['Absences.View']
        },
        {
          id: 'Attendances',
          label: 'Attendances',
          icon: 'categories',
          to: '/admin/attendances',
          role: ['Administrator'],
          permission: ['Attendances.View']
        },
        {
          id: 'Contracts',
          label: 'Contracts',
          icon: 'contact',
          to: '/admin/contracts',
          role: ['Administrator'],
          permission: ['Contracts.View']
        },
        {
          id: 'Certifications',
          label: 'Certifications',
          icon: 'categories',
          to: '/admin/certifications',
          role: ['Administrator'],
          permission: ['Certifications.View']
        },
        {
          id: 'Expenses',
          label: 'Expenses',
          icon: 'extras',
          to: '/admin/expenses',
          role: ['Administrator'],
          permission: ['Expenses.View']
        },
        {
          id: 'Payrolls',
          label: 'Payrolls',
          icon: 'products',
          to: '/admin/payrolls',
          role: ['Administrator'],
          permission: ['Payrolls.View']
        }
      ]
    },
    {
      title: 'Roles & Permissions',
      items: [
        {
          id: 'roles',
          label: 'Roles',
          icon: 'settings',
          to: '/admin/roles',
          role: ['Administrator'],
          permission: ['Roles.View']
        },
        {
          id: 'permissions',
          label: 'Permissions',
          icon: 'settings',
          to: '/admin/permissions',
          role: ['Administrator'],
          permission: ['Roles.View']
        }
      ]
    },
    {
      title: 'Me',
      items: [
        {
          id: 'Absences',
          label: 'Absences',
          icon: 'categories',
          to: '/me/absences',
          role: ['Employee'],
          permission: ['Absences.View']
        },
        {
          id: 'Attendances',
          label: 'Attendances',
          icon: 'eye',
          to: '/me/attendances',
          role: ['Employee'],
          permission: ['Attendances.View']
        },
        {
          id: 'Contracts',
          label: 'Contracts',
          icon: 'contact',
          to: '/me/contracts',
          role: ['Employee'],
          permission: ['Contracts.View']
        },
        {
          id: 'Certifications',
          label: 'Certifications',
          icon: 'categories',
          to: '/me/certifications',
          role: ['Employee'],
          permission: ['Certifications.View']
        },
        {
          id: 'Expenses',
          label: 'Expenses',
          icon: 'extras',
          to: '/me/expenses',
          role: ['Employee'],
          permission: ['Expenses.View']
        },
        {
          id: 'Payrolls',
          label: 'Payrolls',
          icon: 'products',
          to: '/me/payrolls',
          role: ['Employee'],
          permission: ['Payrolls.View']
        }
      ]
    }
  ])

  const menuItems = computed(() => {
    const userPermissions = authStore.user?.permissions || []
    const userRoles = authStore.user?.roles || []

    const hasPermission = (requiredPermissions?: string[]) => {
      if (!requiredPermissions || requiredPermissions.length === 0) return true
      return requiredPermissions.some((permission) => userPermissions.includes(permission))
    }

    const hasRole = (requiredRoles?: string[]) => {
      if (!requiredRoles || requiredRoles.length === 0) return true
      return requiredRoles.some((role) => userRoles.includes(role))
    }

    return rawMenuItems.value
      .map((section) => {
        const filteredItems = section.items.filter((item) => {
          // User must have the required role AND permission (if specified)
          const hasRequiredRole = hasRole(item.role)
          const hasRequiredPermission = hasPermission(item.permission)

          return hasRequiredRole && hasRequiredPermission
        })

        return {
          ...section,
          items: filteredItems
        }
      })
      .filter((section) => section.items.length > 0)
  })

  const toggleNavbar = () => {
    isNavbarOpen.value = !isNavbarOpen.value
  }

  const setActiveItem = (item: MenuItemItem) => {
    if (item.to === router.currentRoute.value.path) return
    router.push(item.to)
  }

  // Add a method to check if user can access a specific route
  const canAccess = (routePath: string): boolean => {
    const allMenuItems = rawMenuItems.value.flatMap((section) => section.items)
    const menuItem = allMenuItems.find((item) => item.to === routePath)

    if (!menuItem) return false

    const userPermissions = authStore.user?.permissions || []
    const userRoles = authStore.user?.roles || []

    const hasRequiredPermission =
      !menuItem.permission ||
      menuItem.permission.length === 0 ||
      menuItem.permission.some((p) => userPermissions.includes(p))
    const hasRequiredRole =
      !menuItem.role ||
      menuItem.role.length === 0 ||
      menuItem.role.some((r) => userRoles.includes(r))

    return hasRequiredPermission && hasRequiredRole
  }

  watch(isNavbarOpen, (newVal) => {
    localStorage.setItem('isNavbarOpen', JSON.stringify(newVal))
  })

  return {
    isNavbarOpen,
    toggleNavbar,
    setActiveItem,
    menuItems,
    canAccess
  }
})
