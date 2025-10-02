<template>
  <DashboardWrapper>
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Employees Certifications Management">
        <template>
          <CertificationsIcon />
        </template>
      </SectionHeader>
    </div>

    <!-- Controls -->
    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5">
          {{ certificationsStore.totalRecords }} records
        </span>
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- <div class="relative">
          <InputText
            v-model="certificationsStore.searchQuery"
            placeholder="Rechercher..."
            class="pl-10 py-2 border border-gray-300 rounded-lg"
            @input="
              certificationsStore.setPageAndSize(
                1,
                certificationsStore.pageSize,
                certificationsStore.searchQuery
              )
            "
          />
        </div> -->
        <Button icon="pi pi-plus" label="" severity="success" @click="openAddModal" />
      </div>
    </div>

    <div class="h-[20px]"></div>

    <!-- DataTable -->
    <DataTable
      :value="certificationsStore.certifications"
      class="p-datatable-sm"
      :rows="certificationsStore.pageSize"
      :totalRecords="certificationsStore.totalRecords"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
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

      <Column field="name" header="Nom" sortable style="min-width: 200px" />
      <Column field="authority" header="Autorité" sortable style="min-width: 150px" />
      <Column field="dateObtained" header="Date Obtenue" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.dateObtained) }}</div>
        </template>
      </Column>
      <Column field="fileUrl" header="File" style="min-width: 150px">
        <template #body="{ data }">
          <a
            v-if="data.fileUrl"
            :href="appStore.baseURL + data.fileUrl"
            target="_blank"
            rel="noopener"
            class="text-blue-600 hover:underline"
          >
            Open
          </a>
          <span v-else>N/A</span>
        </template>
      </Column>
      <Column header="Détails" style="min-width: 120px">
        <template #body="{ data }">
          <Button label="See More" text severity="info" @click="openDetailsModal(data)" />
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
            />
            <Button
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">Aucune certification trouvée</p>
        </div>
      </template>
    </DataTable>

    <!-- Add/Update Modal -->
    <Dialog
      v-model:visible="showAddModal"
      :header="editingCertificationId ? 'Update Certification' : 'Add Certification'"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <form
        @submit.prevent="editingCertificationId ? submitUpdateForm() : submitAddForm()"
        class="flex flex-col gap-4"
      >
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">User</label>
            <UserSelectDropdown
              v-model="formData.userId"
              :disabled="editingCertificationId !== null"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Name</label>
            <InputText
              v-model="formData.name"
              placeholder="Certification name"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Authority</label>
            <InputText
              v-model="formData.authority"
              placeholder="Issuing authority"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Date Obtained</label>
            <InputText
              type="date"
              v-model="formData.dateObtainedDisplay"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        <FilePicker
          v-model="formData.file"
          label="Select a file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          :disabled="editingCertificationId !== null"
        />

        <div class="flex justify-end gap-2">
          <Button label="Cancel" severity="secondary" text @click="closeAddModal" />
          <Button
            :label="editingCertificationId ? 'Update' : 'Add'"
            severity="success"
            type="submit"
          />
        </div>
      </form>
    </Dialog>

    <!-- Details Modal -->
    <Dialog
      v-model:visible="showDetailsModal"
      header="Détails de la Certification"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-700">Employé:</span>
            <div class="flex items-center gap-3">
              <img
                :src="
                  selectedCertification?.user?.fileUrl
                    ? appStore.baseURL + selectedCertification.user.fileUrl
                    : 'https://avatar.iran.liara.run/public/17'
                "
                alt="Avatar"
                class="w-8 h-8 rounded-full object-cover border"
              />
              <span>{{ selectedCertification?.user?.userName || 'Unknown' }}</span>
            </div>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Nom:</span
            ><span>{{ selectedCertification?.name || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Autorité:</span
            ><span>{{ selectedCertification?.authority || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Date Obtenue:</span
            ><span>{{ formatDate(selectedCertification?.dateObtained) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Fichier:</span>
            <a
              v-if="selectedCertification?.fileUrl"
              :href="appStore.baseURL + selectedCertification.fileUrl"
              target="_blank"
              class="text-blue-600 hover:underline"
              >Voir PDF</a
            >
            <span v-else>N/A</span>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <Button label="Fermer" severity="secondary" text @click="closeDetailsModal" />
        </div>
      </div>
    </Dialog>

    <!-- Delete Confirmation -->
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
              This action will permanently delete the certification for
              <strong>{{ certificationToDelete?.user?.userName || 'this employee' }}</strong
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
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import DashboardWrapper from '../admin/components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from '../admin/components/AdminDashboardOrders/SectionHeader.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import UserSelectDropdown from '@/components/common/UserSelectDropdown.vue'
import FilePicker from '@/components/common/FilePicker.vue'
import CertificationsIcon from '@/components/icons/CertificationsIcon.vue'
import { useAppStore } from '@/stores/app.store'
import { useCertificationsStore } from '@/stores/certification.store'

const appStore = useAppStore()
const certificationsStore = useCertificationsStore()
const toast = useToast()

// Modal state
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const selectedCertification = ref<any>(null)
const showDeleteModal = ref(false)
const certificationToDelete = ref<any>(null)
const deleteLoading = ref(false)
const editingCertificationId = ref<number | null>(null)

const formData = reactive({
  userId: '',
  name: '',
  authority: '',
  dateObtained: '',
  dateObtainedDisplay: '',
  file: null,
  fileUrl: ''
})

// Fetch certifications
onMounted(async () => {
  await certificationsStore.fetchCertifications()
  appStore.setLoading(false)
})

const onPage = async (event: any) => {
  const { page, rows } = event
  await certificationsStore.setPageAndSize(page + 1, rows)
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

// ----- MODALS -----
const openAddModal = () => {
  editingCertificationId.value = null
  const today = new Date()
  formData.userId = ''
  formData.name = ''
  formData.authority = ''
  formData.dateObtained = today.toISOString()
  formData.dateObtainedDisplay = today.toISOString().split('T')[0]
  formData.file = null
  formData.fileUrl = ''
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

// Update modal
const openUpdateModal = (cert: any) => {
  editingCertificationId.value = cert.id
  Object.assign(formData, {
    userId: cert.userId,
    name: cert.name,
    authority: cert.authority,
    dateObtained: cert.dateObtained,
    dateObtainedDisplay: cert.dateObtained?.split('T')[0],
    file: null,
    fileUrl: cert.fileUrl
  })
  showAddModal.value = true
}

// Submit Add
const submitAddForm = async () => {
  try {
    const payload = new FormData()
    payload.append('Certification.UserId', formData.userId)
    payload.append('Certification.Name', formData.name)
    payload.append('Certification.Authority', formData.authority)
    payload.append('Certification.DateObtained', new Date(formData.dateObtained).toISOString())
    if (formData.file) payload.append('File', formData.file)

    await certificationsStore.addCertification(payload)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Certification créée avec succès',
      life: 3000
    })
    await certificationsStore.fetchCertifications()
    closeAddModal()
  } catch (err) {
    console.error(err)
    toast.add({ severity: 'error', summary: 'Erreur', detail: "Échec de l'ajout", life: 3000 })
  }
}

// Submit Update
const submitUpdateForm = async () => {
  if (!editingCertificationId.value) return
  try {
    const payload = {
      id: editingCertificationId.value!,
      userId: formData.userId,
      fileUrl: formData.fileUrl,
      name: formData.name,
      authority: formData.authority,
      dateObtained: new Date(formData.dateObtained).toISOString()
    }
    console.log('payload', payload)
    await certificationsStore.editCertification(payload)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Certification mise à jour avec succès',
      life: 3000
    })
    await certificationsStore.fetchCertifications()
    closeAddModal()
    editingCertificationId.value = null
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Échec de la mise à jour',
      life: 3000
    })
  }
}

// ----- DETAILS -----
const openDetailsModal = (cert: any) => {
  selectedCertification.value = cert
  showDetailsModal.value = true
}
const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedCertification.value = null
}

// ----- DELETE -----
const confirmDelete = (cert: any) => {
  certificationToDelete.value = cert
  showDeleteModal.value = true
}
const closeDeleteModal = () => {
  showDeleteModal.value = false
  certificationToDelete.value = null
  deleteLoading.value = false
}

const executeDelete = async () => {
  if (!certificationToDelete.value) return
  deleteLoading.value = true
  try {
    await certificationsStore.removeCertification(certificationToDelete.value.id)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Certification supprimée',
      life: 3000
    })
    await certificationsStore.fetchCertifications()
    closeDeleteModal()
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Échec de la suppression',
      life: 3000
    })
    deleteLoading.value = false
  }
}

// Watch date input
watch(
  () => formData.dateObtainedDisplay,
  (newDate) => {
    if (!newDate) return
    const [year, month, day] = newDate.split('-')
    const date = new Date(formData.dateObtained || new Date())
    date.setFullYear(+year, +month - 1, +day)
    formData.dateObtained = date.toISOString()
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
