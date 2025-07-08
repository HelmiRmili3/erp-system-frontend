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
            id: 'manage-categories',
            label: 'Manage Categories',
            icon: 'categories',
            to: '/admin/categories'
          }
        ]
      },
      {
        title: 'Settings',
        items: [
          {
            id: 'settings',
            label: 'Settings',
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
