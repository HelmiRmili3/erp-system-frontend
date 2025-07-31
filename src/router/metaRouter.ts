// import { api } from '@/plugins/axios'
// import router from './index'
// import { useAppStore } from '@/stores/app.store'

// router.beforeEach(async (to, from, next) => {
//   handleLoading()
//   const token = localStorage.getItem('token')
//   let isAuthenticated = Boolean(token)
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
//   const isGuestRoute = to.matched.some((record) => record.meta.guest)

//   isAuthenticated = isAuthenticated && (await checkUserAuth())

//   if (requiresAuth && !isAuthenticated) {
//     return next({ name: 'Login' })
//   }

//   if (isGuestRoute && isAuthenticated) {
//     return next({ name: 'Main' })
//   }

//   return next()
// })

// async function checkUserAuth() {
//   try {
//     await api.value!.get('/Auth/me')
//     return true
//   } catch (e) {
//     return false
//   }
// }

// function handleLoading() {
//   const appStore = useAppStore()
//   appStore.setLoading(true)
// }

// export default router
import { api } from '@/plugins/axios'
import router from './index'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'

router.beforeEach(async (to, from, next) => {
  handleLoading()

  const token = localStorage.getItem('token')
  let isAuthenticated = Boolean(token)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some((record) => record.meta.guest)

  isAuthenticated = isAuthenticated && (await checkUserAuth())

  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (isGuestRoute && isAuthenticated) {
    return next({ name: 'Main' })
  }

  // ✅ New: Role/Permission-Based Protection
  const authStore = useAuthStore()
  const userRoles = authStore.user?.roles || []
  const userPermissions = authStore.user?.permissions || []

  const requiredRoles = to.meta.roles || []
  const requiredPermissions = to.meta.permissions || []

  const hasPermission =
    requiredPermissions.length === 0 || requiredPermissions.some((p) => userPermissions.includes(p))

  const hasRole = requiredRoles.length === 0 || requiredRoles.some((r) => userRoles.includes(r))

  const requiresAccess = requiredRoles.length > 0 || requiredPermissions.length > 0

  if (requiresAccess && (!hasPermission || !hasRole)) {
    return next({ name: 'NotFound' })
  }

  return next()
})
async function checkUserAuth() {
  try {
    await api.value!.get('/Auth/me')
    return true
  } catch (e) {
    return false
  }
}

function handleLoading() {
  const appStore = useAppStore()
  appStore.setLoading(true)
}

export default router
