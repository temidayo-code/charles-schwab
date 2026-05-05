import { get } from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

export interface Order {
  id: number
  userId: number
  type: 'sell' | 'buy'
  coin: string
  price: number
  amount: number
  total: number
  status: string
}

export async function getOrders(userId: number, type: 'sell' | 'buy'): Promise<Order[]> {
  return get<Order[]>(ENDPOINTS.orders(userId, type))
}
