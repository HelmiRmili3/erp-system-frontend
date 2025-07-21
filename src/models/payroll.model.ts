export interface Payroll {
  id: number
  userId: string
  period: string
  baseSalary: number
  bonuses: number
  deductions: number
  netSalary: number
  fileUrl: string
  isViewedByEmployee: boolean
}
