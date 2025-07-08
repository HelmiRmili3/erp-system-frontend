<template>
  <div class="p-6">
    <div class="grid grid-cols-2 gap-4 mb-6">
      <button
        v-for="option in options"
        :key="option"
        @click="selectOptionAndClose(option)"
        class="p-4 bg-white border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors duration-200 flex flex-col items-center justify-center min-h-[100px] shadow-sm hover:shadow-md"
      >
        <span class="text-2xl font-bold text-green-600">{{ option }}</span>
      </button>
    </div>
    <div class="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Custom time (e.g., 20 minutes)"
        class="flex-1 p-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
        v-model="customTime"
      />
      <button
        @click="selectOptionAndClose(customTime)"
        :disabled="!customTime"
        class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirm
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue'

const dialogRef = inject<any>('dialogRef')

const options = ['15 minutes', '30 minutes', '45 minutes', '1 hour']
const customTime = ref('')

const selectOptionAndClose = (option: string) => {
  if (!dialogRef?.value) return
  dialogRef.value.close({
    doLogic: true,
    option
  })
}
</script>
