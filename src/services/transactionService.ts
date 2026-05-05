import { get } from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

export interface Transaction {
  id: number
  userId: number
  txId: string
  from: string
  to: string
  coin: string
  coinSymbol: string
  coinColor: string
  amount: number
  date: string
  time: string
  status: 'completed' | 'pending' | 'cancelled'
}

export async function getTransactions(userId: number): Promise<Transaction[]> {
  return get<Transaction[]>(ENDPOINTS.transactions(userId))
}
