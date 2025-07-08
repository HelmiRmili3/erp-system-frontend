<template>
  <div class="p-6 bg-white w-1/2 flex flex-col justify-between relative">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">
        <slot />
        {{ title }}
      </h2>
      <button
        @click="handleSubmit"
        v-if="hasChanges"
        :disabled="loading || !!errorMessage"
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
      <div class="flex flex-col gap-2">
        <FloatLabel class="flex w-full items-center" variant="on">
          <InputText
            v-model="localValue"
            :disabled="loading"
            input-id="value"
            :class="['w-full h-10 rounded border-gray-300', errorMessage ? 'border-red-500' : '']"
          />
          <label for="value" class="ml-3 text-gray-700">{{ label }}</label>
        </FloatLabel>
        <span v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import submitSvg from '@/assets/svg/submit.svg'
import { ref, watch } from 'vue'

interface ValidationRule {
  validate: (value: string) => boolean
  message: string
}

const props = defineProps<{
  initialValue: string
  loading: boolean
  title: string
  label: string
  validationRules?: ValidationRule[]
}>()

const emit = defineEmits<{
  (e: 'save', value: { value: string }): void
}>()

const localValue = ref('')
const hasChanges = ref(false)
const errorMessage = ref('')

watch(
  () => [props.initialValue],
  () => {
    localValue.value = props.initialValue
    hasChanges.value = false
    validateInput()
  },
  { immediate: true, deep: true }
)

function validateInput() {
  if (props.validationRules && props.validationRules.length > 0) {
    for (const rule of props.validationRules) {
      const isValid = rule.validate(localValue.value)
      if (!isValid) {
        errorMessage.value = rule.message
        return
      }
    }

    errorMessage.value = ''
  } else {
    errorMessage.value = ''
  }
}

const checkForChanges = () => {
  hasChanges.value = localValue.value !== props.initialValue
}

watch(
  () => [localValue.value],
  () => {
    checkForChanges()
    validateInput()
  },
  { deep: true }
)

const handleSubmit = async () => {
  if (!errorMessage.value) {
    emit('save', { value: localValue.value })
  }
}
</script>
