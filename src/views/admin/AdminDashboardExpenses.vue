<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Employee Expenses Management">
        <template>
          <ExpensesIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5">
          {{ expensesStore.totalRecords }} records
        </span>
      </div>
      <div class="flex justify-start items-center gap-4">
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
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Expenses DataTable -->
    <DataTable
      :value="expensesStore.expenses"
      class="p-datatable-sm"
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
          >
            Open
          </a>
          <span v-else>N/A</span>
        </template>
      </Column>

      <Column header="Details" style="min-width: 120px">
        <template #body="{ data }">
          <Button
            label="See more"
            text
            severity="info"
            @click="openDetailsModal(data)"
            v-tooltip="'View Details'"
          />
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
              @click="accept(data)"
              v-tooltip="'Accept'"
            />
            <Button
              icon="pi pi-times"
              rounded
              text
              severity="danger"
              @click="reject(data)"
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
          <p class="mt-2 text-gray-500">No expenses found</p>
        </div>
      </template>
    </DataTable>

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
            <span class="font-medium text-gray-700">ID:</span>
            <span>{{ selectedExpense?.id || 'N/A' }}</span>
          </div>
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
            >
              View Receipt
            </a>
            <span v-else>N/A</span>
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
import { useExpensesStore } from '@/stores/expense.store'
import { ExpenseStatus } from '@/enums/expenseStatus'
import type { UpdateExpense } from '@/models/expense.model'
import { useExpenseEnums } from '@/composables/useExpenseEnums'

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

// Pagination
const onPage = async (event: any) => {
  const { page, rows } = event
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

const accept = async (expense: UpdateExpense) => {
  expense.status = ExpenseStatus.Approved
  console.log('expense data :', expense)
  await expensesStore.editExpense(expense)
}

const reject = async (expense: UpdateExpense) => {
  expense.status = ExpenseStatus.Rejected
  await expensesStore.editExpense(expense)
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
