import { get, post } from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  avatar: string | null
  balance: number
  currency: string
}

interface UserRecord extends User {
  password: string
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const users = await get<UserRecord[]>(ENDPOINTS.users)
    const match = users.find(
      (u) => u.email === email && u.password === password
    )
    if (!match) return null
    // Strip password before returning
    const { password: _pw, ...user } = match
    return user
  } catch {
    return null
  }
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<User | null> {
  try {
    // Check if email already exists
    const existing = await get<UserRecord[]>(`${ENDPOINTS.users}?email=${encodeURIComponent(email)}`)
    if (existing.length > 0) return null

    const newUser: Omit<UserRecord, 'id'> = {
      email,
      password,
      firstName,
      lastName,
      role: 'Member',
      avatar: null,
      balance: 0,
      currency: 'USD',
    }

    const created = await post<UserRecord>(ENDPOINTS.users, newUser)
    const { password: _pw, ...user } = created
    return user
  } catch {
    return null
  }
}
