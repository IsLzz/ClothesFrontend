import request from '../request'

// 订单项接口
export interface OrderItem {
  id: number
  orderId: number
  clothesId: number
  quantity: number
  pricePerDay: number
  days: number
  startDate: string | number[]
  endDate: string | number[]
  subtotal: number
}

// 创建订单项参数
export interface OrderItemParams {
  clothesId: number
  quantity: number
  startDate: string
  endDate: string
}

// 订单接口
export interface Order {
  id: number | string
  userId: number
  userName?: string
  phone?: string
  address?: string
  totalAmount: number
  status: 'pending' | 'paid' | 'renting' | 'returned' | 'completed' | 'cancelled' | 'canceled' | 'confirmed'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  deposit?: number
  createdAt: string | number[]
  paidAt?: string | number[] | null
  orderItems: OrderItem[]
  logs?: Array<{
    action: string
    createdAt: string | number[]
  }>
}

// 创建订单参数
export interface CreateOrderParams {
  userId: number
  orderItems: OrderItemParams[]
}

// 分页响应接口
export interface PaginatedResponse<T> {
  items: T[]
  total: number
}

// 订单API服务
const orderService = {
  // 创建订单
  async createOrder(orderData: CreateOrderParams): Promise<Order> {
    try {
      const response = await request.post('/orders', orderData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 获取所有订单（分页，管理员权限）
  async getAllOrders(page = 1, pageSize = 10): Promise<PaginatedResponse<Order>> {
    try {
      const response = await request.get('/orders', {
        params: { page, pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 获取用户订单
  async getUserOrders(userId: number, page = 1, pageSize = 10): Promise<PaginatedResponse<Order>> {
    try {
      const response = await request.get(`/orders/user/${userId}`, {
        params: { page, pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 获取订单详情
  async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await request.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 取消订单
  async cancelOrder(orderId: number): Promise<boolean> {
    try {
      const response = await request.put(`/orders/${orderId}/cancel`, {})
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 完成订单（管理员权限）
  async completeOrder(orderId: number): Promise<boolean> {
    try {
      const response = await request.put(`/orders/${orderId}/complete`, {})
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 更新订单状态（管理员权限）
  async updateOrderStatus(orderId: number, status: 'pending' | 'confirmed' | 'canceled' | 'completed'): Promise<boolean> {
    try {
      const response = await request.put(`/orders/${orderId}/status`, null, {
        params: { status }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default orderService 