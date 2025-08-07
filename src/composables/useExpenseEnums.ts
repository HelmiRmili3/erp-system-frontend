import { computed } from 'vue'

export function useExpenseEnums() {
  // Define expense categories
  const expenseCategories = computed(() => [
    { label: 'Transport', value: 'Transportation' },
    { label: 'Repas', value: 'Meals' },
    { label: 'Hébergement', value: 'Accommodation' },
    { label: 'Fournitures', value: 'Supplies' },
    { label: 'Autres', value: 'Other' }
  ])

  // Define expense statuses
  const expenseStatuses = computed(() => [
    { label: 'En attente', value: 0 },
    { label: 'Approuvé', value: 1 },
    { label: 'Rejeté', value: 2 },
    { label: 'Remboursé', value: 3 }
  ])

  // Get status name by value
  const getExpenseStatusName = (status: number | undefined) => {
    if (status === undefined) return 'N/A'
    const statusOption = expenseStatuses.value.find((s) => s.value === status)
    return statusOption ? statusOption.label : 'N/A'
  }

  return {
    expenseCategories,
    expenseStatuses,
    getExpenseStatusName
  }
}
