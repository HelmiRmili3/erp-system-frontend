<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Employees Absences Management">
        <template #icon>
          <AbsencesFilledIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <div class="flex flex-row gap-2.5 align-center">
          <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
            >{{ absencesStore.absences.length }} records</span
          >
        </div>
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
          <InputText
            v-model="searchQuery"
            placeholder="Rechercher..."
            class="pl-10 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
    <div class="h-[20px]"></div>
    <!-- Absences DataTable -->
    <DataTable
      :value="absencesStore.absences"
      class="p-datatable-sm"
      :rows="absencesStore.pageSize"
      :totalRecords="absencesStore.totalRecords"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <!-- Existing Columns and Templates -->
      <Column header="Employee" style="min-width: 200px">
        <template #body="{ data }">
          <div class="flex items-center gap-3">
            <img
              :src="`${appStore.baseURL + data.user.fileUrl}`"
              alt="Avatar"
              class="w-8 h-8 rounded-full object-cover border"
            />
            <span>{{ data.user.userName }}</span>
          </div>
        </template>
      </Column>
      <Column field="startDate" header="Date de début" sortable style="width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.startDate) }}</div>
        </template>
      </Column>
      <Column field="endDate" header="Date de fin" sortable style="width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.endDate) }}</div>
        </template>
      </Column>
      <Column field="absenceType" header="Type" sortable style="width: 120px">
        <template #body="{ data }">
          <div>{{ getAbsenceTypeName(data.absenceType) }}</div>
        </template>
      </Column>
      <Column field="statusType" header="Statut" sortable style="width: 120px">
        <template #body="{ data }">
          <div>{{ getAbsenceStatusName(data.statusType) }}</div>
        </template>
      </Column>
      <Column field="reason" header="Raison" sortable style="min-width: 200px">
        <template #body="{ data }">
          <div>{{ data.reason }}</div>
        </template>
      </Column>
      <Column header="Actions" style="width: 150px">
        <template #body="{ data }">
          <div class="flex gap-1" v-if="data.status === 0">
            <!-- Pending only -->
            <Button
              icon="pi pi-check"
              rounded
              text
              severity="success"
              @click="accept(data.id)"
              v-tooltip="'Accept'"
            />
            <Button
              icon="pi pi-times"
              rounded
              text
              severity="danger"
              @click="reject(data.id)"
              v-tooltip="'Reject'"
            />
          </div>
          <div v-else>
            <span class="text-gray-500"></span>
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">Aucune absence trouvée</p>
        </div>
      </template>
    </DataTable>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { useAbsenceEnums } from '@/composables/useAbsenceEnums'
import DashboardWrapper from './components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from './components/AdminDashboardOrders/SectionHeader.vue'
import AbsencesFilledIcon from '@/assets/svg/orders.svg'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import { useAbsencesStore } from '@/stores/absence.store'

const appStore = useAppStore()
const absencesStore = useAbsencesStore()

const { getAbsenceTypeName, getAbsenceStatusName } = useAbsenceEnums()

// Modal state
// const showModal = ref(false)

const searchQuery = ref('')
computed(() => {
  if (!searchQuery.value) return absencesStore.absences
  const query = searchQuery.value.toLowerCase()
  return absencesStore.absences.filter(
    (absence) =>
      absence &&
      (getAbsenceTypeName(absence.absenceType)?.toLowerCase().includes(query) ||
        getAbsenceStatusName(absence.statusType)?.toLowerCase().includes(query) ||
        absence.reason?.toLowerCase().includes(query) ||
        absence.id.toString().includes(query))
  )
})

// Fetch absences when component is mounted
onMounted(async () => {
  await absencesStore.fetchAbsences(absencesStore.currentPage, absencesStore.pageSize)
  appStore.setLoading(false)
})
const onPage = async (event: any) => {
  const { page, rows } = event // page is 0-based
  await absencesStore.setPageAndSize(page + 1, rows)
}
// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
const accept = async (id: string) => {
  await absencesStore.acceptAbsence(id)
}

const reject = async (id: string) => {
  await absencesStore.rejectAbsence(id)
}
</script>

<style scoped>
* {
  font-family: 'Poppins', sans-serif;
}

.p-datatable .p-datatable-tbody > tr {
  cursor: pointer;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background-color: #f8f9fa;
}
.p-paginator {
  display: flex;
  justify-content: center;
  padding: 1rem;
}
.p-paginator .p-paginator-pages .p-paginator-page {
  margin: 0 0.5rem;
}
</style>
