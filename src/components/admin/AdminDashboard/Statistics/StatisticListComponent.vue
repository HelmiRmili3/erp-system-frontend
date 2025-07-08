<template>
  <div class="statistic-list" v-if="!isLoading">
    <statistic-card-component v-for="stat in localStats" :key="stat.title" :stat="stat" />
  </div>
  <div class="statistic-list" v-else>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatisticCardComponent from '@/components/admin/AdminDashboard/Statistics/SatatisticCardComponent.vue'
import type { Stats } from '@/models/Dashboard.model'

import RevenuIcon from '@/components/icons/RevenuIcon.vue'
import OrderIcon from '@/components/icons/OrderIcon.vue'
import DineInIcon from '@/components/icons/DineInIcon.vue'
import TakeAwayIcon from '@/components/icons/TakeAwayIcon.vue'
const { stats, loading } = defineProps<{ stats: any | null; loading: boolean }>()
const localStats = computed(() => mappedStats())
const mappedStats = () => {
  return stats?.map((stat: Stats) => {
    switch (stat.title) {
      case 'Total Orders':
        return { ...stat, icon: OrderIcon, color: '#3498db', background: '#f9fcf7' }
      case 'Total Revenues':
        return { ...stat, icon: RevenuIcon, color: '#f4d7cb', background: '#fff8f4' }
      case 'Dine In':
        return { ...stat, icon: DineInIcon, color: '#3498db', background: '#ffffff' }
      case 'Take Away':
        return { ...stat, icon: TakeAwayIcon, color: '#3498db', background: '#ecf8ff' }
      default:
        return stat
    }
  })
}
const isLoading = computed(() => loading)
</script>

<style lang="scss">
.statistic-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}
</style>
