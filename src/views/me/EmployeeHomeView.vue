<template>
  <div class="dashboard-container bg-white rounded-lg shadow-lg p-2">Home</div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app.store'
import { onMounted } from 'vue'

const appStore = useAppStore()
onMounted(() => {
  appStore.setLoading(false)
})
</script>

<style></style>
