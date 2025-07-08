<template>
  <div class="flex justify-start items-start flex-col gap-[15px]">
    <p class="self-stretch text-[#2A2A2A] text-lg font-medium">Bestsellers</p>
    <div
      class="flex self-stretch justify-start items-start flex-row gap-[15px] max-w-[100%] overflow-x-auto "
      v-if="!isLoading"
    >
      <BestSellerDashboardItemComponent
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
    <div
      class="flex self-stretch justify-start items-start flex-row gap-[15px] max-w-[100%] overflow-x-auto min-h-[200px]"
      v-else
    >
      <div
        class="border bg-white shadow rounded-md p-4 max-w-sm w-full mx-auto"
        v-for="i in 4"
        :key="i"
      >
        <div class="animate-pulse flex space-x-4">
          <div class="rounded-full bg-slate-200 h-10 w-10"></div>
          <div class="flex-1 space-y-6 py-1">
            <div class="h-2 bg-slate-200 rounded"></div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                <div class="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div class="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BestSellerDashboardItemComponent from '@/components/admin/AdminDashboard/BestSeller/BestSellerDashboardItemComponent.vue'
import { computed } from 'vue'
const { products, loading } = defineProps<{ products: any; loading: boolean }>()

const isLoading = computed(() => loading)
</script>

<style scoped></style>
