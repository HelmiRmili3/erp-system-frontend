<template>
  <div class="dashboard-wrapper">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.dashboard-wrapper {
  position: relative;
  padding: 20px;
  padding-top: 0;
  background-color: #f9f9f9;
  border-radius: 10px;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}
</style>
