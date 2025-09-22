```vue
<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Employees Contracts Management">
        <template>
          <ContractsIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
          >{{ contractsStore.totalRecords }} records</span
        >
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
          <InputText
            v-model="contractsStore.searchQuery"
            placeholder="Rechercher..."
            class="pl-10 py-2 border border-gray-300 rounded-lg"
            @input="
              contractsStore.setPageAndSize(1, contractsStore.pageSize, contractsStore.searchQuery)
            "
          />
        </div>
        <!-- Add Contract Button -->
        <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" />
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Contracts DataTable -->
    <DataTable
      :value="contractsStore.contracts"
      class="p-datatable-sm"
      :rows="contractsStore.pageSize"
      :totalRecords="contractsStore.totalRecords"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <!-- Columns -->
      <Column header="Employee" style="min-width: 200px">
        <template #body="{ data }">
          <div class="flex items-center gap-3">
            <img
              :src="
                data.user?.fileUrl
                  ? appStore.baseURL + data.user.fileUrl
                  : 'https://avatar.iran.liara.run/public/17'
              "
              alt="Avatar"
              class="w-8 h-8 rounded-full object-cover border"
            />
            <span>{{ data.user?.userName || 'Unknown' }}</span>
          </div>
        </template>
      </Column>

      <Column field="contractType" header="Type" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ getContractTypeName(data.contractType) }}</div>
        </template>
      </Column>
      <Column field="startDate" header="Date Début" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.startDate) }}</div>
        </template>
      </Column>
      <Column field="endDate" header="Date Fin" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.endDate) }}</div>
        </template>
      </Column>
      <Column field="fileUrl" header="Fichier" style="min-width: 150px">
        <template #body="{ data }">
          <a
            v-if="data.fileUrl && data.fileUrl !== 'string'"
            :href="`${appStore.baseURL + data.fileUrl}`"
            target="_blank"
            class="text-blue-600 hover:underline"
            >Voir PDF</a
          >
          <span v-else>N/A</span>
        </template>
      </Column>
      <Column field="status" header="Statut" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ getEmployeeStatusName(data.status) }}</div>
        </template>
      </Column>
      <Column header="Détails" style="min-width: 120px">
        <template #body="{ data }">
          <Button
            label="See More"
            text
            severity="info"
            @click="openDetailsModal(data)"
            v-tooltip="'Voir Détails'"
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
    <!-- Add Modal -->
    <Dialog
      v-model:visible="showAddModal"
      header="Ajouter Contrat"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="userId" class="text-sm font-medium text-gray-700">Utilisateur</label>
            <UserSelectDropdown
              v-model="formData.userId"
              placeholder="Sélectionner un utilisateur"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="contractType" class="text-sm font-medium text-gray-700"
              >Type de Contrat</label
            >
            <Dropdown
              v-model="formData.contractType"
              :options="contractTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner un type"
              required
              class="border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="startDate" class="text-sm font-medium text-gray-700">Date Début</label>
            <InputText
              type="date"
              v-model="formData.startDateDisplay"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="endDate" class="text-sm font-medium text-gray-700">Date Fin</label>
            <InputText
              type="date"
              v-model="formData.endDateDisplay"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <!-- File Picker -->
          <FilePicker
            v-model="formData.file"
            label="Sélectionner un fichier"
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
          <div class="flex flex-col gap-2">
            <label for="status" class="text-sm font-medium text-gray-700">Statut</label>
            <Dropdown
              v-model="formData.status"
              :options="employeeStatuses"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner un statut"
              required
              class="border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button label="Annuler" severity="secondary" text @click="closeAddModal" />
          <Button label="Ajouter" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>

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
            <span class="font-medium text-gray-700">ID:</span>
            <span>{{ selectedContract?.id || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Utilisateur:</span>
            <span>{{ selectedContract?.userId || 'N/A' }}</span>
          </div>
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
import { ref, onMounted, watch, reactive } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { useContractEnums } from '@/composables/useContractEnums'
import UserSelectDropdown from '@/components/common/UserSelectDropdown.vue'
import FilePicker from '@/components/common/FilePicker.vue'
import DashboardWrapper from '../admin/components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from '../admin/components/AdminDashboardOrders/SectionHeader.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import ContractsIcon from '@/components/icons/ContractsIcon.vue'
import { useContractsStore } from '@/stores/contract.store'

const appStore = useAppStore()
const contractsStore = useContractsStore()
const { contractTypes, employeeStatuses, getContractTypeName, getEmployeeStatusName } =
  useContractEnums()
const toast = useToast()

// Modal state
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const selectedContract = ref<any>(null)

const formData = reactive({
  userId: '',
  contractType: 0,
  startDate: '', // ISO string (e.g., 2025-07-04T00:00:00Z)
  startDateDisplay: '', // YYYY-MM-DD for input
  endDate: '', // ISO string
  endDateDisplay: '', // YYYY-MM-DD for input
  file: null,
  status: 0
})

// Fetch contracts when component is mounted
onMounted(async () => {
  await contractsStore.fetchContracts()
  appStore.setLoading(false)
})

// Handle pagination
const onPage = async (event: any) => {
  const { page, rows } = event // page is 0-based in PrimeVue
  await contractsStore.setPageAndSize(page + 1, rows, contractsStore.searchQuery)
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  return dateString
    ? new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'N/A'
}

// Modal functions
const openAddModal = () => {
  const now = new Date()
  const todayISO = now.toISOString()
  const todayDate = todayISO.split('T')[0]
  Object.assign(formData, {
    userId: '',
    contractType: 0,
    startDate: todayISO,
    startDateDisplay: todayDate,
    endDate: '',
    endDateDisplay: '',
    fileUrl: '',
    status: 0
  })
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const openDetailsModal = (contract: any) => {
  selectedContract.value = contract
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedContract.value = null
}
const submitForm = async () => {
  try {
    const formPayload = new FormData()

    // Prefix fields with 'Contract.' to match the record
    formPayload.append('Contract.UserId', formData.userId)
    formPayload.append('Contract.ContractType', String(formData.contractType)) // 0,1,2
    formPayload.append('Contract.StartDate', formData.startDate) // ISO string
    if (formData.endDate) formPayload.append('Contract.EndDate', formData.endDate)
    formPayload.append('Contract.Status', String(formData.status)) // 0,1,2

    // File
    if (formData.file) formPayload.append('File', formData.file) // match command property name

    // Debug: log FormData contents
    console.log('FormData contents:')
    for (const [key, value] of formPayload.entries()) {
      console.log(key, value)
    }

    // Call store action
    await contractsStore.addContract(formPayload)

    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Contrat créé avec succès',
      life: 3000
    })

    await contractsStore.fetchContracts().finally(() => {
      showAddModal.value = false
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Échec de l'enregistrement du contrat",
      life: 3000
    })
  }
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
```
