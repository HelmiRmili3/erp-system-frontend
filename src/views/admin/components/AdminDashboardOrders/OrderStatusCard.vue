<template>
  <div
    class="flex flex-1 justify-between items-center flex-row py-[9px] px-[20px] border-solid border-b"
    :class="`border-[${color}] ${count ? 'cursor-pointer' : 'cursor-not-allowed'}`"
    @click="onItemClick"
  >
    <div class="flex justify-start items-start flex-row gap-2.5 px-[5px]">
      <span class="text-xs" :class="`text-[${color}]`">{{ label }}</span>
    </div>
    <div
      class="flex justify-start items-start flex-col gap-2.5 px-2 rounded-[10px]"
      :class="`bg-[${bgColor}]`"
    >
      <ProgressSpinner
        style="width: 1rem; height: 1rem; stroke: #5198ff"
        strokeWidth=".3rem"
        v-if="count === -1"
      />
      <span v-else class="text-xs" :class="`text-[${color}]`">{{ count }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  count: number
  selected: boolean
}>()

const emits = defineEmits(['click'])

const selectedColor = '#87C767'
const selectedBgColor = '#DCFFCB'
const normalColor = '#5F6C7B'
const normalBgColor = '#EDF4F8'

const onItemClick = () => {
  if (props.count) emits('click')
}

const color = computed(() => {
  return props.selected ? selectedColor : normalColor
})

const bgColor = computed(() => {
  return props.selected ? selectedBgColor : normalBgColor
})
</script>

<style scoped></style>
