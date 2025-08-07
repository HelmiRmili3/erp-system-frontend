import { ref } from 'vue'

export const useAttendanceEnums = () => {
  const checkInMethods = ref([
    { label: 'Website', value: 0 },
    { label: 'Application', value: 1 },
    { label: 'Machine', value: 2 },
    { label: 'QrCode', value: 3 },
    { label: 'NFC', value: 4 }
  ])

  const checkOutMethods = ref([
    { label: 'Website', value: 0 },
    { label: 'Application', value: 1 },
    { label: 'Machine', value: 2 },
    { label: 'QrCode', value: 3 },
    { label: 'NFC', value: 4 }
  ])

  const getCheckInMethodName = (method: number) => {
    return checkInMethods.value.find((m) => m.value === method)?.label || 'Inconnu'
  }

  const getCheckOutMethodName = (method: number) => {
    return checkOutMethods.value.find((m) => m.value === method)?.label || 'Inconnu'
  }

  return { getCheckInMethodName, getCheckOutMethodName, checkInMethods, checkOutMethods }
}
