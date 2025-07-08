<template>
  <div class="flex flex-row gap-[5px]">
    <div class="flex flex-row">
      <slot name="icon">
        <CartIconSvg />
      </slot>
    </div>
    <span class="text-[#494949] text-sm font-medium" :class="child ? 'cursor-pointer hover:text-[#FF6B00]' : ''"
      @click="onParentClick">{{ title }}</span>

    <div class="flex flex-row items-center" v-if="child">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.91 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91 4.08" stroke="#292D32" stroke-width="1.5"
          stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="text-[#494949] text-sm font-medium">{{ child }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import CartIconSvg from './CartIconSvg.vue'

const router = useRouter()
const { child } = defineProps<{
  title: string
  child?: string
}>()

const onParentClick = () => {
  if (child) {
    router.back()
  }
}

defineOptions({
  name: 'SectionHeader'
})
</script>

<script lang="ts">
export default {}
</script>

<style scoped></style>
