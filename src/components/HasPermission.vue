<template>
  <slot v-if="isAllowed"></slot>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { usePermissions } from '@/composables/usePermissions';
import type { Role, Permission } from '@/permissions';

export default defineComponent({
  name: 'HasPermission',
  props: {
    permission: {
      type: String as () => Permission,
      default: undefined,
    },
    role: {
      type: String as () => Role,
      default: undefined,
    },
  },
  setup(props) {
    const { hasPermission, hasRole } = usePermissions();

    // Determine if the user is allowed based on permission or role
    const isAllowed = computed(() => {
      if (props.permission) {
        return hasPermission(props.permission);
      }
      if (props.role) {
        return hasRole(props.role);
      }
      return false;
    });

    return { isAllowed };
  },
});
</script>