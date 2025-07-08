<template>
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.32001 1.81997L2.39001 7.36997C1.61001 7.98997 1.11001 9.29997 1.28001 10.28L2.61001 18.24C2.85001 19.66 4.21001 20.81 5.65001 20.81H16.85C18.28 20.81 19.65 19.65 19.89 18.24L21.22 10.28C21.38 9.29997 20.88 7.98997 20.11 7.36997L13.18 1.82997C12.11 0.969971 10.38 0.969971 9.32001 1.81997Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
<script setup>
import { useIsActive } from '@/composables/useIsActive'

const props = defineProps(['isActive'])

const { color } = useIsActive(props)
</script>
