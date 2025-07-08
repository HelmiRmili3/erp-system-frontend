<template>
  <div class="order-card">
    <div class="order-card-header">
      <Avatar
        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        class="mr-2"
        shape="circle"
      />
      <div class="order-card-user-name">
        {{ order.name }}
      </div>
    </div>
    <div class="order-card-id">No, Order {{ order.id }}</div>
    <div class="order-card-status" :style="completedStyle">
      {{ order.status }}
    </div>
    <div class="order-card-footer">
      <div class="order-card-footer-price">
        Total : <span style="color: #87c767">{{ order.amount }} {{ currency }}</span>
      </div>
      <div class="order-card-footer-mode">
        <DineInIcon v-if="order.mode === 'dine_in'" />
        <TakeAwayIcon v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardOrder } from '@/models/Dashboard.model'
import DineInIcon from '@/components/icons/DineInIcon.vue'
import TakeAwayIcon from '@/components/icons/TakeAwayIcon.vue'
import { computed } from 'vue'
const { order } = defineProps<{
  order: DashboardOrder
  currency: string
}>()

const completedStyle = computed(() => {
  return order.status === 'done'
    ? { color: '#87c767', backgroundColor: '#edffe4' }
    : order.status === 'canceled'
      ? { color: '#e74c3c', backgroundColor: '#ffe4e4' }
      : { color: '#3498db', backgroundColor: '#e4f0ff' }
})
</script>

<style lang="scss">
.order-card {
  display: flex;
  padding: 15px;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  align-self: stretch;
  border-radius: 20px;
  border: 1px solid var(--Moondust-Silver, #ebebeb);
  background: var(--Pure-Snow, #fffffe);
  width: 100%;

  /* Drop Shadow/XSmall */
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  .order-card-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .order-card-user-name {
    color: var(--Charcoal, #333);

    /* Paragraph/Meduim/Meduim */
    font-family: 'Poppins';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .order-card-id {
    color: var(--Charcoal, #333);

    /* Paragraph/Small/Regular */
    font-family: 'Poppins';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .order-card-status {
    display: flex;
    padding: 0px 8px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    border-radius: 4px;
  }
  .order-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
  }
  .order-card-footer-price {
    color: var(--Charcoal-Slate, #494949);

    /* Paragraph/Meduim/Meduim */
    font-family: 'Poppins';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .order-card-footer-mode {
    display: inline-block;
  }
}
</style>
