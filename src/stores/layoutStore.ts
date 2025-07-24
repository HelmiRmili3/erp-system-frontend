import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface MenuItem {
  title: string
  items: MenuItemItem[]
}

interface MenuItemItem {
  id: string
  label: string
  icon: string
  to: string
}

export const useLayoutStore = defineStore('layoutStore', () => {
  const router = useRouter()

  const storedMenuItems = JSON.parse(localStorage.getItem('menuItems') || 'null')
  const storedNavbarState = JSON.parse(localStorage.getItem('isNavbarOpen') || 'false')

  const isNavbarOpen = ref(storedNavbarState || false)
  const menuItems = ref<MenuItem[]>(
    storedMenuItems || [
      {
        title: 'Home',
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'dashboard',
            isActive: true,
            to: '/admin/home'
          }
        ]
      },
      {
        title: 'Categories',
        items: [
          {
            id: 'Absences',
            label: 'Absences',
            icon: 'categories',
            to: '/admin/categories'
          },
          {
            id: 'Attendance',
            label: 'Attendance',
            icon: 'categories',
            to: '/admin/Contracts'
          },
          {
            id: 'Contracts',
            label: 'Contracts',
            icon: 'categories',
            to: '/admin/Contracts'
          },
          {
            id: 'Certifications',
            label: 'Certifications',
            icon: 'categories',
            to: '/admin/Contracts'
          },
          {
            id: 'Expenses',
            label: 'Expenses',
            icon: 'categories',
            to: '/admin/Contracts'
          },
          {
            id: 'Payrolls',
            label: 'Payrolls',
            icon: 'categories',
            to: '/admin/Contracts'
          }
        ]
      },
      {
        title: 'Roles & Permissions',
        items: [
          {
            id: 'settings',
            label: 'Roles',
            icon: 'settings',
            to: '/admin/configurations'
          },
          {
            id: 'settings',
            label: 'Permissions',
            icon: 'settings',
            to: '/admin/configurations'
          }
        ]
      }
    ]
  )

  const toggleNavbar = () => {
    isNavbarOpen.value = !isNavbarOpen.value
  }

  const setActiveItem = (item: MenuItemItem) => {
    if (item.to === router.currentRoute.value.path) return
    router.push(item.to)
  }

  watch(
    menuItems,
    (newMenuItems) => {
      localStorage.setItem('menuItems', JSON.stringify(newMenuItems))
    },
    { deep: true }
  )

  watch(isNavbarOpen, (newIsNavbarOpen) => {
    localStorage.setItem('isNavbarOpen', JSON.stringify(newIsNavbarOpen))
  })

  return {
    menuItems,
    isNavbarOpen,
    toggleNavbar,
    setActiveItem
  }
})
