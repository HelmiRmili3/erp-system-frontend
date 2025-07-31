<template>
  <DashboardWrapper>
    <!-- Sticky header -->
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Gestion des Rôles">
        <template #icon><RolesFilledIcon /></template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>

    <!-- Toolbar -->
    <div class="flex justify-between items-center flex-row">
      <span class="text-[#494949] text-xs font-medium"> {{ store.totalRecords }} éléments </span>
      <div class="flex gap-4">
        <InputText
          v-model="searchQuery"
          placeholder="Rechercher..."
          class="pl-10 py-2 border border-gray-300 rounded-lg"
        />
        <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="openAddModal" />
      </div>
    </div>

    <div class="h-[20px]"></div>

    <!-- Role → Permissions table -->
    <DataTable
      :value="store.rolesPermissions"
      class="p-datatable-sm"
      :loading="store.loading"
      :rows="store.pageSize"
      :totalRecords="store.totalRecords"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      tableStyle="min-width: 1000px"
      scrollable
      scrollHeight="calc(100vh - 250px)"
    >
      <Column field="name" header="Rôle" sortable style="width: 150px" />
      <Column header="Permissions" style="min-width: 280px">
        <template #body="{ data: role }">
          <div class="flex gap-1 flex-nowrap overflow-x-auto">
            <span
              v-for="p in role.permissions"
              :key="p.id"
              class="bg-gray-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap"
            >
              {{ p.name }}
            </span>
          </div>
        </template>
      </Column>

      <Column header="Actions" style="width: 150px">
        <template #body="{ data: role }">
          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              rounded
              text
              severity="success"
              @click="openUpdateModal(role)"
              v-tooltip="'Modifier'"
            />
            <Button
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              @click="confirmDelete(role.name)"
              v-tooltip="'Supprimer'"
            />
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">Aucun rôle trouvé</p>
        </div>
      </template>
    </DataTable>

    <!-- Add / Edit Modal -->
    <Dialog
      v-model:visible="showModal"
      :header="isUpdateMode ? 'Modifier Rôle' : 'Ajouter Rôle'"
      modal
      :style="{ width: '500px' }"
      class="p-4"
    >
      <form @submit.prevent="submitForm" class="flex flex-col gap-3">
        <InputText v-model="formData.name" placeholder="Nom" required />
        <!-- <Textarea v-model="formData.description" placeholder="Description" rows="4" required /> -->

        <label class="text-sm font-medium">Permissions</label>
        <MultiSelect
          v-model="formData.permissions"
          :options="store.permissions"
          optionLabel="name"
          optionValue="name"
          placeholder="Sélectionner..."
        />

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Annuler" severity="secondary" text @click="closeModal" />
          <Button :label="isUpdateMode ? 'Modifier' : 'Ajouter'" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/stores/app.store'
import { useRolesPermissionsStore } from '@/stores/roles.store'
import DashboardWrapper from './components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from './components/AdminDashboardOrders/SectionHeader.vue'
import RolesFilledIcon from '@/assets/svg/extras.svg'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import { useToast } from 'primevue/usetoast'

const appStore = useAppStore()
const store = useRolesPermissionsStore()
const toast = useToast()

const searchQuery = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const isUpdateMode = ref(false)
const selectedRoleName = ref<string | null>(null)

const formData = reactive({
  name: '',
  permissions: [] as string[]
})

/* ---------- Lifecycle ---------- */
onMounted(async () => {
  await store.init()
  appStore.setLoading(false)
})

/* ---------- Pagination ---------- */
const onPage = (e: any) => {
  store.setPageAndSize(e.page + 1, e.rows)
}

/* ---------- Helpers ---------- */
const openAddModal = () => {
  isUpdateMode.value = false
  Object.assign(formData, { name: '', description: '', permissionIds: [] })
  showModal.value = true
}

const openUpdateModal = (role: any) => {
  isUpdateMode.value = true

  selectedRoleName.value = role.name
  Object.assign(formData, {
    name: role.name,
    permissions: role.permissions?.map((p: any) => p.name) || []
  })
  showModal.value = true
}

// const openDeleteModal = (name: string) => {
//   selectedRoleName.value = name
//   showDeleteModal.value = true
// }

const closeModal = () => {
  showModal.value = false
  selectedRoleName.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedRoleName.value = null
}

/* ---------- CRUD ---------- */
const submitForm = async () => {
  try {
    if (isUpdateMode.value && selectedRoleName.value) {
      /* TODO: update endpoint */
      await store.removePermissions(formData.name, formData.permissions)
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Rôle modifié', life: 3000 })
    } else {
      await store.addRole(formData.name, formData.permissions)
      toast.add({ severity: 'success', summary: 'Succès', detail: 'Rôle créé', life: 3000 })
    }
    await store.fetchRolesWithPermissions()
    closeModal()
  } catch {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Opération échouée', life: 3000 })
  }
}

const confirmDelete = async (role: string) => {
  try {
    await store.removeRole({ role: role })
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Rôle supprimé', life: 3000 })
    await store.fetchRolesWithPermissions()
  } catch {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Suppression échouée', life: 3000 })
  } finally {
    closeDeleteModal()
  }
}
</script>
