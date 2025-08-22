<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Gestion des Présences">
        <template>
          <AttendancesIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <div class="flex flex-row gap-2.5 align-center">
          <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
            >{{ attendancesStore.totalRecords }} éléments</span
          >
        </div>
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
          <InputText
            v-model="attendancesStore.searchQuery"
            placeholder="Rechercher..."
            class="pl-10 py-2 border border-gray-300 rounded-lg"
            @input="
              attendancesStore.setPageAndSize(
                1,
                attendancesStore.pageSize,
                attendancesStore.searchQuery
              )
            "
          />
        </div>
        <!-- Add Attendance Button -->
        <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" />
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Attendances DataTable -->
    <DataTable
      :value="attendancesStore.attendances"
      class="p-datatable-sm"
      :loading="attendancesStore.loading"
      :rows="attendancesStore.pageSize"
      :totalRecords="attendancesStore.totalRecords"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <!-- Columns -->
      <!-- <Column field="userId" header="Utilisateur" sortable style="min-width: 160px" /> -->
      <Column field="attendanceDay" header="Date" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.attendanceDay) }}</div>
        </template>
      </Column>
      <Column field="checkIn" header="Check-In" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatTime(data.checkIn) }}</div>
        </template>
      </Column>
      <Column field="checkOut" header="Check-Out" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatTime(data.checkOut) }}</div>
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
          <p class="mt-2 text-gray-500">Aucune présence trouvée</p>
        </div>
      </template>
    </DataTable>

    <!-- Add Modal -->
    <Dialog
      v-model:visible="showModal"
      header="Ajouter Présence"
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
            <label for="attendanceDay" class="text-sm font-medium text-gray-700">Date</label>
            <InputText
              type="date"
              v-model="formData.attendanceDayDisplay"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="checkIn" class="text-sm font-medium text-gray-700">Check-In</label>
            <InputText
              type="time"
              v-model="formData.checkIn"
              placeholder="Heure de check-in"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="checkInMethod" class="text-sm font-medium text-gray-700"
              >Méthode Check-In</label
            >
            <Dropdown
              v-model="formData.checkInMethod"
              :options="checkInMethods"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner une méthode"
              class="border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="checkInLatitude" class="text-sm font-medium text-gray-700"
              >Latitude Check-In</label
            >
            <InputNumber
              v-model="formData.checkInLatitude"
              placeholder="Latitude"
              :step="0.000001"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="checkInLongitude" class="text-sm font-medium text-gray-700"
              >Longitude Check-In</label
            >
            <InputNumber
              v-model="formData.checkInLongitude"
              placeholder="Longitude"
              :step="0.000001"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="checkInDeviceId" class="text-sm font-medium text-gray-700"
              >Device ID Check-In</label
            >
            <InputText
              v-model="formData.checkInDeviceId"
              placeholder="Device ID"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="checkInIpAddress" class="text-sm font-medium text-gray-700"
              >IP Check-In</label
            >
            <InputText
              v-model="formData.checkInIpAddress"
              placeholder="Adresse IP"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label for="isCheckInByAdmin" class="text-sm font-medium text-gray-700"
            >Check-In par Admin</label
          >
          <Checkbox v-model="formData.isCheckInByAdmin" :binary="true" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="checkOut" class="text-sm font-medium text-gray-700">Check-Out</label>
            <InputText
              type="time"
              v-model="formData.checkOut"
              placeholder="Heure de check-out"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="checkOutMethod" class="text-sm font-medium text-gray-700"
              >Méthode Check-Out</label
            >
            <Dropdown
              v-model="formData.checkOutMethod"
              :options="checkOutMethods"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionner une méthode"
              class="border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="checkOutLatitude" class="text-sm font-medium text-gray-700"
              >Latitude Check-Out</label
            >
            <InputNumber
              v-model="formData.checkOutLatitude"
              placeholder="Latitude"
              :step="0.000001"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="checkOutLongitude" class="text-sm font-medium text-gray-700"
              >Longitude Check-Out</label
            >
            <InputNumber
              v-model="formData.checkOutLongitude"
              placeholder="Longitude"
              :step="0.000001"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="checkOutDeviceId" class="text-sm font-medium text-gray-700"
              >Device ID Check-Out</label
            >
            <InputText
              v-model="formData.checkOutDeviceId"
              placeholder="Device ID"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="checkOutIpAddress" class="text-sm font-medium text-gray-700"
              >IP Check-Out</label
            >
            <InputText
              v-model="formData.checkOutIpAddress"
              placeholder="Adresse IP"
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label for="isCheckOutByAdmin" class="text-sm font-medium text-gray-700"
            >Check-Out par Admin</label
          >
          <Checkbox v-model="formData.isCheckOutByAdmin" :binary="true" />
        </div>
        <div class="flex justify-end gap-2">
          <Button label="Annuler" severity="secondary" text @click="closeModal" />
          <Button label="Ajouter" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>

    <!-- Details Popup -->
    <Dialog
      v-model:visible="showDetailsModal"
      header="Détails de la Présence"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <!-- User and Date -->
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Utilisateur:</span>
            <span>{{ selectedAttendance?.userId || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Date:</span>
            <span>{{ formatDate(selectedAttendance?.attendanceDay) }}</span>
          </div>
        </div>
        <hr class="border-gray-300" />
        <!-- Check-In and Check-Out Split -->
        <div class="grid grid-cols-2 gap-4 relative">
          <!-- Check-In Details (Left) -->
          <div class="flex flex-col gap-2 pr-4">
            <h3 class="font-semibold text-lg">Check-In</h3>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Heure:</span>
              <span>{{ formatTime(selectedAttendance?.checkIn) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Méthode:</span>
              <span>{{ getCheckInMethodName(selectedAttendance?.checkInMethod) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Latitude:</span>
              <span>{{ selectedAttendance?.checkInLatitude || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Longitude:</span>
              <span>{{ selectedAttendance?.checkInLongitude || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Device ID:</span>
              <span>{{ selectedAttendance?.checkInDeviceId || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Adresse IP:</span>
              <span>{{ selectedAttendance?.checkInIpAddress || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Par Admin:</span>
              <span>{{ selectedAttendance?.isCheckInByAdmin ? 'Oui' : 'Non' }}</span>
            </div>
          </div>
          <!-- Vertical Divider -->
          <div class="absolute left-1/2 top-0 bottom-0 border-l border-gray-300"></div>
          <!-- Check-Out Details (Right) -->
          <div class="flex flex-col gap-2 pl-4">
            <h3 class="font-semibold text-lg">Check-Out</h3>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Heure:</span>
              <span>{{ formatTime(selectedAttendance?.checkOut) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Méthode:</span>
              <span>{{ getCheckOutMethodName(selectedAttendance?.checkOutMethod) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Latitude:</span>
              <span>{{ selectedAttendance?.checkOutLatitude || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Longitude:</span>
              <span>{{ selectedAttendance?.checkOutLongitude || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Device ID:</span>
              <span>{{ selectedAttendance?.checkOutDeviceId || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Adresse IP:</span>
              <span>{{ selectedAttendance?.checkOutIpAddress || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Par Admin:</span>
              <span>{{ selectedAttendance?.isCheckOutByAdmin ? 'Oui' : 'Non' }}</span>
            </div>
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
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useAttendanceEnums } from '@/composables/useAttendaceEnums'
import AttendancesIcon from '@/components/icons/AttendancesIcon.vue'
import { useMyAttendancesStore } from '@/stores/myAttendance.store'

const appStore = useAppStore()
const attendancesStore = useMyAttendancesStore()
const { getCheckInMethodName, getCheckOutMethodName, checkInMethods, checkOutMethods } =
  useAttendanceEnums()
const toast = useToast()

// Modal state
const showModal = ref(false)
const showDetailsModal = ref(false)
const selectedAttendance = ref<any>(null)

const formData = reactive({
  userId: '',
  attendanceDay: '', // ISO string (e.g., 2025-08-04T00:00:00.000Z)
  attendanceDayDisplay: '', // YYYY-MM-DD for input (e.g., 2025-08-04)
  checkIn: '', // HH:mm
  checkInMethod: 0,
  checkInLatitude: 0,
  checkInLongitude: 0,
  checkInDeviceId: '',
  checkInIpAddress: '',
  isCheckInByAdmin: false,
  checkOut: '', // HH:mm
  checkOutMethod: 0,
  checkOutLatitude: 0,
  checkOutLongitude: 0,
  checkOutDeviceId: '',
  checkOutIpAddress: '',
  isCheckOutByAdmin: false
})

// Fetch attendances when component is mounted
onMounted(async () => {
  await attendancesStore.fetchCurrentUserAttendances()
  appStore.setLoading(false)
})

// Handle pagination
const onPage = async (event: any) => {
  const { page, rows } = event // page is 0-based
  await attendancesStore.setPageAndSize(page + 1, rows, attendancesStore.searchQuery)
}

// Helper functions to format dates and times
const formatDate = (dateString: string) => {
  return dateString
    ? new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : ''
}

const formatTime = (timeString: string) => {
  return timeString
    ? new Date(`1970-01-01T${timeString}Z`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : ''
}

// Modal functions
const openAddModal = () => {
  const now = new Date()
  const todayISO = now.toISOString()
  const todayDate = todayISO.split('T')[0]
  Object.assign(formData, {
    userId: '',
    attendanceDay: todayISO,
    attendanceDayDisplay: todayDate,
    checkIn: '',
    checkInMethod: 0,
    checkInLatitude: 0,
    checkInLongitude: 0,
    checkInDeviceId: '',
    checkInIpAddress: '',
    isCheckInByAdmin: false,
    checkOut: '',
    checkOutMethod: 0,
    checkOutLatitude: 0,
    checkOutLongitude: 0,
    checkOutDeviceId: '',
    checkOutIpAddress: '',
    isCheckOutByAdmin: false
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const openDetailsModal = (attendance: any) => {
  selectedAttendance.value = attendance
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedAttendance.value = null
}

const submitForm = async () => {
  try {
    const data = {
      userId: formData.userId,
      attendanceDay: formData.attendanceDay,
      checkIn: formData.checkIn
        ? `${formData.attendanceDayDisplay}T${formData.checkIn}:00.000Z`
        : '',
      checkInMethod: formData.checkInMethod,
      checkInLatitude: formData.checkInLatitude,
      checkInLongitude: formData.checkInLongitude,
      checkInDeviceId: formData.checkInDeviceId,
      checkInIpAddress: formData.checkInIpAddress,
      isCheckInByAdmin: formData.isCheckInByAdmin,
      checkOut: formData.checkOut
        ? `${formData.attendanceDayDisplay}T${formData.checkOut}:00.000Z`
        : '',
      checkOutMethod: formData.checkOutMethod,
      checkOutLatitude: formData.checkOutLatitude,
      checkOutLongitude: formData.checkOutLongitude,
      checkOutDeviceId: formData.checkOutDeviceId,
      checkOutIpAddress: formData.checkOutIpAddress,
      isCheckOutByAdmin: formData.isCheckOutByAdmin
    }
    // await attendancesStore.addAttendance(data)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Présence créée avec succès',
      life: 3000
    })
    await attendancesStore.fetchCurrentUserAttendances()
    closeModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Échec de l'enregistrement de la présence",
      life: 3000
    })
  }
}

// Watcher to sync attendanceDayDisplay with attendanceDay
watch(
  () => formData.attendanceDayDisplay,
  (newDate) => {
    if (newDate) {
      const [year, month, day] = newDate.split('-')
      const date = new Date(formData.attendanceDay || new Date())
      date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
      formData.attendanceDay = date.toISOString()
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
