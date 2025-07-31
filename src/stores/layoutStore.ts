// import { defineStore } from 'pinia'
// import { ref, watch } from 'vue'
// import { useRouter } from 'vue-router'

// interface MenuItem {
//   title: string
//   items: MenuItemItem[]
// }

// interface MenuItemItem {
//   id: string
//   label: string
//   icon: string
//   to: string
//   permission?: string[]
//   role?: string[]
// }

// export const useLayoutStore = defineStore('layoutStore', () => {
//   const router = useRouter()

//   const storedMenuItems = JSON.parse(localStorage.getItem('menuItems') || 'null')
//   const storedNavbarState = JSON.parse(localStorage.getItem('isNavbarOpen') || 'false')

//   const isNavbarOpen = ref(storedNavbarState || false)
//   const menuItems = ref<MenuItem[]>(
//     storedMenuItems || [
//       {
//         title: 'Home',
//         items: [
//           {
//             id: 'dashboard',
//             label: 'Dashboard',
//             icon: 'dashboard',
//             isActive: true,
//             to: '/admin/home'
//           }
//         ]
//       },
//       {
//         title: 'Manage',
//         items: [
//           {
//             id: 'manage',
//             label: 'Users',
//             icon: 'dashboard',
//             isActive: false,
//             to: '/admin/users'
//           }
//         ]
//       },
//       // {
//       //   title: 'Categories',
//       //   items: [
//       //     {
//       //       id: 'Absences',
//       //       label: 'Absences',
//       //       icon: 'categories',
//       //       to: '/admin/absences'
//       //     },
//       //     {
//       //       id: 'Attendances',
//       //       label: 'Attendances',
//       //       icon: 'categories',
//       //       to: '/attendances/all'
//       //     },
//       //     {
//       //       id: 'Contracts',
//       //       label: 'Contracts',
//       //       icon: 'categories',
//       //       to: '/admin/Contracts'
//       //     },
//       //     {
//       //       id: 'Certifications',
//       //       label: 'Certifications',
//       //       icon: 'categories',
//       //       to: '/admin/certifications'
//       //     },
//       //     {
//       //       id: 'Expenses',
//       //       label: 'Expenses',
//       //       icon: 'categories',
//       //       to: '/admin/expenses'
//       //     },
//       //     {
//       //       id: 'Payrolls',
//       //       label: 'Payrolls',
//       //       icon: 'categories',
//       //       to: '/admin/payrolls'
//       //     }
//       //   ]
//       // },
//       // {
//       //   title: 'Roles & Permissions',
//       //   items: [
//       //     {
//       //       id: 'settings',
//       //       label: 'Roles',
//       //       icon: 'settings',
//       //       to: '/admin/configurations'
//       //     },
//       //     {
//       //       id: 'settings',
//       //       label: 'Permissions',
//       //       icon: 'settings',
//       //       to: '/admin/configurations'
//       //     }
//       //   ]
//       // }
//       {
//         title: 'Categories',
//         items: [
//           {
//             id: 'Absences',
//             label: 'Absences',
//             icon: 'categories',
//             to: '/admin/absences'
//           }
//           // {
//           //   id: 'Attendances',
//           //   label: 'Attendances',
//           //   name: 'admin',
//           //   to: '/admin/attendances'
//           // },
//           // {
//           //   id: 'Contracts',
//           //   label: 'Contracts',
//           //   name: 'admin',
//           //   to: '/admin/contracts'
//           // },
//           // {
//           //   id: 'Certifications',
//           //   label: 'Certifications',
//           //   name: 'admin',
//           //   to: '/admin/certifications'
//           // },
//           // {
//           //   id: 'Expenses',
//           //   label: 'Expenses',
//           //   name: 'admin',
//           //   to: '/admin/expenses'
//           // },
//           // {
//           //   id: 'Payrolls',
//           //   label: 'Payrolls',
//           //   name: 'admin',
//           //   to: '/admin/payrolls'
//           // }
//         ]
//       },
//       {
//         title: 'Roles & Permissions',
//         items: [
//           {
//             id: 'settings',
//             label: 'Roles',
//             icon: 'settings',
//             to: '/admin/roles'
//           },
//           {
//             id: 'settings',
//             label: 'Permissions',
//             icon: 'settings',
//             to: '/admin/permissions'
//           }
//         ]
//       }
//     ]
//   )

//   const toggleNavbar = () => {
//     isNavbarOpen.value = !isNavbarOpen.value
//   }

//   const setActiveItem = (item: MenuItemItem) => {
//     if (item.to === router.currentRoute.value.path) return
//     router.push(item.to)
//   }

//   watch(
//     menuItems,
//     (newMenuItems) => {
//       localStorage.setItem('menuItems', JSON.stringify(newMenuItems))
//     },
//     { deep: true }
//   )

//   watch(isNavbarOpen, (newIsNavbarOpen) => {
//     localStorage.setItem('isNavbarOpen', JSON.stringify(newIsNavbarOpen))
//   })

//   return {
//     menuItems,
//     isNavbarOpen,
//     toggleNavbar,
//     setActiveItem
//   }
// })
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
          icon: 'dashboard',
          to: '/admin/users',
          role: ['Administrator']
        }
      ]
    },
    // {
    //   title: 'Categories',
    //   items: [
    //     {
    //       id: 'Absences',
    //       label: 'Absences',
    //       icon: 'categories',
    //       to: '/admin/absences'
    //     },
    //     {
    //       id: 'Attendances',
    //       label: 'Attendances',
    //       icon: 'categories',
    //       to: '/attendances/all'
    //     },
    //     {
    //       id: 'Contracts',
    //       label: 'Contracts',
    //       icon: 'categories',
    //       to: '/admin/Contracts'
    //     },
    //     {
    //       id: 'Certifications',
    //       label: 'Certifications',
    //       icon: 'categories',
    //       to: '/admin/certifications'
    //     },
    //     {
    //       id: 'Expenses',
    //       label: 'Expenses',
    //       icon: 'categories',
    //       to: '/admin/expenses'
    //     },
    //     {
    //       id: 'Payrolls',
    //       label: 'Payrolls',
    //       icon: 'categories',
    //       to: '/admin/payrolls'
    //     }
    //   ]
    // },
    {
      title: 'Categories',
      items: [
        {
          id: 'Absences',
          label: 'Absences',
          icon: 'categories',
          to: '/admin/absences',
          role: ['Employee']
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
          role: ['Administrator']
        },
        {
          id: 'permissions',
          label: 'Permissions',
          icon: 'settings',
          to: '/admin/permissions',
          permission: ['Roles.View']
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

          // Only return if item requires at least one of permission/role AND user has both
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
