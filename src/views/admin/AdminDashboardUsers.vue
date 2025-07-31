<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Gestion des Employees">
        <template #icon>
          <UsersFilledIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <div class="flex flex-row gap-2.5 align-center">
          <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
            >{{ adminStore.totalRecords }} éléments</span
          >
        </div>
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search Input -->
        <div class="relative">
          <InputText
            v-model="searchQuery"
            placeholder="Rechercher..."
            class="pl-10 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <!-- Add Absence Button -->
        <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" />
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Users DataTable -->

    <DataTable
      :value="adminStore.users"
      class="p-datatable-sm"
      :loading="adminStore.loading"
      :rows="adminStore.pageSize"
      :totalRecords="adminStore.totalRecords"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <!-- Basic identity -->
      <Column field="fullName" header="Nom complet" sortable style="min-width: 160px" />
      <Column field="email" header="Email" sortable style="min-width: 180px" />
      <Column field="jobTitle" header="Poste" sortable style="min-width: 140px" />
      <Column field="department" header="Département" sortable style="min-width: 140px" />

      <!-- Dates -->
      <!-- <Column field="birthDate" header="Date de naissance" sortable style="min-width: 140px">
        <template #body="{ data }">{{ formatDate(data.birthDate) }}</template>
      </Column>
      <Column field="hireDate" header="Date d’embauche" sortable style="min-width: 140px">
        <template #body="{ data }">{{ formatDate(data.hireDate) }}</template>
      </Column> -->

      <!-- Contract & Status -->
      <Column field="contractType" header="Contrat" sortable style="min-width: 120px" />
      <Column field="status" header="Statut" sortable style="min-width: 100px" />

      <!-- Supervisor -->
      <!-- <Column field="supervisorFullName" header="Superviseur" sortable style="min-width: 140px" /> -->

      <!-- Address -->
      <!-- <Column field="address" header="Adresse" sortable style="min-width: 200px" /> -->

      <!-- Roles & Permissions (comma-separated) -->
      <!-- Rôles -->
      <Column field="roles" header="Rôles" style="min-width: 160px">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="r in data.roles"
              :key="r"
              class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
            >
              {{ r }}
            </span>
          </div>
        </template>
      </Column>

      <!-- Permissions -->
      <Column field="permissions" header="Permissions" style="min-width: 160px">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="p in data.permissions"
              :key="p"
              class="bg-gray-500 text-white px-2 py-1 rounded-full text-xs"
            >
              {{ p }}
            </span>
          </div>
        </template>
      </Column>

      <!-- Actions -->
      <Column header="Actions" style="width: 120px">
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
          <p class="mt-2 text-gray-500">Aucun utilisateur trouvé</p>
        </div>
      </template>
    </DataTable>

    <!-- Add / Edit Modal -->
    <Dialog
      v-model:visible="showModal"
      :header="isUpdateMode ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'"
      modal
      :style="{ width: '600px' }"
      class="p-4"
    >
      <form @submit.prevent="submitForm" class="flex flex-col gap-3">
        <div class="grid grid-cols-2 gap-3">
          <InputText v-model="formData.firstName" placeholder="Prénom" required />
          <InputText v-model="formData.lastName" placeholder="Nom" required />
        </div>
        <InputText v-model="formData.email" type="email" placeholder="Email" required />
        <InputText v-model="formData.jobTitle" placeholder="Poste" required />
        <InputText v-model="formData.department" placeholder="Département" />
        <InputText v-model="formData.address" placeholder="Adresse" />
        <InputText v-model="formData.phoneNumber" placeholder="Téléphone" />
        <InputText v-model="formData.contractType" placeholder="Type de contrat" />
        <InputText v-model="formData.status" placeholder="Statut" />
        <InputText type="date" v-model="formData.birthDate" placeholder="Date de naissance" />
        <InputText type="date" v-model="formData.hireDate" placeholder="Date d’embauche" />

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Annuler" severity="secondary" text @click="closeModal" />
          <Button :label="isUpdateMode ? 'Modifier' : 'Ajouter'" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>

    <!-- Delete Confirmation -->
    <Dialog
      v-model:visible="showDeleteModal"
      header="Confirmation de suppression"
      modal
      :style="{ width: '400px' }"
    >
      <div class="flex flex-col items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-red-500"></i>
        <p class="text-gray-700">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
        <div class="flex justify-end gap-2">
          <Button label="Non" severity="secondary" text @click="closeDeleteModal" />
          <Button label="Oui" severity="danger" @click="confirmDelete" />
        </div>
      </div>
    </Dialog>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { useAdminStore } from '@/stores/admin.store'
import DashboardWrapper from './components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from './components/AdminDashboardOrders/SectionHeader.vue'
import UsersFilledIcon from '@/assets/svg/users.svg'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

/* ---------- Stores ---------- */
const appStore = useAppStore()
const adminStore = useAdminStore()
const toast = useToast()

/* ---------- State ---------- */
const showModal = ref(false)
const showDeleteModal = ref(false)
const isUpdateMode = ref(false)
const selectedUserId = ref<string | null>(null)
const searchQuery = ref('')

const formData = reactive({
  firstName: '',
  lastName: '',
  birthDate: '',
  address: '',
  email: '',
  jobTitle: '',
  department: '',
  hireDate: '',
  contractType: '',
  status: '',
  phoneNumber: ''
})

/* ---------- Lifecycle ---------- */
onMounted(() => {
  adminStore.fetchUsers()
  appStore.setLoading(false)
})

/* ---------- Pagination ---------- */
const onPage = async (event: any) => {
  const { page, rows } = event
  await adminStore.setPageAndSize(page + 1, rows)
}

/* ---------- Search ---------- */
watch(searchQuery, () => {
  adminStore.fetchUsers(1, adminStore.pageSize, searchQuery.value)
})

/* ---------- Helpers ---------- */
const formatDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString('fr-FR') : '')

const openAddModal = () => {
  isUpdateMode.value = false
  Object.assign(formData, {
    firstName: '',
    lastName: '',
    birthDate: '',
    address: '',
    email: '',
    jobTitle: '',
    department: '',
    hireDate: '',
    contractType: '',
    status: '',
    phoneNumber: ''
  })
  showModal.value = true
}

const openUpdateModal = (user: any) => {
  isUpdateMode.value = true
  selectedUserId.value = user.id
  Object.assign(formData, user)
  showModal.value = true
}

const openDeleteModal = (id: string) => {
  selectedUserId.value = id
  showDeleteModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUserId.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedUserId.value = null
}

/* ---------- CRUD ---------- */
const submitForm = async () => {
  try {
    if (isUpdateMode.value && selectedUserId.value) {
      // await adminStore.updateUser(selectedUserId.value, formData) // implement as needed
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Utilisateur modifié',
        life: 3000
      })
    } else {
      // await adminStore.addUser(formData) // implement as needed
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur créé', life: 3000 })
    }
    await adminStore.fetchUsers()
    closeModal()
  } catch {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Opération échouée', life: 3000 })
  }
}

const confirmDelete = async () => {
  if (!selectedUserId.value) return
  try {
    // await adminStore.removeUser(selectedUserId.value) // implement as needed
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Utilisateur supprimé',
      life: 3000
    })
    await adminStore.fetchUsers()
  } catch {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Suppression échouée', life: 3000 })
  } finally {
    closeDeleteModal()
  }
}
</script>
