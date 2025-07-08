<template>
  <div
    class="flex justify-center items-center flex-row bg-[#FFFFFE] rounded-[5px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)] absolute toggle-icon cursor-pointer"
    @click="toggleNavbar"
  >
    <icon />
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layoutStore'
import toggleIcon from './toggleIconOpened.svg'
import toggleIconClosed from './toggleIconClosed.svg'
import { computed, toRefs } from 'vue'

const { toggleNavbar } = useLayoutStore()
const { isNavbarOpen } = toRefs(useLayoutStore())

const icon = computed(() => (isNavbarOpen.value ? toggleIcon : toggleIconClosed))
</script>

<style scoped>
.toggle-icon {
  top: 5rem;
  right: -5%;
}
</style>
