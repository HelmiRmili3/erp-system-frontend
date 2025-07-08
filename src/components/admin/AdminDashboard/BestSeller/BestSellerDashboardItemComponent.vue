<template>
  <div
    class="min-w-[160px] max-w-[200px]  flex  justify-between flex-col rounded-[10px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)] min-h-[243px]"
  >
    <div
      class="flex self-stretch justify-start h-full max-h-[200px] items-center flex-col gap-2.5 p-[20px] bg-[#FFFFFE] border-solid border-[#F2F2F2] min-h-[200px] border rounded-tl-[20px] rounded-tr-[20px]"
    >
      <img  class="max-w-[100px] max-h-[100px]" :src="product.image" :alt="product.label" />
      <span class="text-[#333333] font-medium text-ellipsis ...">{{ product.label }}</span>
    </div>
    <div
      class="flex self-stretch justify-center items-center flex-row gap-2.5 p-2.5 bg-[#2A2A2A] rounded-br-[10px] rounded-bl-[10px]"
    >
      <p class="text-[#FFFFFE] text-sm">Orders :</p>
      <span class="text-[#FFFFFE] font-medium">{{ product.totalOrders }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardProduct } from '@/models/Dashboard.model'

const { product } = defineProps<{
  product: DashboardProduct
}>()
</script>

<style scoped></style>
