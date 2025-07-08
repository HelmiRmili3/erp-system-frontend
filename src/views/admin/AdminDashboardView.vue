<template>
  <div class="flex gap-4">
    <the-side-bar />
    <div class="flex-grow">
      <top-bar />
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import TheSideBar from '@/views/admin/components/SideBar/TheSideBar.vue'
import TopBar from '@/views/admin/components/TopBar/TopBar.vue'

// remove all listeners from all channels
</script>
<style lang="scss">
.dashboard-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  width: 100%;
  .dashboard-container-left {
    flex: 4;
  }
  .dashboard-container-right {
    flex: 1;
  }
}
</style>
