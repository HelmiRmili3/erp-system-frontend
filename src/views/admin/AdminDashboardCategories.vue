<template>
  <DashboardWrapper>
    <div class="sticky top-0 z-10 bg-[#f9f9f9] pt-5">
      <SectionHeader title="Gestion des Catégories">
        <template #icon>
          <CategoriesFilledIcon />
        </template>
      </SectionHeader>
    </div>

    <div class="h-[20px]"></div>
    <div class="flex justify-between items-center flex-row">
      <div class="flex justify-between flex-row items-center gap-2.5 mb-2.5">
        <div class="flex flex-row gap-2.5 align-center">
          <span class="text-[#494949] text-xs font-medium flex items-center gap-2.5"
            >{{ categories.length }} éléments</span
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

        <!-- Add Category Button -->
        <Button icon="pi pi-plus" label="Ajouter" severity="success" @click="initAddCategory" />
      </div>
    </div>
    <div class="h-[20px]"></div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <!-- Categories DataTable -->
    <DataTable
      :value="filteredCategories"
      class="p-datatable-sm"
      :rows="pageSize"
      paginator
      :rowsPerPageOptions="[10, 20, 50]"
      :loading="loading"
      responsiveLayout="scroll"
      stripedRows
      :scrollable="true"
      scrollHeight="calc(100vh - 250px)"
    >
      <!-- Image/Logo -->
      <Column header="Image" style="width: 80px">
        <template #body="{ data }">
          <div class="flex items-center justify-center">
            <div v-if="data.logo" class="w-16 h-16 bg-gray-100 rounded overflow-hidden">
              <img
                :src="baseUrl + data.logo"
                :alt="data.name || 'Category image'"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-gray-400"
            >
              <i class="pi pi-image text-2xl"></i>
            </div>
          </div>
        </template>
      </Column>

      <!-- Category ID -->
      <Column field="id" header="ID" sortable style="width: 80px"></Column>

      <!-- Category Name -->
      <Column field="name" header="Nom" sortable>
        <template #body="{ data }">
          <div>{{ data.name }}</div>
          <div
            v-if="data.subCategories && data.subCategories.length > 0"
            class="text-xs text-gray-500"
          >
            {{ data.subCategories.length }} sous-catégorie(s)
          </div>
        </template>
      </Column>

      <!-- Actions -->
      <Column header="Actions" style="width: 150px">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
              icon="pi pi-eye"
              rounded
              text
              severity="info"
              @click="viewProducts(data)"
              v-tooltip="'Voir les produits'"
            />
            <Button
              icon="pi pi-list"
              rounded
              text
              severity="secondary"
              @click="viewSubcategories(data)"
              v-tooltip="'Voir les sous-catégories'"
            />
            <Button
              icon="pi pi-pencil"
              rounded
              text
              severity="success"
              @click="initEditCategory(data)"
              v-tooltip="'Modifier'"
            />
            <Button
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              @click="confirmDeleteCategory(data)"
              v-tooltip="'Supprimer'"
            />
          </div>
        </template>
      </Column>

      <!-- Empty data -->
      <template #empty>
        <div class="flex flex-col items-center justify-center py-8">
          <i class="pi pi-exclamation-triangle text-4xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">Aucune catégorie trouvée</p>
        </div>
      </template>
    </DataTable>

    <!-- Category Dialog -->
    <categories-upsert-dialog ref="upsertDialog" @save="upsertCategory" />
  </DashboardWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Category, UpsertCategoryDto } from '@/models/Category.model'
import CategoriesUpsertDialog from './components/AdminDashboardCategories/CategoriesUpsert.vue'
import DashboardWrapper from './components/AdminDashboardOrders/DashboardWrapper.vue'
import SectionHeader from './components/AdminDashboardOrders/SectionHeader.vue'
import CategoriesFilledIcon from '@/assets/svg/categories_filled.svg?component'
import { useTemplateRef } from 'vue'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from '@/services/Category.service'
import type { IsLoadable } from '@/models/common.model'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import type { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.store'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import InputText from 'primevue/inputtext'

const baseUrl = import.meta.env.VITE_BASE_URL + '/files/'
const appStore = useAppStore()
const loading = ref(false)
const isAdding = ref(false)
const upsertDialog = useTemplateRef<any>('upsertDialog')
const toast = useToast()
const confirm = useConfirm()
const router = useRouter()
const categories = ref<IsLoadable<Category>[]>([])
const searchQuery = ref('')
const pageSize = ref(10)

// Filtered categories based on search
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value

  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(
    (cat) => cat.name.toLowerCase().includes(query) || (cat.id && cat.id.toString().includes(query))
  )
})

const getCategoriesLogic = async () => {
  try {
    loading.value = true
    const response = await getCategories()
    categories.value = response.data.data as IsLoadable<Category>[]
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger les catégories',
      life: 3000
    })
  } finally {
    loading.value = false
    appStore.setLoading(false)
  }
}

const initAddCategory = () => {
  upsertDialog.value.show()
}

const initEditCategory = (category: Category) => {
  upsertDialog.value.show(category)
}

const confirmDeleteCategory = (category: Category) => {
  confirm.require({
    message: 'Êtes-vous sûr de vouloir supprimer cette catégorie?',
    header: 'Confirmation de suppression',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Oui',
    rejectLabel: 'Non',
    accept: () => deleteCategoryLogic(category)
  })
}

const deleteCategoryLogic = async (category: Category) => {
  const existingCategory = categories.value.find((cat) => cat.id === category.id)
  if (!existingCategory) return
  existingCategory.isLoading = true

  try {
    await deleteCategory(category.id.toString())
    categories.value = categories.value.filter((cat) => cat.id !== category.id)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Catégorie supprimée avec succès',
      life: 3000
    })
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: axiosError.response?.data.message || 'Échec de la suppression de la catégorie',
      life: 3000
    })
  } finally {
    if (existingCategory) {
      existingCategory.isLoading = false
    }
  }
}

const createCategoryLogic = async (value: UpsertCategoryDto) => {
  isAdding.value = true
  try {
    const result = (await createCategory(value)).data.data as IsLoadable<Category>
    categories.value.unshift(result)

    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Catégorie créée avec succès',
      life: 3000
    })
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: axiosError.response?.data.message || 'Échec de la création de la catégorie',
      life: 3000
    })
  } finally {
    isAdding.value = false
  }
}

const updateCategoryLogic = async (value: UpsertCategoryDto) => {
  const existingCategory = categories.value.find((category) => category.id === value.id)
  if (!existingCategory) return
  existingCategory.isLoading = true
  try {
    const result = (await updateCategory(value)).data.data
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Catégorie mise à jour avec succès',
      life: 3000
    })

    categories.value = categories.value.map((category) => {
      if (category.id === result.id) {
        return result as IsLoadable<Category>
      }
      return category
    })
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: axiosError.response?.data.message || 'Échec de la mise à jour de la catégorie',
      life: 3000
    })
  } finally {
    if (existingCategory) {
      existingCategory.isLoading = false
    }
  }
}

const upsertCategory = (category: UpsertCategoryDto) => {
  if (category.id) updateCategoryLogic(category)
  else createCategoryLogic(category)
}

const viewProducts = (category: Category) => {
  router.push({
    name: 'AdminDashboardProducts',
    query: {
      categoryId: category.id.toString()
    }
  })
}

const viewSubcategories = (category: Category) => {
  router.push({
    name: 'AdminDashboardSubCategories',
    params: {
      id: category.id.toString()
    }
  })
}

onMounted(() => {
  getCategoriesLogic()
})

defineOptions({
  name: 'AdminDashboardCategories'
})
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
</style>
