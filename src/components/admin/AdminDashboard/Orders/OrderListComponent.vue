<template>
  <div class="orders-list">
    <div class="orders-list-header">
      <div class="orders-list-header-title flex gap-1">
        <BagIcon color="#494949" />
        Orders
      </div>
      <div class="orders-list-header-today">Today</div>
    </div>
    <div class="orders-list-content" v-if="isLoading">
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
    <div class="orders-list-content" v-if="!isLoading && localOrders.length > 0">
      <OrderCardComponent v-for="order in localOrders" :key="order.id" :order="order" :currency />
    </div>
    <div class="orders-list-content" v-if="!isLoading && localOrders.length === 0">
      <div class="text-center text-gray-400">No orders yet</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BagIcon from '@/components/icons/BagIcon.vue'
import OrderCardComponent from '@/components/admin/AdminDashboard/Orders/OrderCardComponent.vue'
import { computed } from 'vue'
import type { DashboardOrder } from '@/models/Dashboard.model'
const { orders, loading } = defineProps<{ orders: any; loading: boolean, currency: string }>()
const localOrders = computed(() => mappedOrders())
const isLoading = computed(() => loading)

const mappedOrders = () => {
  return orders?.map((order: any) => {
    return {
      id: order.id,
      name: order.first_name + ' ' + order.last_name,
      status: order.status,
      amount: order.total_price,
      mode: order.is_delivery ? 'take_away' : 'dine_in'
    } as DashboardOrder
  })
}

// const orders = ref([
//   {
//     id: 5451,
//     name: 'Jason Carter',
//     status: 'Success',
//     amount: '50.50',
//     mode: 'dine_in'
//   },
//   {
//     id: 5452,
//     name: 'John Doe',
//     status: 'Pending',
//     amount: '30.50',
//     mode: 'take_away'
//   },
//   {
//     id: 5453,
//     name: 'Jane Doe',
//     status: 'Cancelled',
//     amount: '20.50',
//     mode: 'dine_in'
//   },
//   {
//     id: 5454,
//     name: 'Jason Carter',
//     status: 'Success',
//     amount: '50.50',
//     mode: 'dine_in'
//   },
//   {
//     id: 5455,
//     name: 'John Doe',
//     status: 'Pending',
//     amount: '30.50',
//     mode: 'take_away'
//   },
//   {
//     id: 5456,
//     name: 'Jane Doe',
//     status: 'Cancelled',
//     amount: '20.50',
//     mode: 'dine_in'
//   },
//   {
//     id: 5457,
//     name: 'Jason Carter',
//     status: 'Success',
//     amount: '50.50',
//     mode: 'dine_in'
//   },
//   {
//     id: 5458,
//     name: 'John Doe',
//     status: 'Pending',
//     amount: '30.50',
//     mode: 'take_away'
//   },
//   {
//     id: 5459,
//     name: 'Jane Doe',
//     status: 'Cancelled',
//     amount: '20.50',
//     mode: 'dine_in'
//   }
// ] as DashboardOrder[])
</script>

<style lang="scss">
.orders-list {
  display: flex;
  width: 244px;
  height: 600px;
  padding: 15px;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  flex-shrink: 0;
  border-radius: 20px;
  border: 1px solid var(--Moondust-Silver, #ebebeb);
  background: var(--Winter-Mist, #fcfcfc);
  /* Drop Shadow/XSmall */
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    &-title {
      color: var(--Charcoal-Slate, #494949);
      /* Paragraph/Large/Semi bold */
      font-family: 'Poppins';
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    &-today {
      color: var(--Charcoal-Slate, #494949);
      /* Paragraph/Large/Regular */
      font-family: 'Poppins';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    align-items: flex-start;
    overflow: auto;
    // Hide scrollbar for Chrome, Safari and Opera
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
