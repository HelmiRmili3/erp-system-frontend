<template>
  <div class="dashboard-container bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Admin Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Employees Card -->
      <div class="bg-blue-50 rounded-lg shadow p-4 flex flex-col items-center">
        <span class="text-blue-600 text-2xl font-bold">{{ employeesCount }}</span>
        <span class="text-gray-700">Total Employees</span>
      </div>

      <!-- Expenses Card -->
      <div class="bg-green-50 rounded-lg shadow p-4 flex flex-col items-center">
        <span class="text-green-600 text-2xl font-bold">
          {{ totalExpenses.toLocaleString() }} €
        </span>
        <span class="text-gray-700">Total Expenses</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app.store'
import { ref, onMounted } from 'vue'

const appStore = useAppStore()

// Example data (replace with API calls later)
const employeesCount = ref(0)
const totalExpenses = ref(0)

onMounted(() => {
  appStore.setLoading(false)

  // 👉 Replace this with real API calls
  employeesCount.value = 42
  totalExpenses.value = 12850.75
})
</script>
