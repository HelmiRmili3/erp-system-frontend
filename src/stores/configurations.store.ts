import type { configuration, DeliveryZone } from '@/models/configuration.model'
import { getAllConfigurations } from '@/services/configuration.service'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface ConfigObject {
  address: string
  phone: string
  email: string
  currency: string
  tvaPercentage: number
  timbreFiscal: number
  // Add other configuration properties as needed
}

export const useConfigurationsStore = defineStore('configurations', () => {
  const configurations = ref([] as configuration[])
  const name = ref('')
  const slogan = ref('')
  const logo = ref('')
  const phone = ref('')
  const email = ref('')
  const address = ref('')
  const currency = ref('€')
  const tvaPercentage = ref(20) // Default TVA 20%
  const timbreFiscal = ref(1) // Default Timbre Fiscal 1

  const _config = ref<ConfigObject>({
    address: '123 Rue Example, Tunis 1000',
    phone: '+216 71 123 456',
    email: 'contact@autoparts.tn',
    currency: '€',
    tvaPercentage: 20,
    timbreFiscal: 1
  })

  const configObject = computed(() => _config.value)

  const deliveryZones = ref([] as DeliveryZone[])
  const getConfig = async () => {
    const response = await getAllConfigurations()
    if (!response.data.data) return
    configurations.value = response.data.data

    const configMap: Record<string, [string | number, (val: any) => void]> = {
      name: ['name', (val) => (name.value = val)],
      slogan: ['slogan', (val) => (slogan.value = val)],
      logo: ['logo.png', (val) => (logo.value = val)],
      phone: ['+123456789', (val) => (phone.value = val)],
      email: ['test@example.com', (val) => (email.value = val)],
      address: ['Av test, City, Country', (val) => (address.value = val)],
      currency: ['€', (val) => (currency.value = val)],
      tvaPercentage: [20, (val) => (tvaPercentage.value = Number(val))],
      timbreFiscal: [1, (val) => (timbreFiscal.value = Number(val))]
    }

    Object.entries(configMap).forEach(([key, [defaultValue, setter]]) => {
      const value =
        configurations.value?.find((config) => config.key === key)?.value ?? defaultValue
      setter(value)
    })

    // Update the config object
    updateConfig({
      address: address.value,
      phone: phone.value,
      email: email.value,
      currency: currency.value,
      tvaPercentage: tvaPercentage.value,
      timbreFiscal: timbreFiscal.value
    })
  }

  const initConfigurations = async () => {
    await getConfig()
  }

  const updateConfig = (newConfig: Partial<ConfigObject>) => {
    _config.value = { ..._config.value, ...newConfig }
  }

  return {
    configurations,
    currency,
    tvaPercentage,
    timbreFiscal,
    deliveryZones,
    configObject,
    logo,
    name,
    getConfig,
    initConfigurations,
    updateConfig
  }
})
