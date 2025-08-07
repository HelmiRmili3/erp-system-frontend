<template>
  <div class="relative max-w-[228px] h-full w-fit the-side-bar">
    <ToggleIcon :icon="toggleIcon" />
    <div
      class="flex justify-start items-start flex-col gap-5 pb-2.5 bg-[#FFFFFE] border-solid border-[#F2F2F2] border-[0.5px] rounded-[20px] shadow-[_0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] h-full w-full p-5"
    >
      <MenuHeader :is-open="isNavbarOpen" :title="name" :subtitle="user?.roles[0]" :logo="logo" />
      <MenuSection
        v-for="item in menuItems"
        :is-open="isNavbarOpen"
        :section-title="item.title"
        :items="item.items"
        :key="item.title"
        @selectItem="selectItem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ToggleIcon from './ToggleIcon.vue'
import MenuHeader from './MenuHeader.vue'
import MenuSection from './MenuSection.vue'

import toggleIcon from './toggleIconOpened.svg'
import { useLayoutStore } from '@/stores/layoutStore'
import { toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigurationsStore } from '@/stores/configurations.store'
import { useAuthStore } from '@/stores/auth.store'

const { isNavbarOpen, menuItems } = toRefs(useLayoutStore())
const { setActiveItem } = useLayoutStore()

const { logo, name } = storeToRefs(useConfigurationsStore())
const authStore = useAuthStore()
const user = authStore.user
const selectItem = (item: any) => {
  setActiveItem(item)
}
</script>
<style scoped>
.the-side-bar {
  height: calc(120vh - 5rem);
}
</style>
