<template>
  <div
    class="flex self-stretch justify-start items-center flex-row gap-2.5 py-2.5 px-[29px] border-solid border-[#F2F2F2] border-b rounded-tl-[20px] rounded-tr-[20px] h-[60px]"
  >
    <div class="flex justify-center items-start flex-col" v-if="isOpen">
      <span class="text-[#494949] font-semibold">{{ title }}</span>
      <span class="text-[#5F6C7B] text-[10px]">{{ subtitle }}</span>
    </div>
    <div
      class="w-[59px] h-[31px]"
      :style="`background: url(${pathToFullUrl(logo)}); background-size: cover; background-position: center; object-fit: cover;`"
    ></div>
  </div>
</template>

<script setup>
const pathToFullUrl = (path) => {
  if (!path) return 'https://placehold.co/48x48'
  return import.meta.env.VITE_BASE_URL + '/files/' + path
}

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})
</script>
