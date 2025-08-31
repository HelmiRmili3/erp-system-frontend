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
            :href="`${appStore.baseURL + data.receiptPath}`"
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
              :href="`${appStore.baseURL + selectedExpense.receiptPath}`"
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
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app.store'
import DashboardWrapper from '../admin/components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from '../admin/components/AdminDashboardOrders/SectionHeader.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import ExpensesIcon from '@/components/icons/ExpensesIcon.vue'
import { useExpenseEnums } from '../../composables/useExpenseEnums'
import { useExpensesStore } from '@/stores/expense.store'
const { getExpenseStatusName } = useExpenseEnums()

const appStore = useAppStore()
const expensesStore = useExpensesStore()

// Modal state
const showDetailsModal = ref(false)
const selectedExpense = ref<any>(null)

onMounted(async () => {
  await expensesStore.fetchAllExpenses(expensesStore.currentPage, expensesStore.pageSize)
  appStore.setLoading(false)
})

// Handle pagination
const onPage = async (event: any) => {
  const { page, rows } = event
  console.log('pageination trigerd ', event)
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
  return amount ? `DT ${amount.toFixed(2)}` : 'N/A'
}

const openDetailsModal = (expense: any) => {
  selectedExpense.value = expense
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedExpense.value = null
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
