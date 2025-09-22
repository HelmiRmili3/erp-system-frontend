<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Employee Payroll Management">
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
        <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" />
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Payrolls DataTable -->
    <DataTable
      :value="payrollsStore.payrolls"
      class="p-datatable-sm"
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
          <p class="mt-2 text-gray-500">Aucune paie trouvée</p>
        </div>
      </template>
    </DataTable>

    <!-- Add Modal -->
    <Dialog
      v-model:visible="showAddModal"
      header="Ajouter Paie"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="userId" class="text-sm font-medium text-gray-700">Employees</label>
            <UserSelectDropdown
              v-model="formData.userId"
              placeholder="Sélectionner un utilisateur"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="period" class="text-sm font-medium text-gray-700">Month</label>
            <Calendar
              id="period"
              :v-model="formData.period"
              view="month"
              dateFormat="yy-mm"
              placeholder="YYYY-MM"
              showIcon
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="baseSalary" class="text-sm font-medium text-gray-700"
              >Salaire de Base</label
            >
            <InputNumber
              v-model="formData.baseSalary"
              :min="0"
              mode="decimal"
              placeholder="Salaire de base"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="bonuses" class="text-sm font-medium text-gray-700">Bonus</label>
            <InputNumber
              v-model="formData.bonuses"
              :min="0"
              mode="decimal"
              placeholder="Bonus"
              required
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="deductions" class="text-sm font-medium text-gray-700">Déductions</label>
            <InputNumber
              v-model="formData.deductions"
              :min="0"
              mode="decimal"
              placeholder="Déductions"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="netSalary" class="text-sm font-medium text-gray-700">Salaire Net</label>
            <InputNumber
              v-model="formData.netSalary"
              :min="0"
              mode="decimal"
              placeholder="Salaire net"
              required
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <FilePicker
            v-model="formData.file"
            label="Sélectionner un fichier"
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
          <div class="flex flex-col gap-2">
            <label for="isViewedByEmployee" class="text-sm font-medium text-gray-700"
              >Vu par l'employé</label
            >
            <Dropdown
              v-model="formData.isViewedByEmployee"
              :options="viewStatuses"
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
      header="Détails de la Paie"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">ID:</span>
            <span>{{ selectedPayroll?.id || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Utilisateur:</span>
            <span>{{ selectedPayroll?.userId || 'N/A' }}</span>
          </div>
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
import { ref, onMounted, reactive } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { usePayrollEnums } from '@/composables/usePayrollEnums'
import DashboardWrapper from '../admin/components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from '../admin/components/AdminDashboardOrders/SectionHeader.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import PayrollsIcon from '@/components/icons/PayrollsIcon.vue'
import { usePayrollsStore } from '@/stores/payroll.store'

const appStore = useAppStore()
const payrollsStore = usePayrollsStore()
const { viewStatuses, getViewStatusName } = usePayrollEnums()
const toast = useToast()

// Modal state
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const selectedPayroll = ref<any>(null)

const formData = reactive({
  userId: '',
  period: '',
  baseSalary: 0,
  bonuses: 0,
  deductions: 0,
  netSalary: 0,
  file: null,
  isViewedByEmployee: false
})

// Fetch payrolls when component is mounted
onMounted(async () => {
  await payrollsStore.fetchPayrolls()
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

// Modal functions
const openAddModal = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  Object.assign(formData, {
    userId: '',
    period: `${year}-${month}`,
    baseSalary: 0,
    bonuses: 0,
    deductions: 0,
    netSalary: 0,
    file: null,
    isViewedByEmployee: false
  })
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const openDetailsModal = (payroll: any) => {
  selectedPayroll.value = payroll
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedPayroll.value = null
}

const submitForm = async () => {
  try {
    const formPayload = new FormData()

    formPayload.append('Payroll.UserId', formData.userId)
    formPayload.append('Payroll.Period', formData.period)
    formPayload.append('Payroll.BaseSalary', String(formData.baseSalary))
    formPayload.append('Payroll.Bonuses', String(formData.bonuses))
    formPayload.append('Payroll.Deductions', String(formData.deductions))
    formPayload.append('Payroll.NetSalary', String(formData.netSalary))
    if (formData.file) {
      formPayload.append('File', formData.file)
    }
    formPayload.append('Payroll.IsViewedByEmployee', String(formData.isViewedByEmployee))

    console.log('FormData contents:')
    for (const [key, value] of formPayload.entries()) {
      console.log(key, value)
    }

    // Call store action
    await payrollsStore.addPayroll(formPayload)

    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Paie créée avec succès',
      life: 3000
    })

    await payrollsStore.fetchPayrolls()
    closeAddModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Échec de l'enregistrement de la paie",
      life: 3000
    })
  }
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
