<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Attendance Management">
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
            >{{ attendancesStore.totalRecords }} records</span
          >
        </div>
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
          <InputText
            v-model="attendancesStore.searchQuery"
            placeholder="Search..."
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

        <!-- Dynamic Check In/Out Button based on nextOp -->
        <Button
          v-if="nextOp === 'checkin'"
          icon="pi pi-sign-in"
          label="Check In"
          severity="success"
          @click="openCheckInConfirmation"
          v-tooltip="'Record your check-in'"
        />

        <Button
          v-if="nextOp === 'checkout'"
          icon="pi pi-sign-out"
          label="Check Out"
          severity="warning"
          @click="openCheckOutConfirmation"
          v-tooltip="'Record your check-out'"
        />
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
          <div>{{ formatTime(data.checkOut) || 'Not checked out' }}</div>
        </template>
      </Column>
      <Column header="Status" style="min-width: 120px">
        <template #body="{ data }">
          <Tag :value="nextOp" :severity="getAttendanceSeverity(data)" />
        </template>
      </Column>
      <Column header="Details" style="min-width: 120px">
        <template #body="{ data }">
          <Button
            label="See More"
            text
            severity="info"
            @click="openDetailsModal(data)"
            v-tooltip="'View Details'"
          />
        </template>
      </Column>
      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">No attendance found</p>
        </div>
      </template>
    </DataTable>

    <!-- Check-In Confirmation Modal -->
    <Dialog
      v-model:visible="showCheckInConfirmation"
      header="Confirm Check-In"
      modal
      :style="{ width: '500px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <i class="pi pi-info-circle text-2xl text-blue-500"></i>
          <span class="text-lg font-medium">Confirm your check-in for today?</span>
        </div>

        <div class="bg-blue-50 p-3 rounded-lg">
          <h4 class="font-semibold text-blue-800 mb-2">Check-In Details:</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <span class="text-gray-600">Date:</span>
            <span class="font-medium">{{ getCurrentDate() }}</span>

            <span class="text-gray-600">Time:</span>
            <span class="font-medium">{{ getCurrentTime() }}</span>

            <span class="text-gray-600">User:</span>
            <span class="font-medium">{{ authStore.user?.userName || 'Current User' }}</span>

            <span class="text-gray-600">Method:</span>
            <span class="font-medium">Web App</span>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            severity="secondary"
            text
            @click="closeCheckInConfirmation"
            :disabled="isSubmitting"
          />
          <Button
            label="Confirm Check-In"
            severity="success"
            @click="confirmCheckIn"
            :loading="isSubmitting"
          />
        </div>
      </div>
    </Dialog>

    <!-- Check-Out Confirmation Modal -->
    <Dialog
      v-model:visible="showCheckOutConfirmation"
      header="Confirm Check-Out"
      modal
      :style="{ width: '500px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <i class="pi pi-info-circle text-2xl text-orange-500"></i>
          <span class="text-lg font-medium">Confirm your check-out for today?</span>
        </div>

        <div class="bg-orange-50 p-3 rounded-lg">
          <h4 class="font-semibold text-orange-800 mb-2">Check-Out Details:</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <span class="text-gray-600">Date:</span>
            <span class="font-medium">{{ getCurrentDate() }}</span>

            <span class="text-gray-600">Time:</span>
            <span class="font-medium">{{ getCurrentTime() }}</span>

            <span class="text-gray-600">User:</span>
            <span class="font-medium">{{ authStore.user?.userName || 'Current User' }}</span>

            <span class="text-gray-600">Method:</span>
            <span class="font-medium">Web App</span>

            <!-- <span class="text-gray-600">Check-In Time:</span>
            <span class="font-medium">{{ getLastCheckInTime() }}</span> -->
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            severity="secondary"
            text
            @click="closeCheckOutConfirmation"
            :disabled="isSubmitting"
          />
          <Button
            label="Confirm Check-Out"
            severity="warning"
            @click="confirmCheckOut"
            :loading="isSubmitting"
          />
        </div>
      </div>
    </Dialog>

    <!-- Details Popup -->
    <Dialog
      v-model:visible="showDetailsModal"
      header="Attendance Details"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Date:</span>
            <span>{{ formatDate(selectedAttendance?.attendanceDay) }}</span>
          </div>
        </div>
        <hr class="border-gray-300" />
        <div class="grid grid-cols-2 gap-4 relative">
          <!-- Check-In Details -->
          <div class="flex flex-col gap-2 pr-4">
            <h3 class="font-semibold text-lg">Check-In</h3>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Time:</span>
              <span>{{ formatTime(selectedAttendance?.checkIn) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Method:</span>
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
              <span class="font-medium text-gray-700">IP Address:</span>
              <span>{{ selectedAttendance?.checkInIpAddress || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">By Admin:</span>
              <span>{{ selectedAttendance?.isCheckInByAdmin ? 'Yes' : 'No' }}</span>
            </div>
          </div>
          <!-- Check-Out Details -->
          <div class="flex flex-col gap-2 pl-4">
            <h3 class="font-semibold text-lg">Check-Out</h3>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Time:</span>
              <span>{{ formatTime(selectedAttendance?.checkOut) || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Method:</span>
              <span>{{ getCheckOutMethodName(selectedAttendance?.checkOutMethod) || 'N/A' }}</span>
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
              <span class="font-medium text-gray-700">IP Address:</span>
              <span>{{ selectedAttendance?.checkOutIpAddress || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">By Admin:</span>
              <span>{{ selectedAttendance?.isCheckOutByAdmin ? 'Yes' : 'No' }}</span>
            </div>
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
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/app.store'
import DashboardWrapper from '../admin/components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from '../admin/components/AdminDashboardOrders/SectionHeader.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useAttendanceEnums } from '@/composables/useAttendaceEnums'
import AttendancesIcon from '@/components/icons/AttendancesIcon.vue'
import { useMyAttendancesStore } from '@/stores/myAttendance.store'
import { useAuthStore } from '@/stores/auth.store'

const appStore = useAppStore()
const authStore = useAuthStore()
const attendancesStore = useMyAttendancesStore()
const { getCheckInMethodName, getCheckOutMethodName } = useAttendanceEnums()
const toast = useToast()

// Modal state
const showCheckInConfirmation = ref(false)
const showCheckOutConfirmation = ref(false)
const showDetailsModal = ref(false)
const selectedAttendance = ref<any>(null)
const isSubmitting = ref(false)

// Get next operation from store
const nextOp = computed(() => attendancesStore.getNextOperation())

// Get the last check-in time for checkout confirmation

const getAttendanceSeverity = (attendance: any) => {
  if (attendance.checkIn && attendance.checkOut) return 'success'
  if (attendance.checkIn && !attendance.checkOut) return 'warning'
  return 'danger'
}

// Helper functions
const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fetch attendances when component is mounted
onMounted(async () => {
  await attendancesStore.fetchCurrentUserAttendances()
  appStore.setLoading(false)
})

// Handle pagination
const onPage = async (event: any) => {
  const { page, rows } = event
  await attendancesStore.setPageAndSize(page + 1, rows, attendancesStore.searchQuery)
}

// Format functions
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
  if (!timeString) return ''
  // Handle both "HH:mm" and full ISO string formats
  const timePart = timeString.includes('T')
    ? timeString.split('T')[1].substring(0, 5)
    : timeString.substring(0, 5)

  return new Date(`1970-01-01T${timePart}Z`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Modal functions
const openCheckInConfirmation = () => {
  showCheckInConfirmation.value = true
}

const closeCheckInConfirmation = () => {
  showCheckInConfirmation.value = false
}

const openCheckOutConfirmation = () => {
  showCheckOutConfirmation.value = true
}

const closeCheckOutConfirmation = () => {
  showCheckOutConfirmation.value = false
}

const openDetailsModal = (attendance: any) => {
  selectedAttendance.value = attendance
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedAttendance.value = null
}

// Generate fake data for API
const generateCheckInData = () => {
  const now = new Date()
  const today = now.toISOString().split('T')[0] // YYYY-MM-DD
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5) // HH:mm

  return {
    userId: authStore.user?.id,
    attendanceDay: today,
    checkIn: currentTime,
    checkInMethod: 0, // Mobile App
    checkInLatitude: 36.8065 + (Math.random() - 0.5) * 0.01,
    checkInLongitude: 10.1815 + (Math.random() - 0.5) * 0.01,
    checkInDeviceId: `DEV-${Math.floor(100000 + Math.random() * 900000)}`,
    checkInIpAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    isCheckInByAdmin: false
  }
}

const generateCheckOutData = (existingCheckInData: any) => {
  const now = new Date()
  const currentTime = now.toTimeString().split(' ')[0] // HH:mm:ss

  return {
    ...existingCheckInData, // keep check-in intact
    checkOut: currentTime,
    checkOutMethod: 0, // Mobile App
    checkOutLatitude: 36.8065 + (Math.random() - 0.5) * 0.01,
    checkOutLongitude: 10.1815 + (Math.random() - 0.5) * 0.01,
    checkOutDeviceId: `DEV-${Math.floor(100000 + Math.random() * 900000)}`,
    checkOutIpAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    isCheckOutByAdmin: false
  }
}

const confirmCheckIn = async () => {
  isSubmitting.value = true

  try {
    const checkInData = generateCheckInData()
    await attendancesStore.addAttendance(checkInData)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Check-in recorded successfully',
      life: 3000
    })

    await attendancesStore.fetchCurrentUserAttendances()
    closeCheckInConfirmation()
  } catch (error) {
    console.error('Error recording check-in:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to record check-in',
      life: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

const confirmCheckOut = async () => {
  isSubmitting.value = true

  try {
    // Find last attendance with checkIn but no checkOut
    const lastCheckIn = attendancesStore.attendances
      .slice()
      .reverse()
      .find((a) => a.checkIn && !a.checkOut)

    if (!lastCheckIn) {
      throw new Error('No check-in found for checkout')
    }

    const checkOutData = generateCheckOutData(lastCheckIn) // ✅ pass it here
    await attendancesStore.addAttendance(checkOutData)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Check-out recorded successfully',
      life: 3000
    })

    await attendancesStore.fetchCurrentUserAttendances()
    closeCheckOutConfirmation()
  } catch (error) {
    console.error('Error recording check-out:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to record check-out',
      life: 3000
    })
  } finally {
    isSubmitting.value = false
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
