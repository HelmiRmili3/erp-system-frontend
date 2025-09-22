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
          <div class="flex gap-1">
            <Button
              icon="pi pi-check"
              rounded
              text
              severity="success"
              @click="accept(data.id)"
              v-tooltip="'Accepter'"
            />
            <Button
              icon="pi pi-times"
              rounded
              text
              severity="danger"
              @click="reject(data.id)"
              v-tooltip="'Rejeter'"
            />
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

    <!-- Add/Update Modal -->
    <!-- <Dialog
      v-model:visible="showModal"
      :header="isUpdateMode ? 'Modifier Absence' : 'Ajouter Absence'"
      modal
      :style="{ width: '500px' }"
      class="p-4"
    >
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="startDate" class="text-sm font-medium text-gray-700">Date de début</label>
          <InputText
            type="date"
            v-model="formData.startDateDisplay"
            required
            class="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="endDate" class="text-sm font-medium text-gray-700">Date de fin</label>
          <InputText
            type="date"
            v-model="formData.endDateDisplay"
            required
            class="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="absenceType" class="text-sm font-medium text-gray-700">Type d'absence</label>
          <Dropdown
            v-model="formData.absenceType"
            :options="absenceTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Sélectionner un type"
            class="border border-gray-300 rounded-lg"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="reason" class="text-sm font-medium text-gray-700">Raison</label>
          <Textarea
            v-model="formData.reason"
            required
            rows="4"
            class="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button label="Annuler" severity="secondary" text @click="closeModal" />
          <Button :label="isUpdateMode ? 'Modifier' : 'Ajouter'" severity="success" type="submit" />
        </div>
      </form>
    </Dialog> -->
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
import Dialog from 'primevue/dialog'

import { useToast } from 'primevue/usetoast'
import { useAbsencesStore } from '@/stores/absence.store'

const appStore = useAppStore()
const absencesStore = useAbsencesStore()

const { getAbsenceTypeName, getAbsenceStatusName } = useAbsenceEnums()
const toast = useToast()

// Modal state
// const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedAbsenceId = ref<number | null>(null)
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
const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedAbsenceId.value = null
}

// const confirmDelete = async () => {
//   if (selectedAbsenceId.value) {
//     try {
//       // await absencesStore.removeAbsence(selectedAbsenceId.value)
//       // toast.add({
//       //   severity: 'success',
//       //   summary: 'Succès',
//       //   detail: 'Absence supprimée avec succès',
//       //   life: 3000
//       // })
//     } catch (error) {
//       console.error('Error deleting absence:', error)
//       toast.add({
//         severity: 'error',
//         summary: 'Erreur',
//         detail: "Échec de la suppression de l'absence",
//         life: 3000
//       })
//     }
//   }
//   closeDeleteModal()
// }
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
