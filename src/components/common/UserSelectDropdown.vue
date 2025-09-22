<script setup lang="ts">
import { useAdminStore } from '@/stores/admin.store'
import { useAppStore } from '@/stores/app.store'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const props = defineProps<{ modelValue: string | null }>()
const emit = defineEmits(['update:modelValue'])

const adminStore = useAdminStore()
const appStore = useAppStore()
const { users } = storeToRefs(adminStore)

onMounted(() => {
  if (!users.value.length) {
    adminStore.fetchUsers()
  }
})

const selectedUser = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <Dropdown
    v-model="selectedUser"
    :options="users"
    optionLabel="fullName"
    optionValue="id"
    placeholder="Sélectionner un utilisateur"
    class="border border-gray-300 rounded-lg"
    showClear
  >
    <template #option="slotProps">
      <div class="flex items-center gap-2">
        <img
          :src="`${appStore.baseURL + slotProps.option.fileUrl}`"
          class="w-6 h-6 rounded-full object-cover border"
        />
        <span>{{ slotProps.option.fullName }}</span>
      </div>
    </template>
  </Dropdown>
</template>
