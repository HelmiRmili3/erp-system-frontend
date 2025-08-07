import { ref } from 'vue'

export const useContractEnums = () => {
  const contractTypes = ref([
    { label: 'Permanent', value: 0 },
    { label: 'Temporary', value: 1 },
    { label: 'Freelance', value: 2 }
  ])

  const employeeStatuses = ref([
    { label: 'Active', value: 0 },
    { label: 'Inactive', value: 1 },
    { label: 'Terminated', value: 2 }
  ])

  const getContractTypeName = (type: number) => {
    return contractTypes.value.find((t) => t.value === type)?.label || 'Inconnu'
  }

  const getEmployeeStatusName = (status: number) => {
    return employeeStatuses.value.find((s) => s.value === status)?.label || 'Inconnu'
  }

  return { contractTypes, employeeStatuses, getContractTypeName, getEmployeeStatusName }
}
