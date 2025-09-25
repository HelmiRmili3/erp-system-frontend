<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Contract Management">
        <template>
          <ContractsIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
          >{{ filteredContracts.length }} records</span
        >
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
          <InputText
            v-model="mycontractsStore.searchQuery"
            placeholder="Rechercher..."
            class="pl-10 py-2 border border-gray-300 rounded-lg"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Contracts DataTable -->
    <DataTable
      :value="filteredContracts"
      class="p-datatable-sm"
      :loading="mycontractsStore.loading"
      :rows="mycontractsStore.pageSize"
      :totalRecords="filteredContracts.length"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <!-- Columns -->
      <Column field="contractType" header="Type" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ getContractTypeName(data.contractType) }}</div>
        </template>
      </Column>
      <Column field="startDate" header="Start date" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.startDate) }}</div>
        </template>
      </Column>
      <Column field="endDate" header="End date" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.endDate) }}</div>
        </template>
      </Column>
      <Column field="fileUrl" header="Contract" style="min-width: 150px">
        <template #body="{ data }">
          <a
            v-if="data.fileUrl && data.fileUrl !== 'string'"
            :href="`${appStore.baseURL + data.fileUrl}`"
            target="_blank"
            class="text-blue-600 hover:underline"
            >Open</a
          >
          <span v-else>N/A</span>
        </template>
      </Column>
      <Column field="status" header="Statut" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ getEmployeeStatusName(data.status) }}</div>
        </template>
      </Column>
      <Column header="Details" style="min-width: 120px">
        <template #body="{ data }">
          <Button
            label="See More"
            text
            severity="info"
            @click="openDetailsModal(data)"
            v-tooltip="'See more'"
          />
        </template>
      </Column>
      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">Aucun contrat trouvé</p>
        </div>
      </template>
    </DataTable>
    <!-- Details Popup -->
    <Dialog
      v-model:visible="showDetailsModal"
      header="Détails du Contrat"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Type:</span>
            <span>{{ getContractTypeName(selectedContract?.contractType) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Date Début:</span>
            <span>{{ formatDate(selectedContract?.startDate) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Date Fin:</span>
            <span>{{ formatDate(selectedContract?.endDate) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Fichier:</span>
            <a
              v-if="selectedContract?.fileUrl && selectedContract.fileUrl !== 'string'"
              :href="`${appStore.baseURL + selectedContract.fileUrl}`"
              target="_blank"
              class="text-blue-600 hover:underline"
              >Voir PDF</a
            >
            <span v-else>N/A</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Statut:</span>
            <span>{{ getEmployeeStatusName(selectedContract?.status) }}</span>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <Button label="Fermer" severity="secondary" text @click="closeDetailsModal" />
        </div>
      </div>
    </Dialog>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { useContractEnums } from '@/composables/useContractEnums'
import DashboardWrapper from '../admin/components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from '../admin/components/AdminDashboardOrders/SectionHeader.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import ContractsIcon from '@/components/icons/ContractsIcon.vue'
import { useMyContractsStore } from '@/stores/myContracts.store'

const appStore = useAppStore()
const mycontractsStore = useMyContractsStore()
const { getContractTypeName, getEmployeeStatusName } = useContractEnums()
const toast = useToast()

// Modal state
const showDetailsModal = ref(false)
const selectedContract = ref<any>(null)

const formData = reactive({
  userId: '',
  contractType: 0,
  startDate: '', // ISO string (e.g., 2025-07-04T00:00:00Z)
  startDateDisplay: '', // YYYY-MM-DD for input
  endDate: '', // ISO string
  endDateDisplay: '', // YYYY-MM-DD for input
  fileUrl: '',
  status: 0
})

// Safe filtered contracts to prevent errors
const filteredContracts = computed(() => {
  if (!Array.isArray(mycontractsStore.contracts)) {
    console.warn('Contracts data is not an array:', mycontractsStore.contracts)
    return []
  }

  // Filter out any non-object items (like numbers, strings, etc.)
  const validContracts = mycontractsStore.contracts.filter(
    (contract) =>
      contract &&
      typeof contract === 'object' &&
      !Array.isArray(contract) &&
      contract.id !== undefined // Ensure it has at least an id property
  )

  // Log any invalid items for debugging
  if (validContracts.length !== mycontractsStore.contracts.length) {
    const invalidItems = mycontractsStore.contracts.filter(
      (item) => !item || typeof item !== 'object' || Array.isArray(item)
    )
    console.warn('Filtered out invalid contract items:', invalidItems)
  }

  return validContracts
})

// Fetch contracts when component is mounted
onMounted(async () => {
  await mycontractsStore.fetchUserContracts()
  appStore.setLoading(false)
})

// Handle search with debounce
const handleSearch = () => {
  mycontractsStore.setPageAndSize(1, mycontractsStore.pageSize, mycontractsStore.searchQuery)
}

// Handle pagination
const onPage = async (event: any) => {
  const { page, rows } = event // page is 0-based in PrimeVue
  await mycontractsStore.setPageAndSize(page + 1, rows, mycontractsStore.searchQuery)
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'

  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

const openDetailsModal = (contract: any) => {
  selectedContract.value = contract
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedContract.value = null
}

// Watchers to sync date inputs with ISO strings
watch(
  () => formData.startDateDisplay,
  (newDate) => {
    if (newDate) {
      const [year, month, day] = newDate.split('-')
      const date = new Date(formData.startDate || new Date())
      date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
      formData.startDate = date.toISOString()
    }
  }
)

watch(
  () => formData.endDateDisplay,
  (newDate) => {
    if (newDate) {
      const [year, month, day] = newDate.split('-')
      const date = new Date(formData.endDate || new Date())
      date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
      formData.endDate = date.toISOString()
    } else {
      formData.endDate = ''
    }
  }
)
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
