<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

import { useAppStore } from '@/stores/app.store'

const appStore = useAppStore()

onMounted(() => {
  appStore.setLoading(false)
})
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
}
</style>
