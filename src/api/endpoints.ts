export const ENDPOINTS = {
  users: '/users',
  wallets: (userId: number) => `/wallets?userId=${userId}`,
  orders: (userId: number, type: string) => `/orders?userId=${userId}&type=${type}`,
  transactions: (userId: number) => `/transactions?userId=${userId}`,
  marketStats: '/marketStats',
}
