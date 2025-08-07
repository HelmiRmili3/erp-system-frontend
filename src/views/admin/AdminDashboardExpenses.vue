<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Gestion des Dépenses">
        <template>
          <ExpensesIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
          >{{ expensesStore.totalRecords }} éléments</span
        >
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
          <InputText
            v-model="expensesStore.searchQuery"
            placeholder="Rechercher..."
            class="pl-10 py-2 border border-gray-300 rounded-lg"
            @input="
              expensesStore.setPageAndSize(1, expensesStore.pageSize, expensesStore.searchQuery)
            "
          />
        </div>
        <!-- Add Expense Button -->
        <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" />
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
      <!-- <Column field="id" header="ID" sortable style="min-width: 100px" /> -->
      <Column field="userId" header="Utilisateur" sortable style="min-width: 160px" />
      <Column field="description" header="Description" sortable style="min-width: 200px" />
      <Column field="amount" header="Montant" sortable style="min-width: 120px">
        <template #body="{ data }">
          <div>{{ formatAmount(data.amount) }}</div>
        </template>
      </Column>
      <Column field="expenseDate" header="Date de Dépense" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.expenseDate) }}</div>
        </template>
      </Column>
      <Column field="category" header="Catégorie" sortable style="min-width: 150px" />
      <Column field="status" header="Statut" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ getExpenseStatusName(data.status) }}</div>
        </template>
      </Column>
      <Column field="receiptPath" header="Reçu" style="min-width: 150px">
        <template #body="{ data }">
          <a
            v-if="data.receiptPath && data.receiptPath !== 'string'"
            :href="data.receiptPath"
            target="_blank"
            class="text-blue-600 hover:underline"
            >Voir Reçu</a
          >
          <span v-else>N/A</span>
        </template>
      </Column>
      <Column header="Détails" style="min-width: 120px">
        <template #body="{ data }">
          <Button
            label="Voir Détails"
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
          <p class="mt-2 text-gray-500">Aucune dépense trouvée</p>
        </div>
      </template>
    </DataTable>

    <!-- Add Modal -->
    <Dialog
      v-model:visible="showAddModal"
      header="Ajouter Dépense"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="userId" class="text-sm font-medium text-gray-700">Utilisateur</label>
            <InputText
              v-model="formData.userId"
              placeholder="ID de l'utilisateur"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="description" class="text-sm font-medium text-gray-700">Description</label>
            <InputText
              v-model="formData.description"
              placeholder="Description de la dépense"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="amount" class="text-sm font-medium text-gray-700">Montant</label>
            <InputText
              type="number"
              :v-model="formData.amount"
              placeholder="Montant"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="expenseDate" class="text-sm font-medium text-gray-700"
              >Date de Dépense</label
            >
            <InputText
              type="date"
              v-model="formData.expenseDateDisplay"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="category" class="text-sm font-medium text-gray-700">Catégorie</label>
            <Dropdown
              v-model="formData.category"
              :options="expenseCategories"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner une catégorie"
              required
              class="border border-gray-300 rounded-lg"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="status" class="text-sm font-medium text-gray-700">Statut</label>
            <Dropdown
              v-model="formData.status"
              :options="expenseStatuses"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner un statut"
              required
              class="border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label for="receiptPath" class="text-sm font-medium text-gray-700">Chemin du Reçu</label>
          <InputText
            v-model="formData.receiptPath"
            placeholder="URL du reçu (optionnel)"
            class="border border-gray-300 rounded-lg p-2"
          />
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
      header="Détails de la Dépense"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">ID:</span>
            <span>{{ selectedExpense?.id || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Utilisateur:</span>
            <span>{{ selectedExpense?.userId || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Description:</span>
            <span>{{ selectedExpense?.description || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Montant:</span>
            <span>{{ formatAmount(selectedExpense?.amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Date de Dépense:</span>
            <span>{{ formatDate(selectedExpense?.expenseDate) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Catégorie:</span>
            <span>{{ selectedExpense?.category || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Statut:</span>
            <span>{{ getExpenseStatusName(selectedExpense?.status) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Reçu:</span>
            <a
              v-if="selectedExpense?.receiptPath && selectedExpense.receiptPath !== 'string'"
              :href="selectedExpense.receiptPath"
              target="_blank"
              class="text-blue-600 hover:underline"
              >Voir Reçu</a
            >
            <span v-else>N/A</span>
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
import DashboardWrapper from '../admin/components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from '../admin/components/AdminDashboardOrders/SectionHeader.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import ExpensesIcon from '@/components/icons/ExpensesIcon.vue'
import { useExpensesStore } from '@/stores/expense.store'
import { useExpenseEnums } from '../../composables/useExpenseEnums'
const { expenseCategories, expenseStatuses, getExpenseStatusName } = useExpenseEnums()

const appStore = useAppStore()
const expensesStore = useExpensesStore()
const toast = useToast()

// Modal state
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const selectedExpense = ref<any>(null)

const formData = reactive({
  userId: '',
  description: '',
  amount: 0,
  expenseDate: '', // ISO string (e.g., 2025-07-05T11:57:31.325Z)
  expenseDateDisplay: '', // YYYY-MM-DD for input
  category: '',
  status: 0,
  receiptPath: ''
})

// Fetch expenses when component is mounted
onMounted(() => {
  expensesStore.fetchExpenses()
  appStore.setLoading(false)
})

// Handle pagination
const onPage = async (event: any) => {
  const { page, rows } = event // page is 0-based in PrimeVue
  await expensesStore.setPageAndSize(page + 1, rows, expensesStore.searchQuery)
}

// Helper functions
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
  return amount ? `$${amount.toFixed(2)}` : 'N/A'
}

// Modal functions
const openAddModal = () => {
  const now = new Date()
  const todayISO = now.toISOString()
  const todayDate = todayISO.split('T')[0]
  Object.assign(formData, {
    userId: '',
    description: '',
    amount: 0,
    expenseDate: todayISO,
    expenseDateDisplay: todayDate,
    category: '',
    status: 0,
    receiptPath: ''
  })
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const openDetailsModal = (expense: any) => {
  selectedExpense.value = expense
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedExpense.value = null
}

const submitForm = async () => {
  try {
    const data = {
      userId: formData.userId,
      description: formData.description,
      amount: parseFloat(formData.amount.toString()),
      expenseDate: formData.expenseDate,
      category: formData.category,
      status: formData.status,
      receiptPath: formData.receiptPath || null
    }
    // await expensesStore.addExpense(data)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Dépense créée avec succès',
      life: 3000
    })
    await expensesStore.fetchExpenses()
    closeAddModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Échec de l'enregistrement de la dépense",
      life: 3000
    })
  }
}

// Watchers to sync date inputs with ISO strings
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
</style>
