export interface Absence {
  id: number
  userId: string
  startDate: string
  endDate: string
  absenceType: number
  statusType: number
  reason: string
}

export interface UpdateAbsence {
  startDate: string
  endDate: string
  absenceType: number
  reason: string
  id: number
}

export interface CreateAbsence {
  startDate: string
  endDate: string
  absenceType: number
  reason: string
}
