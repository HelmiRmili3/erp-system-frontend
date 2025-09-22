<template>
  <DashboardWrapper>
    <!-- Sticky header -->
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Gestion des Permissions">
        <template #icon>
          <PermissionsFilledIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>

    <!-- Toolbar -->
    <div class="flex justify-between items-center flex-row">
      <span class="text-[#494949] text-xs font-medium">
        {{ permissionsStore.totalRecords }} records
      </span>

      <div class="flex gap-4">
        <InputText
          v-model="searchQuery"
          placeholder="Rechercher..."
          class="pl-10 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>

    <div class="h-[20px]"></div>

    <!-- Permissions DataTable -->
    <DataTable
      :value="permissionsStore.permissions"
      class="p-datatable-sm"
      :rows="permissionsStore.pageSize"
      :totalRecords="permissionsStore.totalRecords"
      :first="(permissionsStore.currentPage - 1) * permissionsStore.pageSize"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      tableStyle="min-width: 800px"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <Column field="name" header="Nom" sortable style="min-width: 100px" />
      <Column field="description" header="Description" sortable style="min-width: 100px" />

      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">Aucune permission trouvée</p>
        </div>
      </template>
    </DataTable>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/app.store'
import DashboardWrapper from './components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from './components/AdminDashboardOrders/SectionHeader.vue'
import PermissionsFilledIcon from '@/assets/svg/eye.svg'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

import { usePermissionsStore } from '@/stores/permissions.store'

const appStore = useAppStore()
const permissionsStore = usePermissionsStore()

const searchQuery = ref('')

/* ---------- Lifecycle ---------- */
onMounted(async () => {
  await permissionsStore.fetchAllPermissions(
    permissionsStore.currentPage,
    permissionsStore.pageSize,
    searchQuery.value
  )
  appStore.setLoading(false)
})

// Handle pagination
const onPage = async (event: any) => {
  const { page, rows } = event
  await permissionsStore.setPageAndSize(page + 1, rows, searchQuery.value)
}

// Watch search and refetch
watch(searchQuery, async (newVal) => {
  await permissionsStore.setPageAndSize(1, permissionsStore.pageSize, newVal)
})
</script>
