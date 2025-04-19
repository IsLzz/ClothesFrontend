// 用户相关类型
export interface User {
  id: number
  account: string
  nickname: string
  email?: string
  phone?: string
  avatar?: string
  gender: number
  roles: string
  lastLoginTime?: string
  lastLoginIp?: string
  createTime: string
}

// 登录响应类型
export interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: number
  user: User
}

// 服装相关类型
export interface Clothing {
  id: number
  name: string
  description?: string
  size: string
  pricePerDay: number
  stock: number
  category?: string
  imageUrl?: string
  available: boolean
}

// 订单状态类型
export type OrderStatus = 'pending' | 'confirmed' | 'canceled' | 'completed'

// 支付状态类型
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

// 订单项类型
export interface OrderItem {
  id: number
  orderId: number
  clothesId: number
  quantity: number
  pricePerDay: number
  days: number
  startDate: string
  endDate: string
  subtotal: number
}

// 订单类型
export interface Order {
  id: number
  userId: number
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  orderItems: OrderItem[]
}

// 租赁记录类型
export interface Rental {
  id: number
  orderItemId: number
  userId: number
  clothesId: number
  startDate: string
  endDate: string
  returned: boolean
  returnDate?: string
  lateFee?: number
  rentalDays: number
}

// 分页响应
export interface PageResponse<T> {
  items: T[]
  total: number
}

// API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  time: string
} 