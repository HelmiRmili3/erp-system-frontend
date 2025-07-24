<template>
  <div v-if="firstError" class="text-red-500 text-sm mt-2">
    <span>{{ firstError }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  validation: {
    type: Object,
    required: true
  },
  messages: {
    type: Object,
    required: true
  }
})

const firstError = computed(() => {
  const v = props.validation
  if (!v?.$error) return ''

  for (const rule in props.messages) {
    if (v[rule]?.$invalid) {
      return props.messages[rule]
    }
  }

  return ''
})
</script>
