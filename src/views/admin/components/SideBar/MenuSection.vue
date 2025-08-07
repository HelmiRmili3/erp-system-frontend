<template>
  <div :class="menuClasses">
    <div class="flex justify-start items-start flex-row gap-2.5 px-2.5 opacity-50">
      <span class="text-[#5F6C7B] text-xs font-bold">{{ sectionTitle }}</span>
    </div>
    <div
      v-for="item in items"
      :key="item.label"
      :class="itemClasses(item)"
      @click="selectItem(item)"
    >
      <div class="flex justify-center items-center flex-row w-[24px] h-[24px]">
        <component
          :is="stringToComponent(item.icon)"
          :class="[itemIsActive(item) ? 'selected' : '', item.icon]"
        />
      </div>
      <span
        :class="itemIsActive(item) ? 'text-[#87C767] font-semibold' : 'text-[#5F6C7B]'"
        v-if="isOpen"
        >{{ item.label }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import dashboardSvg from '../../../../assets/svg/dashboard.svg?component'
import categoriesSvg from '../../../../assets/svg/categories.svg?component'
import productsSvg from '../../../../assets/svg/products.svg?component'
import settingsSvg from '../../../../assets/svg/settings.svg?component'
import contactIcon from '../../../../assets/svg/contact.svg?component'
import ordersIcon from '../../../../assets/svg/orders.svg?component'
import extrasIcon from '../../../../assets/svg/extras.svg?component'
import usersIcon from '../../../../assets/svg/users.svg?component'
import eyeIcon from '../../../../assets/svg/eye.svg?component'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  sectionTitle: {
    type: String,
    required: true
  },
  items: {
    type: Array<any>,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['selectItem'])

const route = useRoute()

const menuClasses = computed(() => {
  return {
    flex: true,
    'self-stretch': true,
    'justify-start': props.isOpen,
    'justify-center': !props.isOpen,
    'items-start': props.isOpen,
    'items-center': !props.isOpen,
    'flex-col': true,
    'gap-2.5': true
  }
})

const itemClasses = computed(() => {
  return (item: any) => {
    return {
      flex: true,
      'self-stretch': true,
      'justify-start': props.isOpen,
      'justify-center': !props.isOpen,
      'items-center': true,
      'flex-row': true,
      'gap-2.5': true,
      'py-2.5': true,
      'px-2.5': !props.isOpen,
      'px-[33.5px]': props.isOpen,
      'cursor-pointer': true,
      'text-[#87C767] font-semibold': itemIsActive.value(item),
      'text-[#5F6C7B]': !itemIsActive.value(item)
    }
  }
})
// const filteredItems = computed(() => props.items.filter((item) => item.label === 'Roles'))
const itemIsActive = computed(() => {
  return (item: any) => {
    return item.to === route.path
  }
})

const stringToComponent = (svg: string) => {
  switch (svg) {
    case 'dashboard':
      return dashboardSvg
    case 'categories':
      return categoriesSvg
    case 'products':
      return productsSvg
    case 'settings':
      return settingsSvg
    case 'contact-forms':
      return contactIcon
    case 'clipboard-list':
      return ordersIcon
    case 'extras':
      return extrasIcon
    case 'users':
      return usersIcon
    case 'eye':
      return eyeIcon
    case 'contact':
      return contactIcon
    default:
      return ''
  }
}

const selectItem = (item: any) => {
  emits('selectItem', item)
}
</script>
<style lang="scss">
.selected {
  &.dashboard {
    path {
      fill: #87c767;
    }
  }

  // is not dashboard
  &:not(.dashboard) {
    path {
      stroke: #87c767;
    }
  }
}
</style>
