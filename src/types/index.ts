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

// 订单状态类型
export type OrderStatus = 'pending' | 'paid' | 'renting' | 'returned' | 'cancelled'

// 订单类型
export interface Order {
  id: number
  userId: number
  clothingId: number
  clothingName: string
  clothingImage: string
  size: string
  startDate: string
  endDate: string
  totalAmount: number
  deposit: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

// API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
} 