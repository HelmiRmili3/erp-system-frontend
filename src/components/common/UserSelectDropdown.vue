<script setup lang="ts">
import { useAdminStore } from '@/stores/admin.store'
import { useAppStore } from '@/stores/app.store'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const props = defineProps<{
  modelValue: string | null
}>()
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

// Filter users to only show those with "admin" role
const adminUsers = computed(() => {
  return users.value.filter((user) => user.roles && !user.roles.includes('Administrator'))
})
</script>

<template>
  <Dropdown
    v-model="selectedUser"
    :options="adminUsers"
    optionLabel="fullName"
    optionValue="id"
    placeholder="Sélectionner un administrateur"
    class="border border-gray-300 rounded-lg"
    showClear
  >
    <template #option="slotProps">
      <div class="flex items-center gap-2">
        <img
          :src="
            slotProps.option.fileUrl
              ? `${appStore.baseURL + slotProps.option.fileUrl}`
              : 'https://avatar.iran.liara.run/public/17'
          "
          class="w-6 h-6 rounded-full object-cover border"
          alt="User Avatar"
        />
        <span>{{ slotProps.option.fullName }}</span>
      </div>
    </template>
  </Dropdown>
</template>
