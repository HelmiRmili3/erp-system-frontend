// Define AbsenceType enum mapping (matching Backend.Domain.Enums.AbsenceType)
const absenceTypeMap: { [key in 0 | 1 | 2 | 3 | 4]: string } = {
  0: 'Vacation',
  1: 'Sick',
  2: 'Personal',
  3: 'Bereavement',
  4: 'Other'
} as const

// Define AbsenceStatus enum mapping (matching Backend.Domain.Enums.AbsenceStatus)
const absenceStatusMap: { [key in 0 | 1 | 2 | 3]: string } = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Cancelled'
} as const

export const useAbsenceEnums = () => {
  // Function to get AbsenceType name from value
  const getAbsenceTypeName = (type: number | undefined | null): string => {
    return type != null && type in absenceTypeMap
      ? absenceTypeMap[type as keyof typeof absenceTypeMap]
      : 'Unknown'
  }

  // Function to get AbsenceStatus name from value
  const getAbsenceStatusName = (status: number | undefined | null): string => {
    return status != null && status in absenceStatusMap
      ? absenceStatusMap[status as keyof typeof absenceStatusMap]
      : 'Unknown'
  }

  // Expose the raw mappings for use in select options or other scenarios
  const absenceTypes = Object.entries(absenceTypeMap).map(([value, label]) => ({
    value: parseInt(value),
    label
  }))

  const absenceStatuses = Object.entries(absenceStatusMap).map(([value, label]) => ({
    value: parseInt(value),
    label
  }))

  return {
    getAbsenceTypeName,
    getAbsenceStatusName,
    absenceTypes,
    absenceStatuses
  } as const
}
