<template>
  <DashboardWrapper>
    <div class="relative flex divide-y flex-col p-4 divide-gray-300">
      <div v-if="loading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>

      <div class="flex divide-x rounded-t-md">
        <generic-managment title="Name Configuration" label="Name" :initialValue="name" @save="handleNameSubmit"
          :loading="nameLoading" :validation-rules="[
            { validate: (value: string) => value.length > 0, message: 'Name is required' }
          ]">
          <i class="pi pi-user"></i>
        </generic-managment>

        <generic-managment title="Slogan Configuration" label="Slogan" :initialValue="slogan" @save="handleSloganSubmit"
          :loading="sloganLoading" :validation-rules="[
            { validate: (value: string) => value.length > 0, message: 'Slogan is required' }
          ]">
          <i class="pi pi-comment"></i>
        </generic-managment>

        <logo-managment :value="pathToFullUrl(logo)" @save="handleLogoSubmit" :loading="logoLoading" />
        <!-- <generic-managment
          title="Logo Configuration"
          label="Logo"
          :initialValue="logo"
          @save="handleLogoSubmit"
          :loading="logoLoading"
        >
          <i class="pi pi-image"></i>
        </generic-managment> -->
      </div>

      <div class="flex divide-x rounded-b-xl">
        <generic-managment title="Phone Configuration" label="Phone" :initialValue="phone" @save="handlePhoneSubmit"
          :loading="phoneLoading" :validation-rules="[
            { validate: (value: string) => value.length > 0, message: 'Phone is required' }
          ]">
          <i class="pi pi-phone"></i>
        </generic-managment>

        <generic-managment title="Email Configuration" label="Email" :initialValue="email" @save="handleEmailSubmit"
          :loading="emailLoading" :validation-rules="[
            { validate: (value: string) => value.length > 0, message: 'Email is required' },
            {
              validate: (value: string) =>
                value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null,
              message: 'Invalid email format'
            }
          ]">
          <i class="pi pi-envelope"></i>
        </generic-managment>
      </div>

      <div class="flex divide-x">
        <generic-managment title="Address Configuration" label="Address" :initialValue="address"
          @save="handleAddressSubmit" :loading="addressLoading" :validation-rules="[
            { validate: (value: string) => value.length > 0, message: 'Address is required' }
          ]">
          <i class="pi pi-map"></i>
        </generic-managment>
        <currency-managment :currency="currency" @save="handleCurrencySubmit"
          :loading="currencyLoading"></currency-managment>
      </div>

      <div class="flex divide-x">
        <generic-managment title="TVA Percentage" label="TVA %" :initialValue="tvaPercentage.toString()"
          @save="handleTVASubmit" :loading="tvaLoading" :validation-rules="[
            { validate: (value: string) => value.length > 0, message: 'TVA percentage is required' },
            { validate: (value: string) => !isNaN(Number(value)), message: 'TVA must be a number' },
            { validate: (value: string) => Number(value) >= 0, message: 'TVA must be a positive number' }
          ]">
          <i class="pi pi-percentage"></i>
        </generic-managment>
        <generic-managment title="Timbre Fiscal" label="Timbre Fiscal Value" :initialValue="timbreFiscal.toString()"
          @save="handleTimbreFiscalSubmit" :loading="timbreFiscalLoading" :validation-rules="[
            { validate: (value: string) => value.length > 0, message: 'Timbre fiscal is required' },
            { validate: (value: string) => !isNaN(Number(value)), message: 'Timbre fiscal must be a number' },
            { validate: (value: string) => Number(value) >= 0, message: 'Timbre fiscal must be a positive number' }
          ]">
          <i class="pi pi-money-bill"></i>
        </generic-managment>
      </div>
    </div>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardWrapper from './components/AdminDashboardOrders/DashboardWrapper.vue'
import CurrencyManagment from './components/AdminConfiguration/CurrencyManagment.vue'
import type { configuration } from '@/models/configuration.model'
import { getAllConfigurations, updateConfig, updateLogo } from '@/services/configuration.service'
import GenericManagment from './components/AdminConfiguration/GenericManagment.vue'
import LogoManagment from './components/AdminConfiguration/LogoManagment.vue'
import { useAppStore } from '@/stores/app.store'

const appStore = useAppStore()
const loading = ref(true)
const currency = ref('€')
const currencyLoading = ref(false)
const name = ref('')
const nameLoading = ref(false)
const slogan = ref('')
const sloganLoading = ref(false)
const logo = ref('')
const logoLoading = ref(false)
const phone = ref('')
const phoneLoading = ref(false)
const email = ref('')
const emailLoading = ref(false)
const address = ref('')
const addressLoading = ref(false)
const tvaPercentage = ref(20)
const tvaLoading = ref(false)
const timbreFiscal = ref(1)
const timbreFiscalLoading = ref(false)

const configurations = ref<configuration[]>([])
const getConfigurations = async () => {
  loading.value = true
  try {
    const response = await getAllConfigurations()
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
      const value = configurations.value.find((config) => config.key === key)?.value ?? defaultValue
      setter(value)
    })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    appStore.setLoading(false)
  }
}

const handleConfigUpdate = async (
  key: string,
  value: any,
  loadingRef: any,
  valueRef: any,
  transform: (val: any) => any = (val) => val
) => {
  loadingRef.value = true
  let rawValue = valueRef.value

  try {
    rawValue = (await updateConfig(key, value)).data.data.value
    valueRef.value = transform(rawValue)
  } catch (error) {
    console.error(error)
  }

  loadingRef.value = false
}

const handleNameSubmit = async (value: { value: string }) => {
  await handleConfigUpdate('name', value.value, nameLoading, name)
}

const handleSloganSubmit = async (value: { value: string }) => {
  await handleConfigUpdate('slogan', value.value, sloganLoading, slogan)
}

const handleLogoSubmit = async (value: { value: File }) => {
  logoLoading.value = true

  try {
    logo.value = await updateLogo(logo.value, value.value)
  } catch (error) {
    console.error(error)
  }

  logoLoading.value = false
}

const handlePhoneSubmit = async (value: { value: string }) => {
  await handleConfigUpdate('phone', value.value, phoneLoading, phone)
}

const handleEmailSubmit = async (value: { value: string }) => {
  await handleConfigUpdate('email', value.value, emailLoading, email)
}

const handleAddressSubmit = async (value: { value: string }) => {
  await handleConfigUpdate('address', value.value, addressLoading, address)
}

const handleCurrencySubmit = async (value: { currency: string }) => {
  await handleConfigUpdate('currency', value.currency, currencyLoading, currency)
}

const handleTVASubmit = async (value: { value: string }) => {
  await handleConfigUpdate('tvaPercentage', value.value, tvaLoading, tvaPercentage, Number)
}

const handleTimbreFiscalSubmit = async (value: { value: string }) => {
  await handleConfigUpdate('timbreFiscal', value.value, timbreFiscalLoading, timbreFiscal, Number)
}

getConfigurations()

const pathToFullUrl = (path: string) => {
  return import.meta.env.VITE_BASE_URL + '/files/' + path
}
</script>

<style></style>
