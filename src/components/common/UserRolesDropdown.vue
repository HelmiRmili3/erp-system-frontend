<template>
  <div class="flex flex-wrap gap-1 items-center">
    <!-- Display existing roles -->
    <span
      v-for="role in roles"
      :key="role"
      class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
    >
      {{ role }}
      <button
        type="button"
        @click="removeRole(role)"
        class="text-red-500 hover:text-red-700 text-xs"
      >
        ×
      </button>
    </span>

    <!-- Dropdown to add new role -->
    <Dropdown
      :options="availableRoles"
      optionLabel="name"
      optionValue="name"
      placeholder="+ Add Role"
      class="p-dropdown-sm"
      @change="onSelectRole"
      :disabled="availableRoles.length === 0"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dropdown from 'primevue/dropdown'

const props = defineProps<{
  roles: string[]
  allRoles: { name: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:roles', roles: string[]): void
  (e: 'role-added', role: string): void
  (e: 'role-removed', role: string): void
}>()

const selectedRole = ref<string | null>(null)

// Compute roles that can still be added
const availableRoles = computed(() => {
  return props.allRoles.filter((r) => !props.roles.includes(r.name))
})

const onSelectRole = (role: string) => {
  if (!role) return
  emit('role-added', role)
  emit('update:roles', [...props.roles, role])
  selectedRole.value = null
}

const removeRole = (role: string) => {
  const updatedRoles = props.roles.filter((r) => r !== role)
  emit('role-removed', role)
  emit('update:roles', updatedRoles)
}
</script>

<style scoped>
/* Small spacing adjustments */
.p-dropdown-sm {
  min-width: 120px;
}
</style>
