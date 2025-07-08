<template>
  <div class="p-6 bg-white w-1/2 flex flex-col justify-between relative">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">
        <i class="pi pi-money-bill"></i>
        Logo Managment
      </h2>
      <button
        @click="handleSubmit"
        v-if="hasChanges"
        :disabled="loading"
        class="flex self-stretch justify-center items-center flex-row gap-[15px] p-2.5 rounded-[10px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)] bg-[#87C767] hover:bg-[#6E9E5E] cursor-pointer text-[#DCFFCB] disabled:opacity-50 disabled:cursor-not-allowed"
        v-tooltip.bottom="'Save Changes'"
      >
        <i class="pi pi-check"></i>
      </button>
      <!-- cancel -->
      <button
        v-if="hasChanges"
        @click="cancel"
        class="flex self-stretch justify-center items-center flex-row gap-[15px] p-2.5 rounded-[10px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)] bg-[#FF5C5C] hover:bg-[#E53E3E] cursor-pointer text-[#FFFFFE] disabled:opacity-50 disabled:cursor-not-allowed"
        v-tooltip.bottom="'Cancel'"
      >
        <i class="pi pi-times"></i>
      </button>
    </div>
    <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    <div>
      <div class="flex items-center gap-8">
        <!-- preview existing image -->
        <div class="flex flex-col gap-2">
          <Image
            v-if="value"
            :src="value"
            alt="category image"
            class="w-14 h-14 rounded-[10px]"
            imageStyle="object-fit: contain"
            preview
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="file" class="text-gray-700">Replace Logo</label>
          <input
            ref="input"
            type="file"
            id="file"
            multiple="false"
            class="w-full h-10 text-gray-700 rounded border-gray-300"
            @change="changeFile"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import submitSvg from '@/assets/svg/submit.svg'
import { ref } from 'vue'

defineProps<{
  value: string
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'save', value: { value: File }): void
}>()

const input = ref<HTMLInputElement>()
const localValue = ref<File>()
const hasChanges = ref(false)

const handleSubmit = async () => {
  if (!localValue.value) return
  emit('save', { value: localValue.value })
}

const changeFile = (e: Event) => {
  ;('changeFile')
  const target = e.target as HTMLInputElement
  if (target.files) {
    localValue.value = target.files[0]
    hasChanges.value = true
  }
}

const cancel = () => {
  if (input.value) input.value.value = ''
  localValue.value = undefined
  hasChanges.value = false
}
</script>
