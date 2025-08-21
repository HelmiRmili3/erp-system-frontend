<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Gestion des Certifications">
        <template>
          <CertificationsIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
          >{{ certificationsStore.totalRecords }} éléments</span
        >
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
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
        </div>
        <!-- Add Certification Button -->
        <!-- <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" /> -->
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Certifications DataTable -->
    <DataTable
      :value="certificationsStore.certifications"
      class="p-datatable-sm"
      :loading="certificationsStore.loading"
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
      <!-- Columns -->
      <!-- <Column field="id" header="ID" sortable style="min-width: 100px" />
      <Column field="userId" header="Utilisateur" sortable style="min-width: 160px" /> -->
      <Column field="name" header="Nom" sortable style="min-width: 200px" />
      <Column field="authority" header="Autorité" sortable style="min-width: 150px" />
      <Column field="dateObtained" header="Date Obtenue" sortable style="min-width: 150px">
        <template #body="{ data }">
          <div>{{ formatDate(data.dateObtained) }}</div>
        </template>
      </Column>
      <Column field="fileUrl" header="Fichier" style="min-width: 150px">
        <template #body="{ data }">
          <a
            v-if="data.fileUrl"
            :href="`${appStore.baseURL + data.fileUrl}`"
            target="_blank"
            rel="noopener"
            class="text-blue-600 hover:underline"
          >
            Voir PDF
          </a>
          <span v-else>N/A</span>
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
          <p class="mt-2 text-gray-500">Aucune certification trouvée</p>
        </div>
      </template>
    </DataTable>

    <!-- Add Modal -->
    <Dialog
      v-model:visible="showAddModal"
      header="Ajouter Certification"
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
            <label for="name" class="text-sm font-medium text-gray-700">Nom</label>
            <InputText
              v-model="formData.name"
              placeholder="Nom de la certification"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="authority" class="text-sm font-medium text-gray-700">Autorité</label>
            <InputText
              v-model="formData.authority"
              placeholder="Autorité émettrice"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="dateObtained" class="text-sm font-medium text-gray-700">Date Obtenue</label>
            <InputText
              type="date"
              v-model="formData.dateObtainedDisplay"
              required
              class="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label for="fileUrl" class="text-sm font-medium text-gray-700">URL du Fichier</label>
          <InputText
            v-model="formData.fileUrl"
            placeholder="URL du fichier (optionnel)"
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
      header="Détails de la Certification"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">ID:</span>
            <span>{{ selectedCertification?.id || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Utilisateur:</span>
            <span>{{ selectedCertification?.userId || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Nom:</span>
            <span>{{ selectedCertification?.name || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Autorité:</span>
            <span>{{ selectedCertification?.authority || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Date Obtenue:</span>
            <span>{{ formatDate(selectedCertification?.dateObtained) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Fichier:</span>
            <a
              v-if="selectedCertification?.fileUrl"
              :href="`${appStore.baseURL + selectedCertification.fileUrl}`"
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
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useMyCertificationsStore } from '@/stores/myCertifications.store'
import CertificationsIcon from '@/components/icons/CertificationsIcon.vue'

const appStore = useAppStore()
const certificationsStore = useMyCertificationsStore()
const toast = useToast()

// Modal state
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const selectedCertification = ref<any>(null)

const formData = reactive({
  userId: '',
  name: '',
  authority: '',
  dateObtained: '', // ISO string (e.g., 2023-10-15T00:00:00Z)
  dateObtainedDisplay: '', // YYYY-MM-DD for input (e.g., 2023-10-15)
  fileUrl: ''
})

// Fetch certifications when component is mounted
onMounted(() => {
  certificationsStore.fetchCurrentUserCertifications()
  appStore.setLoading(false)
})

// Handle pagination
const onPage = async (event: any) => {
  const { page, rows } = event // page is 0-based in PrimeVue
  await certificationsStore.setPageAndSize(page + 1, rows, certificationsStore.searchQuery)
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  return dateString
    ? new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'N/A'
}

// Modal functions
const openAddModal = () => {
  const now = new Date()
  const todayISO = now.toISOString()
  const todayDate = todayISO.split('T')[0]
  Object.assign(formData, {
    userId: '',
    name: '',
    authority: '',
    dateObtained: todayISO,
    dateObtainedDisplay: todayDate,
    fileUrl: ''
  })
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const openDetailsModal = (certification: any) => {
  selectedCertification.value = certification
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedCertification.value = null
}

const submitForm = async () => {
  try {
    const data = {
      userId: formData.userId,
      name: formData.name,
      authority: formData.authority,
      dateObtained: formData.dateObtained,
      fileUrl: formData.fileUrl || null
    }
    // await certificationsStore.addCertification(data)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Certification créée avec succès',
      life: 3000
    })
    await certificationsStore.fetchCurrentUserCertifications()
    closeAddModal()
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Échec de l'enregistrement de la certification",
      life: 3000
    })
  }
}

// Watcher to sync dateObtainedDisplay with dateObtained
watch(
  () => formData.dateObtainedDisplay,
  (newDate) => {
    if (newDate) {
      const [year, month, day] = newDate.split('-')
      const date = new Date(formData.dateObtained || new Date())
      date.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day))
      formData.dateObtained = date.toISOString()
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
