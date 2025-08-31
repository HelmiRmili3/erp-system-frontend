<template>
  <div class="p-6 bg-white w-1/2 flex flex-col justify-between relative">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">
        <i class="pi pi-money-bill"></i>
        Currency Managment
      </h2>
      <button
        @click="handleSubmit"
        v-if="hasChanges"
        :disabled="loading"
        class="flex self-stretch justify-center items-center flex-row gap-[15px] p-2.5 rounded-[10px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)] bg-[#87C767] hover:bg-[#6E9E5E] cursor-pointer text-[#DCFFCB] disabled:opacity-50 disabled:cursor-not-allowed"
        v-tooltip.bottom="'Save Changes'"
      >
        <!-- <submitSvg /> -->
        <i class="pi pi-check"></i>
      </button>
    </div>
    <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    <div>
      <div class="flex items-center gap-8">
        <FloatLabel class="flex w-full items-center" variant="on">
          <Select
            v-model="localCurrency"
            :options="currencies"
            option-label="label"
            option-value="value"
            checkmark
            :disabled="loading"
            input-id="currency"
            class="w-full h-10 text-gray-700 rounded border-gray-300"
          />
          <label for="currency" class="ml-3 text-gray-700">Currency</label>
        </FloatLabel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currencies } from '@/models/configuration.model'
import { ref, watch } from 'vue'

const props = defineProps<{
  currency: string
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'save', value: { currency: string }): void
}>()

const localCurrency = ref('')
const hasChanges = ref(false)

watch(
  () => [props.currency],
  () => {
    localCurrency.value = props.currency
    hasChanges.value = false
  },
  { immediate: true, deep: true }
)

const checkForChanges = () => {
  hasChanges.value = localCurrency.value !== props.currency
}

watch(
  () => [localCurrency.value],
  () => {
    checkForChanges()
  },
  { deep: true }
)

const handleSubmit = async () => {
  emit('save', { currency: localCurrency.value })
}
</script>
