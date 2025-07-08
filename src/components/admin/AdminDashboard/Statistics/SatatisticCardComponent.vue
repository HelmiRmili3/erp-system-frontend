<template>
  <div class="statistic-card" :style="{ backgroundColor: stat?.background }">
    <div class="statistic-card-header">
      <div class="statistic-card-header-title">{{ stat?.title }}</div>
      <div
        class="statistic-card-header-pourcentage"
        :style="{ color: stat?.isUp ? '#87C767' : '#fc6f67' }"
      >
        <i
          :class="`pi pi-arrow-${stat?.isUp ? 'up' : 'down'}`"
          :style="{ fontSize: '0.6rem', color: stat?.isUp ? '#87C767' : '#fc6f67' }"
        ></i>
        {{ stat?.pourcentage }} %
      </div>
    </div>
    <div class="statistic-card-detail">
      <div class="statistic-card-detail-icon">
        <component :is="stat?.icon"></component>
      </div>
      <div class="statistic-card-detail-value">{{ stat?.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stats } from '@/models/Dashboard.model'
const { stat } = defineProps<{
  stat: Stats | null
}>()
</script>

<style lang="scss">
.statistic-card {
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  border: 1px solid var(--Cloud-Whisper, #f2f2f2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    &-title {
      color: var(--Charcoal-Slate, #494949);
      /* Paragraph/Large/Semi bold */
      font-family: 'Poppins';
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
    &-pourcentage {
      font-family: 'Poppins';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
  &-detail {
    display: flex;
    align-items: center;
    gap: 15px;
    align-self: stretch;
    &-icon {
      font-size: 40px;
      color: #f1c40f;
    }
    &-value {
      color: var(--Charcoal-Slate, #494949);

      /* Paragraph/Heading/H5/semi bold */
      font-family: 'Poppins';
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
}
</style>
