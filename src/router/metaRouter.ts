import { api } from '@/plugins/axios'
import router from './index'
import { useAppStore } from '@/stores/app.store'

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

  return next()
})

async function checkUserAuth() {
  try {
    await api.value!.get('/categories')
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
