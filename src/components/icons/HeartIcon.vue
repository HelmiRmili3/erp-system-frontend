<template>
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.87 20.81C12.53 20.93 11.97 20.93 11.63 20.81C8.73 19.82 2.25 15.69 2.25 8.68998C2.25 5.59998 4.74 3.09998 7.81 3.09998C9.63 3.09998 11.24 3.97998 12.25 5.33998C13.26 3.97998 14.88 3.09998 16.69 3.09998C19.76 3.09998 22.25 5.59998 22.25 8.68998C22.25 15.69 15.77 19.82 12.87 20.81Z"
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

