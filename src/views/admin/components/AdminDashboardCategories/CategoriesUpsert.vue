<template>
  <teleport to="#app">
    <Dialog
      v-model:visible="dialogVisible"
      :modal="true"
      :header="isEdit ? 'Modifier la catégorie' : 'Ajouter une catégorie'"
      class="categories-upsert-dialog"
      :closable="false"
    >
      <div
        class="flex justify-start items-start flex-col gap-[15px] p-[15px] bg-[#FFFFFE] rounded-[10px] w-[40vw]"
      >
        <!-- Upload file -->
        <FileUpload
          v-if="!imagePreview"
          ref="fileupload"
          mode="basic"
          name="demo[]"
          accept="image/*"
          :maxFileSize="1000000"
          @select="onSelect"
        />
        <div v-else class="relative w-full rounded-lg">
          <img
            :src="imagePreview"
            alt="Category image"
            class="w-full object-contain rounded-lg max-h-40"
          />
          <Button
            icon="pi pi-times"
            class="absolute top-2 right-2 p-2"
            style="position: absolute !important"
            severity="danger"
            rounded
            @click="resetImage"
          />
        </div>
        <!-- Form -->
        <div class="flex self-stretch justify-start items-start flex-col">
          <FloatLabel class="w-full" variant="on">
            <InputText
              id="label"
              v-model="category.name"
              class="w-full"
              required
              :invalid="!category.name?.trim()"
            />
            <label for="label">name</label>
          </FloatLabel>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 w-full">
          <Button
            label="Annuler"
            @click="hideDialog"
            severity="secondary"
            class="flex-1 px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <Button
            :label="isEdit ? 'Modifier' : 'Ajouter'"
            @click="saveCategory"
            class="flex-1 px-4 py-2 text-xs font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>
      </template>
    </Dialog>
  </teleport>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed } from 'vue'
import type { Category, UpsertCategoryDto } from '@/models/Category.model'
import { useToast } from 'primevue/usetoast'
import type { FileUploadSelectEvent } from 'primevue/fileupload'

const emit = defineEmits<{
  (e: 'hide'): void
  (e: 'save', category: UpsertCategoryDto): void
}>()

const dialogVisible = ref(false)
const submitted = ref(false)
const toast = useToast()

const category = ref<UpsertCategoryDto>({
  file: undefined,
  name: '',
  parentCategoryId: undefined,
  id: undefined,
  logo: undefined
})

const isEdit = ref(false)

const show = (data: UpsertCategoryDto | null | Category = null) => {
  dialogVisible.value = true
  submitted.value = false
  if (data) {
    category.value = { ...data }
    isEdit.value = true
  } else {
    category.value = {
      file: undefined,
      name: '',
      parentCategoryId: undefined
    }
    isEdit.value = false
  }
}

const hideDialog = () => {
  dialogVisible.value = false
  submitted.value = false
  emit('hide')
}

const saveCategory = () => {
  submitted.value = true

  if (!category.value.name?.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Name is required',
      life: 3000
    })
    return
  }

  if (!category.value.file && !isEdit.value) {
    toast.add({
      severity: 'error',
      summary: 'Image is required',
      life: 3000
    })
    return
  }

  emit('save', category.value)
  hideDialog()
}

const onSelect = (e: FileUploadSelectEvent) => {
  category.value.file = e.files[0]
}

const imagePreview = computed(() => {
  if (isEdit.value) {
    return category.value.file
      ? URL.createObjectURL(category.value.file)
      : category.value.logo
        ? import.meta.env.VITE_BASE_URL + '/files/' + category.value.logo
        : ''
  }
  return category.value.file ? URL.createObjectURL(category.value.file) : ''
})

const resetImage = () => {
  category.value.file = undefined
  category.value.logo = undefined
}

defineExpose({
  show
})
</script>
<style lang="scss">
/* remove border of p-inputtext  in inputnumber */
.categories-upsert-dialog {
  .p-inputnumber-input {
    border: none;
  }
}
</style>
