<template>
  <div class="flex self-stretch justify-between items-center flex-row">
    <div
      class="flex justify-start items-center flex-row gap-2 p-2 bg-[#FFFFFE] border-solid border-[#EBEBEB] border rounded-[10px] w-1/3"
    >
      <search-icon></search-icon>
      <span class="text-[#91A1AF] text-sm">Rechercher</span>
    </div>
    <div class="flex justify-start items-center flex-row gap-[15px]">
      <div
        class="flex justify-start items-center flex-row gap-2.5 p-[5px] bg-[#DCFFCB] rounded-[50px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)]"
      >
        <div v-for="filter in filterBar" :key="filter.id" @click="onFilterClick(filter)">
          <div
            :class="`flex justify-center items-center flex-row gap-2.5 py-[5px] px-2.5 cursor-pointer ${
              filter.selected ? 'bg-[#87C767]' : 'bg-[#DCFFCB]'
            } rounded-[50px]`"
          >
            <span
              :class="` text-sm text-center font-medium ${
                filter.selected ? 'bg-[#87C767]' : 'bg-[#DCFFCB]'
              }
            ${filter.selected ? 'text-[#FFFFFE]' : 'text-[#87C767]'}
            `"
              >{{ filter.label }}</span
            >
          </div>
        </div>
      </div>
      <div
        class="flex justify-center items-center flex-row gap-[5px] p-2.5 border-solid border-[#EBEBEB] border rounded-[10px]"
      >
        <div class="flex justify-center items-center flex-row">
          <calendar-icon></calendar-icon>
        </div>
        <DatePicker
          class="w-1/2"
          v-model="date"
          @date-select="(date) => onFilterClick({ id: date }, true)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchIcon from './searchIcon.svg?component'
import CalendarIcon from './calendarIcon.svg?component'

import { computed, ref } from 'vue'

const emits = defineEmits(['filter'])

const date = ref()

const filterBar = ref([
  { id: 'today', label: 'Today', selected: true },
  { id: 'week', label: 'This week', selected: false },
  { id: 'month', label: 'This month', selected: false }
])

const selectedFilter = computed(() => filterBar.value.find((item) => item.selected))

const onFilterClick = (filter: any, isDate = false) => {
  if (!isDate) date.value = null
  const oldFilter = selectedFilter.value
  const newFilter = filterBar.value.find((item) => item.id === filter.id)

  if (oldFilter && newFilter && oldFilter === newFilter) return

  if (oldFilter) {
    oldFilter.selected = false
  }

  if (newFilter) newFilter.selected = true

  if (isDate) {
    const date = new Date(filter.id)
    let days: string | number = date.getDate()
    let month: string | number = date.getMonth() + 1
    const year = date.getFullYear()

    if (days < 10) days = `0${days}`
    if (month < 10) month = `0${month}`

    emits('filter', `${year}-${month}-${days}`)
    return
  }
  emits('filter', filter.id)
}

emits('filter', selectedFilter.value?.id)
</script>
