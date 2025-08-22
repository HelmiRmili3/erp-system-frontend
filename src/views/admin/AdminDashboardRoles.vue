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

    <!-- Roles table -->
    <DataTable
      :value="filteredRoles"
      class="p-datatable-sm"
      :loading="store.loading"
      :rows="store.pageSize"
      :totalRecords="store.totalRecords"
      :first="(store.currentPage - 1) * store.pageSize"
      :lazy="true"
      stripedRows
      paginator
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPage"
      tableStyle="min-width: 1000px "
    >
      <Column field="name" header="Rôle" style="width: 150px" />

      <!-- Permissions toggling (shows ALL permissions) -->
      <Column header="Permissions" style="min-width: 400px">
        <template #body="{ data: role }">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="p in store.permissions"
              :key="p.id"
              class="px-3 py-1 rounded-full text-xs border transition-colors"
              :class="
                role.permissions?.some((rp: any) => rp.id === p.id)
                  ? 'bg-gray-700 text-white border-gray-700'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              "
              @click="togglePermission(role, p)"
            >
              {{ p.name }}
            </button>
          </div>
        </template>
      </Column>

      <Column header="Actions" style="width: 150px">
        <template #body="{ data: role }">
          <div class="flex gap-1">
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

    <!-- Add Role Modal -->
    <Dialog
      v-model:visible="showModal"
      header="Ajouter Rôle"
      modal
      :style="{ width: '400px' }"
      class="p-4"
    >
      <form @submit.prevent="submitForm" class="flex flex-col gap-3">
        <InputText v-model="formData.name" placeholder="Nom du rôle" required />

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Annuler" severity="secondary" text @click="closeModal" />
          <Button label="Ajouter" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
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
import { useToast } from 'primevue/usetoast'

const appStore = useAppStore()
const store = useRolesPermissionsStore()
const toast = useToast()

const searchQuery = ref('')
const showModal = ref(false)

const formData = reactive({
  name: ''
})

/* ---------- Lifecycle ---------- */
onMounted(async () => {
  await store.init() // fetch roles (paginated) + fetch all permissions (50/page loop)
  appStore.setLoading(false)
})

/* ---------- Pagination ---------- */
const onPage = (e: any) => {
  store.setPageAndSize(e.page + 1, e.rows)
}

/* ---------- Client search (on current page data only) ---------- */
const filteredRoles = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return store.rolesPermissions
  return store.rolesPermissions.filter(
    (r: any) =>
      r.name?.toLowerCase().includes(q) ||
      r.permissions?.some((p: any) => p.name?.toLowerCase().includes(q))
  )
})

/* ---------- Add Role Modal ---------- */
const openAddModal = () => {
  formData.name = ''
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

/* ---------- Add Role ---------- */
const submitForm = async () => {
  try {
    await store.addRole(formData.name, [])
    await store.fetchRolesWithPermissions()
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Rôle créé', life: 3000 })
    closeModal()
  } catch {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Création échouée', life: 3000 })
  }
}

/* ---------- Delete Role ---------- */
const confirmDelete = async (role: string) => {
  try {
    await store.removeRole({ role })
    await store.fetchRolesWithPermissions()
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Rôle supprimé', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Suppression échouée', life: 3000 })
  }
}

/* ---------- Toggle Permission (add/remove + refetch roles) ---------- */
const togglePermission = async (role: any, permission: any) => {
  const hasPermission = role.permissions?.some((p: any) => p.id === permission.id)
  try {
    if (hasPermission) {
      await store.removePermissions(role.name, [permission.name])
      await store.fetchRolesWithPermissions()

      toast.add({
        severity: 'info',
        summary: 'Mise à jour',
        detail: `Permission "${permission.name}" retirée de ${role.name}`,
        life: 1800
      })
    } else {
      await store.assignPermissions(role.name, [permission.name])
      await store.fetchRolesWithPermissions()
      toast.add({
        severity: 'success',
        summary: 'Mise à jour',
        detail: `Permission "${permission.name}" ajoutée à ${role.name}`,
        life: 1800
      })
    }
    // store methods already refetch roles, so nothing else to do here
  } catch {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour échouée', life: 3000 })
  }
}
</script>
