<template>
  <div class="dashboard-container bg-white rounded-lg shadow-lg p-2">Dashboard</div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app.store'

const appStore = useAppStore()
appStore.setLoading(false)
</script>

<style></style>
