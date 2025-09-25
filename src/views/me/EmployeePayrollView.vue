<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Payroll Management">
        <template>
          <PayrollsIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
          >{{ payrollsStore.totalRecords }} records</span
        >
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
          <InputText
            v-model="payrollsStore.searchQuery"
            placeholder="Rechercher..."
            class="pl-10 py-2 border border-gray-300 rounded-lg"
            @input="
              payrollsStore.setPageAndSize(1, payrollsStore.pageSize, payrollsStore.searchQuery)
            "
          />
        </div>
        <!-- Add Payroll Button -->
        <!-- <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" /> -->
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Payrolls DataTable -->
    <DataTable
      :value="payrollsStore.payrolls"
      class="p-datatable-sm"
      :loading="payrollsStore.loading"
      :rows="payrollsStore.pageSize"
      :totalRecords="payrollsStore.totalRecords"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <!-- Columns -->
      <!-- <Column field="id" header="ID" sortable style="min-width: 100px" />
      <Column field="userId" header="Utilisateur" sortable style="min-width: 160px" /> -->
      <Column field="period" header="Période" sortable style="min-width: 120px">
        <template #body="{ data }">
          <div>{{ formatPeriod(data.period) }}</div>
        </template>
      </Column>
      <Column field="baseSalary" header="Salaire de Base" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatAmount(data.baseSalary) }}</div>
        </template>
      </Column>
      <Column field="bonuses" header="Bonus" sortable style="min-width: 120px">
        <template #body="{ data }">
          <div>{{ formatAmount(data.bonuses) }}</div>
        </template>
      </Column>
      <Column field="deductions" header="Déductions" sortable style="min-width: 120px">
        <template #body="{ data }">
          <div>{{ formatAmount(data.deductions) }}</div>
        </template>
      </Column>
      <Column field="netSalary" header="Salaire Net" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatAmount(data.netSalary) }}</div>
        </template>
      </Column>
      <Column field="fileUrl" header="Invoice" style="min-width: 150px">
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
      <Column field="isViewedByEmployee" header="Statut" sortable style="min-width: 120px">
        <template #body="{ data }">
          <div>{{ getViewStatusName(data.isViewedByEmployee) }}</div>
        </template>
      </Column>
      <Column header="Details" style="min-width: 120px">
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
          <p class="mt-2 text-gray-500">Aucune paie trouvée</p>
        </div>
      </template>
    </DataTable>

    <!-- Details Popup -->
    <Dialog
      v-model:visible="showDetailsModal"
      header="Détails de la Paie"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Période:</span>
            <span>{{ formatPeriod(selectedPayroll?.period) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Salaire de Base:</span>
            <span>{{ formatAmount(selectedPayroll?.baseSalary) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Bonus:</span>
            <span>{{ formatAmount(selectedPayroll?.bonuses) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Déductions:</span>
            <span>{{ formatAmount(selectedPayroll?.deductions) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Salaire Net:</span>
            <span>{{ formatAmount(selectedPayroll?.netSalary) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Fichier:</span>
            <a
              v-if="selectedPayroll?.fileUrl && selectedPayroll.fileUrl !== 'string'"
              :href="`${appStore.baseURL + selectedPayroll.fileUrl}`"
              target="_blank"
              class="text-blue-600 hover:underline"
              >Voir PDF</a
            >
            <span v-else>N/A</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Statut:</span>
            <span>{{ getViewStatusName(selectedPayroll?.isViewedByEmployee) }}</span>
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
import { usePayrollEnums } from '@/composables/usePayrollEnums'
import DashboardWrapper from '../admin/components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from '../admin/components/AdminDashboardOrders/SectionHeader.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import PayrollsIcon from '@/components/icons/PayrollsIcon.vue'
import { useMyPayrollsStore } from '@/stores/myPayroll.store'

const appStore = useAppStore()
const payrollsStore = useMyPayrollsStore()
const { getViewStatusName } = usePayrollEnums()

// Modal state
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const selectedPayroll = ref<any>(null)

// Fetch payrolls when component is mounted
onMounted(async () => {
  await payrollsStore.fetchCurrentUserPayrolls()
  appStore.setLoading(false)
})

// Handle pagination
const onPage = async (event: any) => {
  const { page, rows } = event // page is 0-based in PrimeVue
  await payrollsStore.setPageAndSize(page + 1, rows, payrollsStore.searchQuery)
}

// Helper functions
const formatPeriod = (period: string) => {
  if (!period) return 'N/A'
  const [year, month] = period.split('-')
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long'
  })
}

const formatAmount = (amount: number) => {
  return amount ? `DT ${amount.toFixed(2)}` : 'N/A'
}

const openDetailsModal = (payroll: any) => {
  selectedPayroll.value = payroll
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedPayroll.value = null
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
