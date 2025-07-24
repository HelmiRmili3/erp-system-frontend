<template>
  <FloatLabel class="w-full mt-5" variant="on">
    <IconField>
      <InputIcon>
        <slot name="icon" />
      </InputIcon>
      <Select
        :id="id"
        v-model="localValue"
        :options="options"
        :optionLabel="optionLabel"
        :optionValue="optionValue"
        class="w-full p-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-green-500"
        @change="$emit('change', $event)"
        @blur="$emit('blur', $event)"
      />
      <label :for="id" class="block text-gray-400 text-lg font-medium mb-2">{{ label }}</label>
    </IconField>
  </FloatLabel>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: String,
  modelValue: [String, Number, Object],
  options: Array,
  optionLabel: String,
  optionValue: String,
  label: String
})

const emit = defineEmits(['update:modelValue', 'change', 'blur'])

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
