<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Expense Management">
        <template>
          <ExpensesIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
          >{{ expensesStore.totalRecords }} records</span
        >
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
          <InputText
            v-model="expensesStore.searchQuery"
            placeholder="Search..."
            class="pl-10 py-2 border border-gray-300 rounded-lg"
            @input="
              expensesStore.setPageAndSize(1, expensesStore.pageSize, expensesStore.searchQuery)
            "
          />
        </div>
        <!-- Add Expense Button -->
        <Button icon="pi pi-plus" label="" severity="success" @click="openAddModal" />
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Expenses DataTable -->
    <DataTable
      :value="expensesStore.expenses"
      class="p-datatable-sm"
      :loading="expensesStore.loading"
      :rows="expensesStore.pageSize"
      :totalRecords="expensesStore.totalRecords"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <!-- Columns -->
      <!-- <Column field="description" header="Description" sortable style="min-width: 200px" /> -->
      <Column field="amount" header="Amount" sortable style="min-width: 120px">
        <template #body="{ data }">
          <div>{{ formatAmount(data.amount) }}</div>
        </template>
      </Column>
      <Column field="expenseDate" header="Expense Date" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.expenseDate) }}</div>
        </template>
      </Column>
      <!-- <Column field="category" header="Category" sortable style="min-width: 150px" /> -->
      <Column field="status" header="Status" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ getExpenseStatusName(data.status) }}</div>
        </template>
      </Column>
      <Column field="receiptPath" header="Receipt" style="min-width: 150px">
        <template #body="{ data }">
          <a
            v-if="data.receiptPath && data.receiptPath !== 'string'"
            :href="`${appStore.baseURL + data.receiptPath}`"
            target="_blank"
            class="text-blue-600 hover:underline"
            >Open</a
          >
          <span v-else>N/A</span>
        </template>
      </Column>
      <Column header="Details" style="min-width: 120px">
        <template #body="{ data }">
          <Button
            label="View Details"
            text
            severity="info"
            @click="openDetailsModal(data)"
            v-tooltip="'View Details'"
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
              @click="openDeleteModal(data.id)"
              v-tooltip="'Supprimer'"
            />
          </div>
        </template>
      </Column>
      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">No expenses found</p>
        </div>
      </template>
    </DataTable>

    <!-- Add Modal -->
    <Dialog
      v-model:visible="showAddModal"
      :header="currentStep === 1 ? 'Step 1: Upload Receipt' : 'Step 2: Complete Expense Details'"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <!-- Step 1: File Upload and Processing -->
      <div v-if="currentStep === 1" class="flex flex-col gap-6">
        <div class="text-center">
          <i class="pi pi-cloud-upload text-4xl text-blue-500 mb-2"></i>
          <h3 class="text-lg font-semibold text-gray-700">Upload Receipt</h3>
          <p class="text-gray-500">Upload your receipt to automatically extract the amount</p>
        </div>

        <div class="flex flex-col gap-4">
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
          >
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept="image/*,.pdf"
              class="hidden"
              id="file-upload"
            />
            <label for="file-upload" class="cursor-pointer">
              <i class="pi pi-file text-3xl text-gray-400 mb-2"></i>
              <p class="text-gray-600">Click to upload or drag and drop</p>
              <p class="text-sm text-gray-400">Supports JPG, PNG, PDF (Max 10MB)</p>
            </label>
          </div>

          <div v-if="selectedFileName" class="bg-green-50 p-3 rounded-lg">
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-green-500"></i>
              <span class="font-medium">File selected:</span>
              <span>{{ selectedFileName }}</span>
            </div>
          </div>

          <!-- Processing State -->
          <div v-if="extracting" class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <ProgressSpinner style="width: 20px; height: 20px" />
              <div>
                <p class="font-medium text-blue-800">Processing receipt...</p>
                <p class="text-sm text-blue-600">Extracting amount and details</p>
              </div>
            </div>
          </div>

          <!-- Extraction Results -->
          <div v-if="extractionResult && !extracting" class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">Extracted Information:</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <span class="text-gray-600">Amount:</span>
              <span class="font-bold text-green-600">{{
                formatAmount(extractionResult.amount)
              }}</span>
              <span class="text-gray-600">Date:</span>
              <span>{{ extractionResult.date || 'Not detected' }}</span>
              <span class="text-gray-600">Confidence:</span>
              <span>{{ extractionResult.confidence }}%</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button label="Cancel" severity="secondary" text @click="closeAddModal" />
          <Button
            label="Next"
            severity="success"
            @click="goToStep2"
            :disabled="!extractionResult || extracting"
            :loading="extracting"
          />
        </div>
      </div>

      <!-- Step 2: Form Completion -->
      <div v-if="currentStep === 2" class="flex flex-col gap-4">
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <i class="pi pi-check-circle text-green-500"></i>
          <span>Step 1 completed - Amount extracted: {{ formatAmount(formData.amount!) }}</span>
        </div>

        <div class="flex flex-col gap-2">
          <label for="description" class="text-sm font-medium text-gray-700">Description *</label>
          <InputText
            v-model="formData.description"
            placeholder="Expense description"
            required
            class="border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="amount" class="text-sm font-medium text-gray-700">Amount *</label>
            <InputNumber
              v-model="formData.amount"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              placeholder="0.00"
              :min="0.01"
              required
              class="w-full"
            />
            <small class="text-gray-500">Extracted amount - edit if needed</small>
          </div>
          <div class="flex flex-col gap-2">
            <label for="expenseDate" class="text-sm font-medium text-gray-700"
              >Expense Date *</label
            >
            <InputText
              type="date"
              v-model="formData.expenseDateDisplay"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="category" class="text-sm font-medium text-gray-700">Category *</label>
          <Dropdown
            v-model="formData.category"
            :options="expenseCategories"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a category"
            required
            class="border border-gray-300 rounded-lg"
          />
        </div>

        <div class="bg-blue-50 p-3 rounded-lg">
          <div class="flex items-center gap-2">
            <i class="pi pi-info-circle text-blue-500"></i>
            <span class="text-sm text-blue-700">Receipt: {{ selectedFileName }}</span>
          </div>
        </div>

        <div class="flex justify-between gap-2">
          <Button label="Back" severity="secondary" text @click="goToStep1" />
          <div class="flex gap-2">
            <Button label="Cancel" severity="secondary" text @click="closeAddModal" />
            <Button
              label="Submit Expense"
              severity="success"
              @click="submitForm"
              :loading="submitting"
              :disabled="!isFormValid"
            />
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Details Popup -->
    <Dialog
      v-model:visible="showDetailsModal"
      header="Expense Details"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Description:</span>
            <span>{{ selectedExpense?.description || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Amount:</span>
            <span>{{ formatAmount(selectedExpense?.amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Expense Date:</span>
            <span>{{ formatDate(selectedExpense?.expenseDate) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Category:</span>
            <span>{{ selectedExpense?.category || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Status:</span>
            <span>{{ getExpenseStatusName(selectedExpense?.status) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Receipt:</span>
            <a
              v-if="selectedExpense?.receiptPath && selectedExpense.receiptPath !== 'string'"
              :href="`${appStore.baseURL + selectedExpense.receiptPath}`"
              target="_blank"
              class="text-blue-600 hover:underline"
              >View Receipt</a
            >
            <span v-else>N/A</span>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <Button label="Close" severity="secondary" text @click="closeDetailsModal" />
        </div>
      </div>
    </Dialog>
    <Dialog
      v-model:visible="showDeleteModal"
      header="Confirmation de suppression"
      modal
      :style="{ width: '400px' }"
      class="p-4"
    >
      <div class="flex flex-col items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-red-500"></i>
        <p class="text-gray-700">Êtes-vous sûr de vouloir supprimer cette absence ?</p>
        <div class="flex justify-end gap-2">
          <Button label="Non" severity="secondary" text @click="closeDeleteModal" />
          <Button label="Oui" severity="danger" @click="confirmDelete" />
        </div>
      </div>
    </Dialog>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from 'vue'
import { useAppStore } from '@/stores/app.store'
import DashboardWrapper from '../admin/components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from '../admin/components/AdminDashboardOrders/SectionHeader.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import ExpensesIcon from '@/components/icons/ExpensesIcon.vue'
import { useExpenseEnums } from '../../composables/useExpenseEnums'
import { useMyExpensesStore } from '@/stores/myExpenses.store'
import { api } from '@/plugins/axios'

const { expenseCategories, getExpenseStatusName } = useExpenseEnums()
const appStore = useAppStore()
const expensesStore = useMyExpensesStore()
const toast = useToast()

// Modal & form state
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const selectedExpense = ref<any>(null)
const submitting = ref(false)
const extracting = ref(false)
const currentStep = ref(1) // 1: File upload, 2: Form completion
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFileName = ref('')
const showDeleteModal = ref(false)
const selectedExpenceId = ref<number | null>(null)

// Extraction results
const extractionResult = ref<{
  amount: number
  date?: string
  confidence: number
} | null>(null)

const formData = reactive({
  description: '',
  amount: null as number | null,
  expenseDate: '',
  expenseDateDisplay: '',
  category: '',
  image: null as File | null
})

// Form validation
const isFormValid = computed(() => {
  return (
    formData.description.trim() &&
    formData.amount &&
    formData.amount > 0 &&
    formData.expenseDateDisplay &&
    formData.category &&
    formData.image
  )
})

onMounted(async () => {
  await expensesStore.fetchCurrentUserExpenses(expensesStore.currentPage, expensesStore.pageSize)
  appStore.setLoading(false)
})

const onPage = async (event: any) => {
  const { page, rows } = event
  await expensesStore.setPageAndSize(page + 1, rows, expensesStore.searchQuery)
}

const openDeleteModal = (id: number) => {
  selectedExpenceId.value = id
  showDeleteModal.value = true
}
const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedExpenceId.value = null
}

const confirmDelete = async () => {
  if (selectedExpenceId.value) {
    try {
      await expensesStore.removeExpense(selectedExpenceId.value)
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Absence supprimée avec succès',
        life: 3000
      })
    } catch (error) {
      console.error('Error deleting absence:', error)
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: "Échec de la suppression de l'absence",
        life: 3000
      })
    }
  }
  closeDeleteModal()
}
const formatDate = (dateString: string) => {
  return dateString
    ? new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'N/A'
}

const formatAmount = (amount: number) => {
  return amount ? `DT ${amount.toFixed(2)}` : 'N/A'
}

// File handling and extraction
// File handling and extraction
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    formData.image = file // This is the reactive formData
    selectedFileName.value = file.name
    extractionResult.value = null

    // Auto-extract information from receipt
    await extractReceiptInfo(file)
  } else {
    formData.image = null
    selectedFileName.value = ''
    extractionResult.value = null
  }
}
const openUpdateModal = (data: any) => {}

// Rename the reactive formData to avoid confusion
const expenseFormData = reactive({
  description: '',
  amount: null as number | null,
  expenseDate: '',
  expenseDateDisplay: '',
  category: '',
  image: null as File | null
})

// Then update all references in the extractReceiptInfo function:
const extractReceiptInfo = async (file: File) => {
  extracting.value = true
  try {
    const requestFormData = new FormData() // Different name
    requestFormData.append('file', file)

    const response = await api.post('http://localhost:8000/extract-receipt', requestFormData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const totalString = response.data.total || '0'
    const amount = Number(totalString.replace(/,/g, '')) || 0

    extractionResult.value = {
      amount: amount,
      date: response.data.date,
      confidence: response.data.confidence || 85
    }

    // Now it's clear which formData we're using
    expenseFormData.amount = amount
    if (response.data.date) {
      expenseFormData.expenseDateDisplay = response.data.date
    }

    // ... rest of the function
  } catch (error) {
    // ... error handling
  } finally {
    extracting.value = false
  }
}

// Step navigation
const goToStep2 = () => {
  if (extractionResult.value) {
    formData.amount = extractionResult.value.amount
    currentStep.value = 2
  }
}

const goToStep1 = () => {
  currentStep.value = 1
}

// Modals
const openAddModal = () => {
  const now = new Date()
  const todayISO = now.toISOString()
  const todayDate = todayISO.split('T')[0]

  Object.assign(formData, {
    description: '',
    amount: null,
    expenseDate: todayISO,
    expenseDateDisplay: todayDate,
    category: '',
    image: null
  })

  selectedFileName.value = ''
  extractionResult.value = null
  currentStep.value = 1
  if (fileInput.value) fileInput.value.value = ''

  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  selectedFileName.value = ''
  extractionResult.value = null
  currentStep.value = 1
  if (fileInput.value) fileInput.value.value = ''
}

const openDetailsModal = (expense: any) => {
  selectedExpense.value = expense
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedExpense.value = null
}

// Submit form
const submitForm = async () => {
  if (!isFormValid.value) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill all required fields',
      life: 3000
    })
    return
  }

  submitting.value = true
  try {
    const data = {
      description: formData.description.trim(),
      amount: Number(formData.amount),
      expenseDate: formData.expenseDate,
      category: formData.category,
      image: formData.image!
    }

    await expensesStore.addExpense(data)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Expense created successfully',
      life: 3000
    })

    await expensesStore.fetchCurrentUserExpenses()
    closeAddModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create expense',
      life: 3000
    })
  } finally {
    submitting.value = false
  }
}

// Sync date display with ISO
watch(
  () => formData.expenseDateDisplay,
  (newDate) => {
    if (newDate) {
      const [year, month, day] = newDate.split('-')
      const date = new Date(formData.expenseDate || new Date())
      date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
      formData.expenseDate = date.toISOString()
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

/* Drag and drop area styles */
.border-dashed:hover {
  border-color: #3b82f6;
}
</style>
