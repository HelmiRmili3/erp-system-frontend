import { computed } from 'vue'

export function usePayrollEnums() {
  // Define view statuses
  const viewStatuses = computed(() => [
    { label: 'Non vu', value: false },
    { label: 'Vu', value: true }
  ])

  // Get view status name by value
  const getViewStatusName = (isViewed: boolean | undefined) => {
    if (isViewed === undefined) return 'N/A'
    const statusOption = viewStatuses.value.find((s) => s.value === isViewed)
    return statusOption ? statusOption.label : 'N/A'
  }

  return {
    viewStatuses,
    getViewStatusName
  }
}
