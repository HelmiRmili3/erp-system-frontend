<template>
  <div class="p-6">
    <Textarea
      v-model="cancelMessage"
      placeholder="Please enter cancellation reason..."
      class="w-full p-3 border-2 border-red-300 rounded-lg focus:border-red-500 focus:outline-none mb-4 min-h-[100px]"
    ></Textarea>
    <div class="flex justify-end">
      <button
        @click="confirmCancel"
        :disabled="!cancelMessage.trim()"
        class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirm Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'

const dialogRef = inject<any>('dialogRef')
const cancelMessage = ref('')

const confirmCancel = () => {
  if (!dialogRef?.value) return
  dialogRef.value.close({
    doLogic: true,
    message: cancelMessage.value
  })
}
</script>
