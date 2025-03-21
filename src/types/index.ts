// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  phone?: string
  createdAt: string
}

// 服装相关类型
export interface Clothing {
  id: number
  name: string
  description: string
  price: number
  deposit: number
  images: string[]
  sizes: string[]
  category: string
  brand: string
  status: 'available' | 'rented' | 'maintenance'
}

// 订单相关类型
export interface Order {
  id: number
  userId: number
  clothingId: number
  startDate: string
  endDate: string
  status: 'pending' | 'paid' | 'renting' | 'returned' | 'cancelled'
  totalAmount: number
  deposit: number
  size: string
  createdAt: string
}

// API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
} 