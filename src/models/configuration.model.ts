import type { Category } from './Category.model'

export const currencies = [
  {
    label: 'Euro',
    value: '€'
  },
  {
    label: 'Dollar',
    value: '$'
  },
  {
    label: 'Tunisian Dinar',
    value: 'TND'
  }
]
export interface configuration {
  key: string
  value: string
  created_at: string
  updated_at: string
}

export interface DeliveryZone {
  id: number
  code_postal: string
  ville: string
  delivery_price: number
  min_order_amount: number
  created_at: string
  updated_at: string
}

export interface Tax {
  id: number
  name: string
  percentage: number
  categories?: Category[]
}
