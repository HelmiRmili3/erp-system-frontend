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

import axiosPlugin, { createAxiosInstances } from './plugins/axios'
import { useAppStore } from './stores/app.store'
import type { AppConfig } from './types/config'

library.add(fas, far, fab)
dom.watch()

async function loadConfig(): Promise<AppConfig> {
  if (import.meta.env.DEV) {
    // Development mode: Use import.meta.env
    return {
      VITE_BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:8000'
    }
  } else {
    // Production mode: Fetch config.json
    const response = await fetch('/config.json')
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return (await response.json()) as AppConfig
  }
}

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const appStore = useAppStore()
appStore.setLoading(true)

loadConfig().then((config) => {
  console.log('Loaded config:', config)
  createAxiosInstances(config.VITE_BASE_URL || 'https://localhost:5001')
  app.use(axiosPlugin)
})

// Initialize PrimeVue and other plugins
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'DISABLED'
    }
  }
})
app.directive('tooltip', Tooltip)

app.use(ToastService)
app.use(DialogService)
app.use(router)
app.use(ConfirmationService)

app.mount('#app')
