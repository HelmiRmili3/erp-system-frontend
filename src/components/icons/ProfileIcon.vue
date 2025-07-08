<template>
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.75 12C15.5114 12 17.75 9.76142 17.75 7C17.75 4.23858 15.5114 2 12.75 2C9.98858 2 7.75 4.23858 7.75 7C7.75 9.76142 9.98858 12 12.75 12Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M21.34 22C21.34 18.13 17.49 15 12.75 15C8.01 15 4.16 18.13 4.16 22"
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
