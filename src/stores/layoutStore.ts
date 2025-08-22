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
          // permission: ['Users.View']
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
          to: '/admin/Contracts',
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
          to: '/me/Contracts',
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

    const hasMatch = (required?: string[], actual?: string[]) => {
      if (!required || required.length === 0) return false
      return required.some((r) => actual!.includes(r))
    }

    return rawMenuItems.value
      .map((section) => {
        const filteredItems = section.items.filter((item) => {
          const requiresPermission = !!item.permission?.length
          const requiresRole = !!item.role?.length

          // Must meet permission if required
          const hasPermission = !requiresPermission || hasMatch(item.permission, userPermissions)

          // Must meet role if required
          const hasRole = !requiresRole || hasMatch(item.role, userRoles)
          const requiresAnything = requiresPermission || requiresRole
          return requiresAnything && hasPermission && hasRole
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

  watch(isNavbarOpen, (newVal) => {
    localStorage.setItem('isNavbarOpen', JSON.stringify(newVal))
  })

  return {
    isNavbarOpen,
    toggleNavbar,
    setActiveItem,
    menuItems // this is now dynamically filtered
  }
})
