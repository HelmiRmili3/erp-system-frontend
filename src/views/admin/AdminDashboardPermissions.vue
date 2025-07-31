<template>
  <DashboardWrapper>
    <!-- Sticky header -->
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Gestion des Permissions">
        <template #icon>
          <PermissionsFilledIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>

    <!-- Toolbar -->
    <div class="flex justify-between items-center flex-row">
      <span class="text-[#494949] text-xs font-medium">
        {{ adminStore.permissions.length }} éléments
      </span>

      <div class="flex gap-4">
        <InputText
          v-model="searchQuery"
          placeholder="Rechercher..."
          class="pl-10 py-2 border border-gray-300 rounded-lg"
        />
        <!-- <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" /> -->
      </div>
    </div>

    <div class="h-[20px]"></div>

    <!-- Permissions DataTable -->
    <DataTable
      :value="adminStore.permissions"
      class="p-datatable-sm"
      :loading="adminStore.loading"
      :rows="pageSize"
      :totalRecords="totalRecords"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      tableStyle="min-width: 800px"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <!-- <Column field="id" header="ID" sortable style="width: 380px" /> -->
      <Column field="name" header="Nom" sortable style="min-width: 100px" />
      <Column field="description" header="Description" sortable style="min-width: 100px" />

      <!-- <Column header="Actions" style="width: 80px">
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
      </Column> -->

      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">Aucune permission trouvée</p>
        </div>
      </template>
    </DataTable>

    <!-- Add / Edit Modal -->
    <Dialog
      v-model:visible="showModal"
      :header="isUpdateMode ? 'Modifier Permission' : 'Ajouter Permission'"
      modal
      :style="{ width: '500px' }"
      class="p-4"
    >
      <form @submit.prevent="submitForm" class="flex flex-col gap-3">
        <InputText v-model="formData.name" placeholder="Nom" required />
        <Textarea v-model="formData.description" placeholder="Description" rows="4" required />

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Annuler" severity="secondary" text @click="closeModal" />
          <Button :label="isUpdateMode ? 'Modifier' : 'Ajouter'" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>

    <!-- Delete Confirmation -->
    <!-- <Dialog
      v-model:visible="showDeleteModal"
      header="Confirmation de suppression"
      modal
      :style="{ width: '400px' }"
    >
      <div class="flex flex-col items-center gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-red-500"></i>
        <p class="text-gray-700">Êtes-vous sûr de vouloir supprimer cette permission ?</p>
        <div class="flex justify-end gap-2">
          <Button label="Non" severity="secondary" text @click="closeDeleteModal" />
          <Button label="Oui" severity="danger" @click="confirmDelete" />
        </div>
      </div>
    </Dialog> -->
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { useAdminStore } from '@/stores/admin.store'
import DashboardWrapper from './components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from './components/AdminDashboardOrders/SectionHeader.vue'
import PermissionsFilledIcon from '@/assets/svg/eye.svg'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'

interface Permission {
  id: string
  name: string
  description: string
}

const appStore = useAppStore()
const adminStore = useAdminStore()
const toast = useToast()

/* ---------- State ---------- */
const showModal = ref(false)
const showDeleteModal = ref(false)
const isUpdateMode = ref(false)
const selectedPermId = ref<string | null>(null)
const searchQuery = ref('')

const formData = reactive({
  name: '',
  description: ''
})

/* ---------- Lifecycle ---------- */
onMounted(() => {
  adminStore.fetchPermissions()
  appStore.setLoading(false)
})

/* ---------- Pagination / Search ---------- */
const pageSize = ref(10)
const totalRecords = ref(adminStore.permissions.length)

const onPage = async (e: any) => {
  // server-side pagination placeholder
  pageSize.value = e.rows
}

watch(searchQuery, () => {
  /* simple client filter (or switch to server) */
  adminStore.permissions = adminStore.permissions.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

/* ---------- Helpers ---------- */
const openAddModal = () => {
  isUpdateMode.value = false
  Object.assign(formData, { name: '', description: '' })
  showModal.value = true
}

const openUpdateModal = (perm: Permission) => {
  isUpdateMode.value = true
  selectedPermId.value = perm.id
  Object.assign(formData, perm)
  showModal.value = true
}

const openDeleteModal = (id: string) => {
  selectedPermId.value = id
  showDeleteModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPermId.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedPermId.value = null
}

/* ---------- CRUD ---------- */
const submitForm = async () => {
  try {
    if (isUpdateMode.value && selectedPermId.value) {
      // await adminStore.updatePermission(selectedPermId.value, formData)
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Permission modifiée',
        life: 3000
      })
    } else {
      // await adminStore.addPermission(formData)
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Permission créée', life: 3000 })
    }
    adminStore.fetchPermissions()
    closeModal()
  } catch {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Opération échouée', life: 3000 })
  }
}

const confirmDelete = async () => {
  if (!selectedPermId.value) return
  try {
    // await adminStore.removePermission(selectedPermId.value)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Permission supprimée',
      life: 3000
    })
    adminStore.fetchPermissions()
  } catch {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Suppression échouée', life: 3000 })
  } finally {
    closeDeleteModal()
  }
}
</script>
