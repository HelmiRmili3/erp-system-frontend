<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>

    <!-- Drag & Drop Area -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="triggerFileSelect"
      :class="[
        'border-dashed border-2 rounded-lg px-3 py-2 flex items-center justify-center gap-2 cursor-pointer transition-colors',
        isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'
      ]"
    >
      <span v-if="files.length === 0" class="text-gray-500 text-sm">
        Drop / Select <span v-if="multiple">(multiple files supported)</span>
      </span>
      <span v-else class="text-gray-700 text-sm truncate">
        {{ files.map((f) => f.name).join(', ') }}
      </span>
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="onFileChange"
        class="hidden"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  label?: string
  modelValue: File | File[] | null
  multiple?: boolean
  accept?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | File[] | null): void
}>()

const files = ref<File[]>([])
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    if (!val) files.value = []
    else if (Array.isArray(val)) files.value = val
    else files.value = [val]
  },
  { immediate: true }
)

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  files.value = props.multiple ? Array.from(target.files) : [target.files[0]]
  emit('update:modelValue', props.multiple ? files.value : files.value[0])
}

const onDrop = (event: DragEvent) => {
  const droppedFiles = event.dataTransfer?.files
  if (!droppedFiles) return
  files.value = props.multiple ? Array.from(droppedFiles) : [droppedFiles[0]]
  emit('update:modelValue', props.multiple ? files.value : files.value[0])
  isDragging.value = false
}
</script>

<style scoped>
/* Make the height consistent with other input fields */
.border-dashed {
  min-height: 40px; /* adjust based on your other inputs */
}
</style>
