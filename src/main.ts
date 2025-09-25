import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import Tooltip from 'primevue/tooltip'

import App from './App.vue'
import router from './router/metaRouter'

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import ConfirmationService from 'primevue/confirmationservice'

import axiosPlugin from '@/plugins/axios'

import { useAppStore } from './stores/app.store'
import type { AppConfig } from './types/config'

library.add(fas, far, fab)
dom.watch()

async function loadConfig(): Promise<AppConfig> {
  if (import.meta.env.DEV) {
    return { VITE_BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000' }
  } else {
    const response = await fetch('/config.json')
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return (await response.json()) as AppConfig
  }
}

async function bootstrap() {
  const app = createApp(App)

  // 1️⃣ Load config
  const config = await loadConfig()
  console.log('Connected to :', config.VITE_BASE_URL)
  app.use(axiosPlugin)

  // 2️⃣ Setup Pinia
  const pinia = createPinia()
  app.use(pinia)

  // 3️⃣ Create Axios instance AFTER Pinia

  // 4️⃣ Now stores are safe to use
  const appStore = useAppStore()
  appStore.setLoading(true)

  // 5️⃣ PrimeVue + other plugins
  app.use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: 'DISABLED' } } })
  app.directive('tooltip', Tooltip)
  app.use(ToastService)
  app.use(DialogService)
  app.use(router)
  app.use(ConfirmationService)

  // 6️⃣ Mount
  app.mount('#app')
}

bootstrap()
