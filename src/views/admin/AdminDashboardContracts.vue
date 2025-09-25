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
          >{{ filteredContracts.length }} records</span
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
        <Button icon="pi pi-plus" label="" severity="success" @click="openAddModal" />
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Contracts DataTable -->
    <DataTable
      :value="filteredContracts"
      class="p-datatable-sm"
      :rows="contractsStore.pageSize"
      :totalRecords="filteredContracts.length"
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
      <Column field="startDate" header="Start Date" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.startDate) }}</div>
        </template>
      </Column>

      <Column field="endDate" header="End Date" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.endDate) }}</div>
        </template>
      </Column>

      <Column field="fileUrl" header="File" style="min-width: 150px">
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
            v-tooltip="'See More'"
          />
        </template>
      </Column>
      <Column header="Actions" style="width: 150px">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              rounded
              text
              severity="success"
              @click="openUpdateModal(data)"
              v-tooltip="'Modifier'"
            />
            <Button
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              @click="confirmDelete(data)"
              v-tooltip="'Supprimer'"
            />
          </div>
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
      header="Add Contract"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="userId" class="text-sm font-medium text-gray-700">User</label>
            <UserSelectDropdown v-model="formData.userId" placeholder="Select a user" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="contractType" class="text-sm font-medium text-gray-700"
              >Contract Type</label
            >
            <Dropdown
              v-model="formData.contractType"
              :options="contractTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a type"
              required
              class="border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="startDate" class="text-sm font-medium text-gray-700">Start Date</label>
            <InputText
              type="date"
              v-model="formData.startDateDisplay"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="endDate" class="text-sm font-medium text-gray-700">End Date</label>
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
            label="Select a file"
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
          <div class="flex flex-col gap-2">
            <label for="status" class="text-sm font-medium text-gray-700">Status</label>
            <Dropdown
              v-model="formData.status"
              :options="employeeStatuses"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a status"
              required
              class="border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button label="Cancel" severity="secondary" text @click="closeAddModal" />
          <Button label="Add" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>

    <!-- Update Modal -->
    <Dialog
      v-model:visible="showUpdateModal"
      header="Update Contract"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <form @submit.prevent="submitUpdateForm" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="userId" class="text-sm font-medium text-gray-700">User</label>
            <div class="flex items-center gap-3 p-1 bg-gray-50 border border-gray-300 rounded-lg">
              <img
                :src="
                  updateFormData.file
                    ? appStore.baseURL + updateFormData.file
                    : 'https://avatar.iran.liara.run/public/17'
                "
                alt="Avatar"
                class="w-8 h-8 rounded-full object-cover border"
              />
              <!-- <span class="text-gray-700">{{
                // updateFormData. || 'Unknown User'
              }}</span> -->
              <span class="text-xs text-gray-500 ml-auto">(Cannot be changed)</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="contractType" class="text-sm font-medium text-gray-700"
              >Contract Type</label
            >
            <Dropdown
              v-model="updateFormData.contractType"
              :options="contractTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a type"
              required
              class="border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="startDate" class="text-sm font-medium text-gray-700">Start Date</label>
            <InputText
              type="date"
              v-model="updateFormData.startDateDisplay"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="endDate" class="text-sm font-medium text-gray-700">End Date</label>
            <InputText
              type="date"
              v-model="updateFormData.endDateDisplay"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- File Picker -->
          <div class="flex flex-col gap-2">
            <FilePicker
              v-model="updateFormData.file"
              label="Update file (optional)"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <div v-if="updateFormData.currentFileUrl" class="text-sm text-gray-600">
              Current file:
              <a
                :href="`${appStore.baseURL + updateFormData.currentFileUrl}`"
                target="_blank"
                class="text-blue-600 hover:underline"
              >
                View current file
              </a>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="status" class="text-sm font-medium text-gray-700">Status</label>
            <Dropdown
              v-model="updateFormData.status"
              :options="employeeStatuses"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a status"
              required
              class="border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button label="Cancel" severity="secondary" text @click="closeUpdateModal" />
          <Button label="Update" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="showDeleteModal"
      header="Confirm Delete"
      modal
      :style="{ width: '400px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <i class="pi pi-exclamation-triangle text-3xl text-red-500"></i>
          <div>
            <p class="text-lg font-medium">Are you sure?</p>
            <p class="text-sm text-gray-600">
              This action will permanently delete the contract for
              <strong>{{ contractToDelete?.user?.userName || 'this employee' }}</strong
              >. This action cannot be undone.
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancel" severity="secondary" text @click="closeDeleteModal" />
          <Button
            label="Delete"
            severity="danger"
            :loading="deleteLoading"
            @click="executeDelete"
          />
        </div>
      </div>
    </Dialog>

    <!-- Details Popup -->
    <Dialog
      v-model:visible="showDetailsModal"
      header="Contract Details"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-700">Employee:</span>
            <div class="flex items-center gap-3">
              <img
                :src="
                  selectedContract?.user?.fileUrl
                    ? appStore.baseURL + selectedContract.user.fileUrl
                    : 'https://avatar.iran.liara.run/public/17'
                "
                alt="Avatar"
                class="w-8 h-8 rounded-full object-cover border"
              />
              <span>{{ selectedContract?.user?.userName || 'Unknown' }}</span>
            </div>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Type:</span>
            <span>{{ getContractTypeName(selectedContract?.contractType) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Start Date:</span>
            <span>{{ formatDate(selectedContract?.startDate) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">End Date:</span>
            <span>{{ formatDate(selectedContract?.endDate) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">File:</span>
            <a
              v-if="selectedContract?.fileUrl && selectedContract.fileUrl !== 'string'"
              :href="`${appStore.baseURL + selectedContract.fileUrl}`"
              target="_blank"
              class="text-blue-600 hover:underline"
              >View PDF</a
            >
            <span v-else>N/A</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Status:</span>
            <span>{{ getEmployeeStatusName(selectedContract?.status) }}</span>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <Button label="Close" severity="secondary" text @click="closeDetailsModal" />
        </div>
      </div>
    </Dialog>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from 'vue'
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
const showUpdateModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const selectedContract = ref<any>(null)
const contractToDelete = ref<any>(null)
const deleteLoading = ref(false)

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

const updateFormData = reactive({
  id: '',
  userId: '',
  contractType: 0,
  startDate: '', // ISO string
  startDateDisplay: '', // YYYY-MM-DD for input
  endDate: '', // ISO string
  endDateDisplay: '', // YYYY-MM-DD for input
  file: null,
  currentFileUrl: '',
  status: 0
})

// Safe filtered contracts to prevent errors
const filteredContracts = computed(() => {
  // Check if contracts exists and is an array
  if (!contractsStore.contracts || !Array.isArray(contractsStore.contracts)) {
    console.warn('Contracts data is not available or not an array:', contractsStore.contracts)
    return []
  }

  // Filter out any non-object items (like numbers, strings, etc.)
  const validContracts = contractsStore.contracts.filter(
    (contract) => contract && typeof contract === 'object' && !Array.isArray(contract)
  )

  // Log any invalid items for debugging
  if (validContracts.length !== contractsStore.contracts.length) {
    const invalidItems = contractsStore.contracts.filter(
      (item) => !item || typeof item !== 'object' || Array.isArray(item)
    )
    console.warn('Filtered out invalid contract items:', invalidItems)
  }

  return validContracts
})

// Fetch contracts when component is mounted with error handling
onMounted(async () => {
  // Check if fetchContracts function exists in the store
  await contractsStore.fetchContracts()
  appStore.setLoading(false)
})

// Handle pagination with error handling
const onPage = async (event: any) => {
  try {
    const { page, rows } = event
    if (contractsStore && typeof contractsStore.setPageAndSize === 'function') {
      await contractsStore.setPageAndSize(page + 1, rows, contractsStore.searchQuery)
    }
  } catch (error) {
    console.error('Error handling pagination:', error)
  }
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

// Helper function to convert date string to display format
const dateToDisplay = (dateString: string) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toISOString().split('T')[0]
  } catch (error) {
    console.error('Error converting date to display:', error)
    return ''
  }
}

// Add Modal functions
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
    file: null,
    status: 0
  })
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const submitForm = async () => {
  try {
    const formPayload = new FormData()

    // Prefix fields with 'Contract.' to match the record
    formPayload.append('Contract.UserId', formData.userId)
    formPayload.append('Contract.ContractType', String(formData.contractType))
    formPayload.append('Contract.StartDate', formData.startDate)
    if (formData.endDate) formPayload.append('Contract.EndDate', formData.endDate)
    formPayload.append('Contract.Status', String(formData.status))

    // File
    if (formData.file) formPayload.append('File', formData.file)

    // Debug: log FormData contents
    console.log('FormData contents:')
    for (const [key, value] of formPayload.entries()) {
      console.log(key, value)
    }

    // Call store action with error handling
    if (contractsStore && typeof contractsStore.addContract === 'function') {
      await contractsStore.addContract(formPayload)

      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Contrat créé avec succès',
        life: 3000
      })

      // Refresh the list if fetchContracts exists
      if (typeof contractsStore.fetchContracts === 'function') {
        await contractsStore.fetchContracts()
      }
    } else {
      throw new Error('addContract function not available')
    }

    showAddModal.value = false
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

// Update Modal functions
const openUpdateModal = (contract: any) => {
  Object.assign(updateFormData, {
    id: contract.id,
    userId: contract.userId || contract.user?.id || '',
    contractType: contract.contractType || 0,
    startDate: contract.startDate || '',
    startDateDisplay: dateToDisplay(contract.startDate),
    endDate: contract.endDate || '',
    endDateDisplay: dateToDisplay(contract.endDate),
    file: null,
    currentFileUrl: contract.fileUrl || '',
    status: contract.status || 0
  })
  showUpdateModal.value = true
}

const closeUpdateModal = () => {
  showUpdateModal.value = false
  // Reset form
  Object.assign(updateFormData, {
    id: '',
    userId: '',
    contractType: 0,
    startDate: '',
    startDateDisplay: '',
    endDate: '',
    endDateDisplay: '',
    file: null,
    currentFileUrl: '',
    status: 0
  })
}

const submitUpdateForm = async () => {
  try {
    const formPayload = new FormData()

    // Prefix fields with 'Contract.' to match the record
    formPayload.append('Contract.Id', updateFormData.id)
    formPayload.append('Contract.UserId', updateFormData.userId)
    formPayload.append('Contract.ContractType', String(updateFormData.contractType))
    formPayload.append('Contract.StartDate', updateFormData.startDate)
    if (updateFormData.endDate) formPayload.append('Contract.EndDate', updateFormData.endDate)
    formPayload.append('Contract.Status', String(updateFormData.status))

    // File (only if a new file is selected)
    if (updateFormData.file) formPayload.append('File', updateFormData.file)

    // Debug: log FormData contents
    console.log('Update FormData contents:')
    for (const [key, value] of formPayload.entries()) {
      console.log(key, value)
    }

    // Call store action with error handling
    if (contractsStore && typeof contractsStore.editContract === 'function') {
      await contractsStore.editContract(formPayload)

      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Contrat mis à jour avec succès',
        life: 3000
      })

      // Refresh the list if fetchContracts exists
      if (typeof contractsStore.fetchContracts === 'function') {
        await contractsStore.fetchContracts()
      }
    } else {
      throw new Error('editContract function not available')
    }

    showUpdateModal.value = false
  } catch (error) {
    console.error('Error updating contract:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Échec de la mise à jour du contrat',
      life: 3000
    })
  }
}

// Delete Modal functions
const confirmDelete = (contract: any) => {
  contractToDelete.value = contract
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  contractToDelete.value = null
  deleteLoading.value = false
}

const executeDelete = async () => {
  if (!contractToDelete.value) return

  try {
    deleteLoading.value = true

    if (contractsStore && typeof contractsStore.removeContract === 'function') {
      await contractsStore.removeContract(contractToDelete.value.id)

      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Contrat supprimé avec succès',
        life: 3000
      })

      // Refresh the list if fetchContracts exists
      if (typeof contractsStore.fetchContracts === 'function') {
        await contractsStore.fetchContracts()
      }
    } else {
      throw new Error('removeContract function not available')
    }

    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting contract:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Échec de la suppression du contrat',
      life: 3000
    })
    deleteLoading.value = false
  }
}

// Details Modal functions
const openDetailsModal = (contract: any) => {
  selectedContract.value = contract
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedContract.value = null
}

// Watchers to sync date inputs with ISO strings for Add form
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

// Watchers to sync date inputs with ISO strings for Update form
watch(
  () => updateFormData.startDateDisplay,
  (newDate) => {
    if (newDate) {
      const [year, month, day] = newDate.split('-')
      const date = new Date(updateFormData.startDate || new Date())
      date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
      updateFormData.startDate = date.toISOString()
    }
  }
)

watch(
  () => updateFormData.endDateDisplay,
  (newDate) => {
    if (newDate) {
      const [year, month, day] = newDate.split('-')
      const date = new Date(updateFormData.endDate || new Date())
      date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
      updateFormData.endDate = date.toISOString()
    } else {
      updateFormData.endDate = ''
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
