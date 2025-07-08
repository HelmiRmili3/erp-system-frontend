<template>
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.75 10H19.75C21.75 10 22.75 9 22.75 7V5C22.75 3 21.75 2 19.75 2H17.75C15.75 2 14.75 3 14.75 5V7C14.75 9 15.75 10 17.75 10Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5.75 22H7.75C9.75 22 10.75 21 10.75 19V17C10.75 15 9.75 14 7.75 14H5.75C3.75 14 2.75 15 2.75 17V19C2.75 21 3.75 22 5.75 22Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.75 10C8.95914 10 10.75 8.20914 10.75 6C10.75 3.79086 8.95914 2 6.75 2C4.54086 2 2.75 3.79086 2.75 6C2.75 8.20914 4.54086 10 6.75 10Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M18.75 22C20.9591 22 22.75 20.2091 22.75 18C22.75 15.7909 20.9591 14 18.75 14C16.5409 14 14.75 15.7909 14.75 18C14.75 20.2091 16.5409 22 18.75 22Z"
      :stroke="color"
      stroke-width="1.5"
      stroke-miterlimit="10"
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
