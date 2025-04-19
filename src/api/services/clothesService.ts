import request from '../request'

// 服装接口定义
export interface Clothes {
  id: number
  name: string
  description?: string
  size: string // 改回必填项
  sizeInfo?: string
  wearingTips?: string
  pricePerDay: number // 日租金
  deposit?: number
  stock: number
  category?: string
  categoryId?: number
  status?: 'available' | 'rented' | 'maintenance'
  rentCount?: number
  images?: string[] // 多张图片的URL集合
  imageUrl?: string // 单图片URL(兼容)
  available: boolean
  createdAt?: string | number[]
  updatedAt?: string | number[]
}

export interface ClothesCreateParams {
  name: string
  description?: string
  size: string // 改回必填项
  sizeInfo?: string
  wearingTips?: string
  pricePerDay: number // 日租金
  deposit?: number
  stock: number
  category?: string
  categoryId?: number
  status?: 'available' | 'rented' | 'maintenance'
  images?: string[]
  imageUrl?: string
  available?: boolean
}

export interface ClothesUpdateParams extends ClothesCreateParams {
  id: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
}

// 定义状态映射
export const clothesStatusMap: Record<string, string> = {
  available: '可租',
  rented: '已租',
  maintenance: '维护中'
}

// 服装API服务
const clothesService = {
  // 获取所有服装（分页）
  async getAllClothes(page = 1, pageSize = 10, filters?: Record<string, any>): Promise<PaginatedResponse<Clothes>> {
    try {
      const params = {
        page,
        pageSize,
        ...filters
      }
      const response = await request.get('/clothes', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 根据ID获取服装详情
  async getClothesById(id: number): Promise<Clothes> {
    try {
      const response = await request.get(`/clothes/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 按分类获取服装
  async getClothesByCategory(category: string | number, page = 1, pageSize = 10): Promise<PaginatedResponse<Clothes>> {
    try {
      const response = await request.get(`/clothes/category/${category}`, {
        params: { page, pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 按关键词搜索服装
  async searchClothes(keyword: string, page = 1, pageSize = 10): Promise<PaginatedResponse<Clothes>> {
    try {
      const response = await request.get('/clothes/search', {
        params: { keyword, page, pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 创建服装（管理员权限）
  async createClothes(clothesData: ClothesCreateParams): Promise<Clothes> {
    try {
      const response = await request.post('/clothes', clothesData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 更新服装（管理员权限）
  async updateClothes(id: number, clothesData: Partial<ClothesCreateParams>): Promise<Clothes> {
    try {
      const response = await request.put(`/clothes/${id}`, clothesData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 删除服装（管理员权限）
  async deleteClothes(id: number): Promise<boolean> {
    try {
      const response = await request.delete(`/clothes/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default clothesService 