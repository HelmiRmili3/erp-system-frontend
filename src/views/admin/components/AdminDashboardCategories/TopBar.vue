<template>
  <div class="flex justify-between items-center flex-row">
    <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
      <div class="flex flex-row gap-2.5 align-center">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
          >{{ count }} éléments</span
        >
        <button
          class="flex self-stretch justify-center items-center flex-row gap-[15px] p-1.5 rounded-[10px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)] bg-[#87C767] hover:bg-[#6E9E5E] cursor-pointer text-[#DCFFCB] disabled:opacity-50 disabled:cursor-not-allowed"
          @click="emits('addCategory')"
        >
          <addSvg />
          <span class="text-[#FFFFFE] text-xs">Add</span>
        </button>
      </div>
    </div>
    <div
      class="flex justify-start items-start flex-row bg-[#FFFFFE] rounded-[10px] shadow-[_0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
    >
      <div
        class="flex justify-center items-center flex-row gap-2.5 p-1.5 bg-[#87C767] rounded-tl-[10px] rounded-bl-[10px]"
      >
        <div class="flex justify-center items-center flex-row">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5H21"
              stroke="#FFFFFE"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3 9.5H21"
              stroke="#FFFFFE"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3 14.5H21"
              stroke="#FFFFFE"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3 19.5H21"
              stroke="#FFFFFE"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div
        class="flex justify-center items-center flex-row gap-2.5 py-1.5 px-[7px] bg-[rgba(220,255,203,0.5)] rounded-tr-[10px] rounded-br-[10px]"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 8.52V3.98C22 2.57 21.36 2 19.77 2H15.73C14.14 2 13.5 2.57 13.5 3.98V8.51C13.5 9.93 14.14 10.49 15.73 10.49H19.77C21.36 10.5 22 9.93 22 8.52Z"
            stroke="#87C767"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 19.77V15.73C22 14.14 21.36 13.5 19.77 13.5H15.73C14.14 13.5 13.5 14.14 13.5 15.73V19.77C13.5 21.36 14.14 22 15.73 22H19.77C21.36 22 22 21.36 22 19.77Z"
            stroke="#87C767"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z"
            stroke="#87C767"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z"
            stroke="#87C767"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import addSvg from '@/assets/svg/add.svg'

defineProps({
  count: Number
})

const emits = defineEmits<{
  (e: 'addCategory'): void
}>()
</script>
