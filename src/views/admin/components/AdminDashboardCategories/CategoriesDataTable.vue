<template>
  <data-table-header />
  <div class="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto">
    <template v-if="loading">
      <div
        class="flex flex-row gap-[15px] bg-white border-solid border-[#F2F2F2] border rounded-[10px]"
      >
        <div class="flex flex-1 flex-row gap-2.5 py-[11px] px-2.5">
          <skeleton width="100px" height="20px" />
        </div>
        <div class="flex flex-1 flex-row gap-2.5 py-[11px] px-2.5">
          <skeleton width="100px" height="20px" />
        </div>
        <div class="flex flex-1 flex-row gap-2.5 py-[11px] px-2.5">
          <skeleton width="100px" height="20px" />
        </div>
        <div class="flex basis-1/5 flex-col gap-2.5">
          <div class="flex self-stretch justify-start items-center flex-row gap-2.5 p-2.5">
            <skeleton width="20px" height="20px" v-if="withView" />
            <skeleton width="20px" height="20px" />
            <skeleton width="20px" height="20px" />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-if="isAdding"
        class="flex flex-row gap-[15px] bg-white border-solid border-[#F2F2F2] border rounded-[10px]"
      >
        <div class="flex flex-1 flex-row gap-2.5 py-[11px] px-2.5">
          <skeleton width="100px" height="20px" />
        </div>
        <div class="flex flex-1 flex-row gap-2.5 py-[11px] px-2.5">
          <skeleton width="100px" height="20px" />
        </div>
        <div class="flex flex-1 flex-row gap-2.5 py-[11px] px-2.5">
          <skeleton width="100px" height="20px" />
        </div>
        <div class="flex basis-1/5 flex-col gap-2.5">
          <div class="flex self-stretch justify-start items-center flex-row gap-2.5 p-2.5">
            <skeleton width="20px" height="20px" v-if="withView" />
            <skeleton width="20px" height="20px" />
            <skeleton width="20px" height="20px" />
          </div>
        </div>
      </div>
      <div
        v-for="category in categories"
        :key="category.id"
        class="flex flex-row gap-[15px] bg-white border-solid border-[#F2F2F2] border rounded-[10px]"
      >
        <!-- category image -->
        <div class="flex flex-1 flex-row gap-2.5 py-[11px] px-2.5">
          <Image
            v-if="category.logo"
            :src="baseUrl + category.logo"
            alt="category image"
            class="w-[40px] h-[40px] object-cover rounded-[10px] bg-slate-400"
            preview
          />
          <div v-else class="w-[40px] h-[40px] bg-[#E1E1E1] rounded-[10px]"></div>
        </div>
        <div class="flex flex-1 flex-row gap-2.5 py-[11px] px-2.5">
          <span class="text-[#5F6C7B] text-xs font-medium">{{ category.id }}</span>
        </div>
        <div class="flex flex-1 flex-row gap-2.5 py-[11px] px-2.5">
          <span class="text-[#5F6C7B] text-xs font-medium">{{ category.name }}</span>
        </div>

        <div class="flex basis-1/5 flex-col gap-2.5">
          <div class="flex self-stretch justify-start items-center flex-row gap-2.5 p-2.5">
            <!-- eye -->
            <button
              v-if="withView"
              class="flex self-stretch justify-center items-center flex-row gap-[15px] p-1.5 rounded-[10px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)] bg-[#e1e1e1] hover:bg-[#919191] cursor-pointer text-[#DCFFCB] disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="category.isLoading"
              @click="viewProducts(category)"
            >
              <eyeIcon v-if="!category.isLoading" />
              <ProgressSpinner v-else style="width: 1rem; height: 1rem" strokeWidth="6" />
            </button>
            <button
              class="flex self-stretch justify-center items-center flex-row gap-[15px] p-1.5 rounded-[10px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)] bg-[#87C767] hover:bg-[#6E9E5E] cursor-pointer text-[#DCFFCB] disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="category.isLoading"
              @click="handleEditCategory(category)"
            >
              <editSvg v-if="!category.isLoading" />
              <ProgressSpinner v-else style="width: 1rem; height: 1rem" strokeWidth="6" />
            </button>
            <button
              class="flex self-stretch justify-center items-center flex-row gap-[15px] p-1.5 rounded-[10px] shadow-[_0px_1px_2px_0px_rgba(16,24,40,0.05)] bg-[#FF5C5C] hover:bg-[#E53E3E] cursor-pointer text-[#FFFFFE] disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="category.isLoading"
              @click="handleDeleteCategory(category)"
            >
              <deleteSvg v-if="!category.isLoading" />
              <ProgressSpinner v-else style="width: 1rem; height: 1rem" strokeWidth="6" />
            </button>
          </div>
        </div>
      </div>
    </template>
    <div v-if="!loading && categories.length === 0" class="p-4 text-center text-gray-500">
      <p>No categories found</p>
      <p class="text-sm">Click the Add button to create a new category</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTableHeader from './DataTableHeader.vue'
import deleteSvg from '@/assets/svg/delete.svg'
import editSvg from '@/assets/svg/edit.svg'
import eyeIcon from '@/assets/svg/eye.svg'
import type { Category } from '@/models/Category.model'
import type { IsLoadable } from '@/models/common.model'
import Image from 'primevue/image'
import { useConfirm } from 'primevue/useconfirm'
defineProps<{
  categories: IsLoadable<Category>[]
  loading: boolean
  isAdding: boolean
  withView: boolean
}>()

const confirm = useConfirm()
const baseUrl = import.meta.env.VITE_BASE_URL + '/files/'

const emits = defineEmits<{
  (e: 'editCategory', category: Category): void
  (e: 'deleteCategory', category: Category): void
  (e: 'viewProducts', category: Category): void
}>()

const handleEditCategory = (category: Category) => {
  emits('editCategory', category)
}

const handleDeleteCategory = (category: Category) => {
  confirm.require({
    message: 'Are you sure you want to delete this category?',
    header: 'Delete Category',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    rejectLabel: 'No',
    acceptLabel: 'Yes',
    accept: () => {
      emits('deleteCategory', category)
    }
  })
}

const viewProducts = (category: Category) => {
  emits('viewProducts', category)
}
</script>
