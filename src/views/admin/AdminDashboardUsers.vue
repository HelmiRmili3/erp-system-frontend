<template>
  <DashboardWrapper>
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Gestion des Employees">
        <template #icon>
          <UsersFilledIcon />
        </template>
      </SectionHeader>
    </div>

    <!-- Toolbar -->
    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5">
          {{ adminStore.totalRecords }} éléments
        </span>
      </div>
      <div class="flex justify-start items-center gap-4">
        <!-- Search -->
        <InputText
          v-model="searchQuery"
          placeholder="Rechercher..."
          class="pl-10 py-2 border border-gray-300 rounded-lg"
        />
        <!-- Add -->
        <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" />
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Table -->
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
      scrollHeight="calc(100vh)"
    >
      <Column field="fullName" header="Nom complet" sortable style="min-width: 160px" />
      <Column field="email" header="Email" sortable style="min-width: 180px" />
      <Column field="jobTitle" header="Poste" sortable style="min-width: 140px" />
      <Column field="department" header="Département" sortable style="min-width: 140px" />
      <Column field="contractType" header="Contrat" sortable style="min-width: 120px" />
      <Column field="status" header="Statut" sortable style="min-width: 100px" />

      <!-- Roles -->
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
      <Column header="Permissions" style="min-width: 120px">
        <template #body="{ data }">
          <Button
            label="Voir"
            text
            severity="info"
            @click="openPermissionsModal(data)"
            v-tooltip="'Voir Permissions'"
          />
        </template>
      </Column>

      <!-- Actions -->
      <Column header="Actions" style="width: 100px">
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
            <Button icon="pi pi-add" rounded text severity="success" v-tooltip="'Add'" />
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

      <!-- Empty -->
      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="text-gray-500">Aucun utilisateur trouvé</p>
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
          <small v-if="submitted && errors.email" class="p-error">{{ errors.email }}</small>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <InputText v-model="formData.email" type="email" placeholder="Email" required />
          <InputText v-model="formData.userName" placeholder="Nom d’utilisateur" required />
          <small v-if="submitted && errors.userName" class="p-error">{{ errors.userName }}</small>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <Password v-model="formData.password" placeholder="Mot de passe" toggleMask required />
          <InputText v-model="formData.phone" placeholder="Téléphone" />
        </div>

        <InputText v-model="formData.jobTitle" placeholder="Poste" required />
        <InputText v-model="formData.department" placeholder="Département" />
        <InputText v-model="formData.address" placeholder="Adresse" />

        <div class="grid grid-cols-2 gap-3">
          <DatePicker
            v-model="formData.birthDate"
            dateFormat="yy-mm-dd"
            :maxDate="maxDate"
            placeholder="Date de naissance"
            showIcon
          />
          <DatePicker
            v-model="formData.hireDate"
            dateFormat="yy-mm-dd"
            :maxDate="maxDate"
            placeholder="Date d’embauche"
            showIcon
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <Dropdown
            v-model="formData.contractType"
            :options="contractTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Type de contrat"
          />
          <Dropdown
            v-model="formData.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Statut"
          />
        </div>

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

    <!-- Permissions Popup -->
    <Dialog
      v-model:visible="showPermissionsModal"
      header="Permissions de l'utilisateur"
      modal
      :style="{ width: '400px' }"
      class="p-4"
    >
      <div class="flex flex-col gap-3">
        <p v-if="selectedUser && selectedUser.permissions.length === 0" class="text-gray-500">
          Aucune permission attribuée.
        </p>
        <div v-else class="flex flex-wrap gap-2">
          <span
            v-for="permission in selectedUser?.permissions"
            :key="permission"
            class="bg-gray-500 text-white px-3 py-1 rounded-full text-sm"
          >
            {{ permission }}
          </span>
        </div>
        <div class="flex justify-end mt-4">
          <Button label="Fermer" severity="secondary" text @click="closePermissionsModal" />
        </div>
      </div>
    </Dialog>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import DashboardWrapper from './components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from './components/AdminDashboardOrders/SectionHeader.vue'
import UsersFilledIcon from '@/assets/svg/users.svg'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Password from 'primevue/password'
import { useToast } from 'primevue/usetoast'
/* ---------- Stores import ---------- */
import { useAuthStore } from '@/stores/auth.store'
import { useAppStore } from '@/stores/app.store'
import { useAdminStore } from '@/stores/admin.store'

/* ---------- Stores ---------- */
const appStore = useAppStore()
const adminStore = useAdminStore()
const authStore = useAuthStore()
const toast = useToast()

/* ---------- State ---------- */
const showModal = ref(false)
const showDeleteModal = ref(false)
const showPermissionsModal = ref(false)
const isUpdateMode = ref(false)
const selectedUserId = ref<string | null>(null)
const selectedUser = ref<any>(null)
const searchQuery = ref('')
const maxDate = ref(new Date())
const submitted = ref(false)

const contractTypes = [
  { label: 'CDI', value: 0 },
  { label: 'CDD', value: 1 },
  { label: 'Stage', value: 2 }
]

const statusOptions = [
  { label: 'Actif', value: 0 },
  { label: 'Inactif', value: 1 }
]

const formData = reactive({
  email: '',
  userName: '',
  password: '',
  firstName: '',
  lastName: '',
  birthDate: null as Date | null,
  address: '',
  phone: '',
  jobTitle: '',
  department: '',
  hireDate: null as Date | null,
  contractType: 0,
  status: 0
})
const errors = reactive({
  email: '',
  userName: ''
})
const validateForm = () => {
  let isValid = true

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = 'Email est requis'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Format email invalide'
    isValid = false
  } else {
    errors.email = ''
  }

  // Username validation
  const usernameRegex = /^[a-zA-Z0-9]+$/
  if (!formData.userName) {
    errors.userName = "Nom d'utilisateur est requis"
    isValid = false
  } else if (!usernameRegex.test(formData.userName)) {
    errors.userName = 'Peut seulement contenir des lettres ou des chiffres'
    isValid = false
  } else {
    errors.userName = ''
  }

  return isValid
}
/* ---------- Lifecycle ---------- */
onMounted(async () => {
  await adminStore.fetchUsers()
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
const openAddModal = () => {
  isUpdateMode.value = false
  Object.assign(formData, {
    email: '',
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: null,
    address: '',
    phone: '',
    jobTitle: '',
    department: '',
    hireDate: null,
    contractType: 0,
    status: 0
  })
  showModal.value = true
}

const openUpdateModal = (user: any) => {
  isUpdateMode.value = true
  selectedUserId.value = user.id
  Object.assign(formData, {
    email: user.email,
    userName: user.userName,
    password: '',
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate ? new Date(user.birthDate) : null,
    address: user.address,
    phone: user.phone,
    jobTitle: user.jobTitle,
    department: user.department,
    hireDate: user.hireDate ? new Date(user.hireDate) : null,
    contractType: user.contractType,
    status: user.status
  })
  showModal.value = true
}

const openDeleteModal = (id: string) => {
  selectedUserId.value = id
  showDeleteModal.value = true
}

const openPermissionsModal = (user: any) => {
  selectedUser.value = user
  showPermissionsModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUserId.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedUserId.value = null
}

const closePermissionsModal = () => {
  showPermissionsModal.value = false
  selectedUser.value = null
}

/* ---------- CRUD ---------- */
const submitForm = async () => {
  submitted.value = true
  if (!validateForm()) return
  try {
    const formattedData = {
      ...formData,
      birthDate: formData.birthDate ? formData.birthDate.toISOString() : new Date().toISOString(),
      hireDate: formData.hireDate ? formData.hireDate.toISOString() : new Date().toISOString()
    }

    if (isUpdateMode.value && selectedUserId.value) {
      // await adminStore.updateUser(selectedUserId.value, formattedData)
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Utilisateur modifié',
        life: 3000
      })
    } else {
      await authStore.register(formattedData)
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur créé', life: 3000 })
    }

    await adminStore.fetchUsers()
    closeModal()
  } catch (err) {
    console.error('submitForm error:', err)
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Opération échouée', life: 3000 })
  }
}

const confirmDelete = async () => {
  if (!selectedUserId.value) return
  try {
    // await adminStore.removeUser(selectedUserId.value)
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
