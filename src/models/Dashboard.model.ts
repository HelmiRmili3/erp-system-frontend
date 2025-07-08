export interface Stats {
    title: string
    pourcentage: string
    isUp: boolean
    value: string
    icon: any
    color: string
    background: string
}
export interface DashboardOrder {
    id: number
    name: string
    status: string
    amount: string
    mode: string
}
export interface DashboardProduct {
    id: number
    label: string
    totalOrders: number
    image: string
}
// export interface StatsResponse {
//     id: number
//     name: string
//     totalProducts: number
//     image: string
// }